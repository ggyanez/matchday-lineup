/**
 * A login for one person on one team. For now a user is purely a means
 * of accessing the app on behalf of their team — there's no per-user
 * data or role/permission distinction yet; every user on a team has
 * identical access to that team's players, formations, and lineups.
 */
export interface User {
  id: string;
  teamId: string;
  /** Unique within the team (case-insensitively) — not globally unique, since the team is also chosen at login. */
  username: string;
  /** bcrypt hash — the plaintext password is never stored. */
  passwordHash: string;
  createdAt: string;
}

/** Lowercases and trims for case-insensitive username matching at login. */
export function normalizeUsername(username: string): string {
  return username.trim().toLowerCase();
}

export function isValidUsername(username: string): boolean {
  const trimmed = username.trim();
  return trimmed.length >= 2 && trimmed.length <= 32;
}

export function isValidPassword(password: string): boolean {
  return password.length >= 6;
}
