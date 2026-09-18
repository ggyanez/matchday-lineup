/**
 * A team using the app — players and formation favorites belong to a
 * team, not to any individual user. Most of the app today assumes a
 * single team; this exists so that adding more later is a matter of
 * creating another record here, not a rewrite of how data is scoped.
 */
export interface Team {
  /**
   * Stable, URL/path-safe identifier — generated once from the name
   * at creation time and never changed afterward, even if `name` is
   * edited later. Used to scope this team's data files
   * (`teams/<id>/players.json`, etc.), so changing it after the fact
   * would orphan existing data.
   */
  id: string;
  /** Display name, and what's typed into the "Team" field at login (matched case-insensitively). */
  name: string;
  createdAt: string;
}

/** Lowercases and trims for case-insensitive team-name matching at login. */
export function normalizeTeamName(name: string): string {
  return name.trim().toLowerCase();
}

/**
 * Derives a stable, path-safe id from a team name at creation time —
 * lowercased, spaces and separators collapsed to hyphens, anything
 * else stripped. E.g. "Niketator" -> "niketator", "River Plate" ->
 * "river-plate".
 */
export function slugifyTeamName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // strip accents
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
