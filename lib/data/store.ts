import type { JsonDocumentStore } from "./json-store";
import { LocalJsonStore } from "./local-json-store";
import { GithubJsonStore } from "./github-json-store";

/**
 * Picks the storage backend based on environment configuration.
 *
 *  - `DATA_BACKEND=github` (recommended for production): persists to a
 *    GitHub repository. Requires GITHUB_DATA_OWNER, GITHUB_DATA_REPO and
 *    GITHUB_DATA_TOKEN; GITHUB_DATA_BRANCH defaults to "main".
 *  - anything else (the default, convenient for local development):
 *    persists to a JSON file under `.data/`, which is gitignored.
 */
export function createJsonStore<T>(fileName: string, defaultValue: T): JsonDocumentStore<T> {
  const backend = process.env.DATA_BACKEND ?? "local";

  if (backend === "github") {
    return new GithubJsonStore<T>(
      {
        owner: requireEnv("GITHUB_DATA_OWNER"),
        repo: requireEnv("GITHUB_DATA_REPO"),
        branch: process.env.GITHUB_DATA_BRANCH ?? "main",
        path: fileName,
        token: requireEnv("GITHUB_DATA_TOKEN"),
      },
      defaultValue
    );
  }

  return new LocalJsonStore<T>(fileName, defaultValue);
}

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}
