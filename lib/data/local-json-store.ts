import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import type { JsonDocumentStore } from "./json-store";

const DATA_DIR = path.join(process.cwd(), ".data");

/**
 * Development-only store backed by a local JSON file under `.data/`.
 * That directory is gitignored — it never leaves your machine.
 */
export class LocalJsonStore<T> implements JsonDocumentStore<T> {
  private filePath: string;
  private defaultValue: T;

  constructor(fileName: string, defaultValue: T) {
    this.filePath = path.join(DATA_DIR, fileName);
    this.defaultValue = defaultValue;
  }

  async read(): Promise<T> {
    try {
      const raw = await readFile(this.filePath, "utf-8");
      return JSON.parse(raw) as T;
    } catch (err) {
      if (isNotFound(err)) return this.defaultValue;
      throw err;
    }
  }

  async update(mutate: (current: T) => T): Promise<T> {
    const current = await this.read();
    const next = mutate(current);
    // `fileName` can include subdirectories (e.g. "teams/niketator/players.json"),
    // so create the file's own directory, not just DATA_DIR itself.
    await mkdir(path.dirname(this.filePath), { recursive: true });
    await writeFile(this.filePath, JSON.stringify(next, null, 2), "utf-8");
    return next;
  }
}

function isNotFound(err: unknown): boolean {
  return typeof err === "object" && err !== null && "code" in err && err.code === "ENOENT";
}
