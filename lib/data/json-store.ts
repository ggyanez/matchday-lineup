/**
 * A minimal persistence abstraction: a single JSON document that can be
 * read in full and updated atomically. Two implementations exist:
 *
 *  - `LocalJsonStore`, backed by a file on disk, for local development.
 *  - `GithubJsonStore`, backed by a file in a (private) GitHub repository,
 *    for production. Every write becomes a commit, which doubles as a
 *    free, permanent change history.
 *
 * `update()` takes a mutator function rather than the new value directly
 * so implementations can retry on write conflicts by re-reading the
 * latest state and re-applying the mutation.
 */
export interface JsonDocumentStore<T> {
  read(): Promise<T>;
  update(mutate: (current: T) => T, message: string): Promise<T>;
}
