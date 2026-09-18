import bcrypt from "bcryptjs";
import { normalizeUsername, type User } from "../domain/user";
import { createJsonStore } from "./store";

interface UsersDocument {
  users: User[];
}

// Flat, top-level file (not team-scoped) — login looks up a username
// within a specific team, but the team itself is resolved separately
// (see teams-repository), so there's no need to shard this by team.
const store = createJsonStore<UsersDocument>("users.json", { users: [] });

const BCRYPT_ROUNDS = 12;

function generateId(): string {
  return `u_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

export async function listTeamUsers(teamId: string): Promise<User[]> {
  const { users } = await store.read();
  return users.filter((u) => u.teamId === teamId);
}

/** Case-insensitive match on username, scoped to one team. */
export async function findUserByUsername(teamId: string, username: string): Promise<User | null> {
  const target = normalizeUsername(username);
  const { users } = await store.read();
  return users.find((u) => u.teamId === teamId && normalizeUsername(u.username) === target) ?? null;
}

/**
 * Creates a user on a team. Throws if the username is already taken on
 * that team (case-insensitively) — usernames are not globally unique,
 * since login also asks for the team.
 */
export async function createUser(
  teamId: string,
  username: string,
  password: string
): Promise<User> {
  const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
  const user: User = {
    id: generateId(),
    teamId,
    username: username.trim(),
    passwordHash,
    createdAt: new Date().toISOString(),
  };

  await store.update((doc) => {
    const target = normalizeUsername(username);
    if (doc.users.some((u) => u.teamId === teamId && normalizeUsername(u.username) === target)) {
      throw new Error(`Username "${username}" is already taken on this team.`);
    }
    return { users: [...doc.users, user] };
  }, `Add user: ${user.username} (team ${teamId})`);

  return user;
}

/** Verifies a plaintext password against a user's stored hash. */
export async function verifyPassword(user: User, password: string): Promise<boolean> {
  return bcrypt.compare(password, user.passwordHash);
}
