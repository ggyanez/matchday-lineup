import type { JsonDocumentStore } from "./json-store";

export interface GithubJsonStoreConfig {
  owner: string;
  repo: string;
  branch: string;
  path: string;
  token: string;
}

const GITHUB_API = "https://api.github.com";
const MAX_WRITE_RETRIES = 3;

/**
 * Production store backed by a file in a GitHub repository, ideally a
 * private one dedicated to data — kept separate from the public code
 * repository so the data never becomes public just because the code is.
 *
 * Every write is a commit via the GitHub Contents API, which gives us a
 * full, free history of every change for no extra effort. Writes are
 * optimistic-locked via the file's blob `sha`; on a conflict (a rare
 * case here, since the app is single-user), we re-read the latest
 * content and re-apply the mutation.
 */
export class GithubJsonStore<T> implements JsonDocumentStore<T> {
  constructor(
    private config: GithubJsonStoreConfig,
    private defaultValue: T
  ) {}

  private get contentsUrl(): string {
    const { owner, repo, path } = this.config;
    return `${GITHUB_API}/repos/${owner}/${repo}/contents/${path}`;
  }

  private get headers(): HeadersInit {
    return {
      Authorization: `Bearer ${this.config.token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    };
  }

  private async fetchCurrent(): Promise<{ value: T; sha: string | null }> {
    const url = `${this.contentsUrl}?ref=${encodeURIComponent(this.config.branch)}`;
    const res = await fetch(url, { headers: this.headers, cache: "no-store" });

    if (res.status === 404) {
      return { value: this.defaultValue, sha: null };
    }
    if (!res.ok) {
      throw new Error(`GitHub read failed (${res.status}): ${await res.text()}`);
    }

    const body = (await res.json()) as { content: string; sha: string };
    const decoded = Buffer.from(body.content, "base64").toString("utf-8");
    return { value: JSON.parse(decoded) as T, sha: body.sha };
  }

  async read(): Promise<T> {
    const { value } = await this.fetchCurrent();
    return value;
  }

  async update(mutate: (current: T) => T, message: string): Promise<T> {
    let lastError: unknown;

    for (let attempt = 0; attempt < MAX_WRITE_RETRIES; attempt++) {
      const { value: current, sha } = await this.fetchCurrent();
      const next = mutate(current);
      const content = Buffer.from(JSON.stringify(next, null, 2), "utf-8").toString("base64");

      const res = await fetch(this.contentsUrl, {
        method: "PUT",
        headers: { ...this.headers, "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          content,
          branch: this.config.branch,
          ...(sha ? { sha } : {}),
        }),
      });

      if (res.ok) return next;

      // 409/422 typically mean the sha is stale (someone/something else
      // wrote in between); re-read and retry the mutation.
      if (res.status === 409 || res.status === 422) {
        lastError = new Error(`GitHub write conflict (${res.status}), retrying...`);
        continue;
      }

      throw new Error(`GitHub write failed (${res.status}): ${await res.text()}`);
    }

    throw lastError ?? new Error("GitHub write failed after retries");
  }
}
