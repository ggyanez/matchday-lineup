import type { Player, PlayerInput } from "../domain/player";
import type { JsonDocumentStore } from "./json-store";
import { createJsonStore } from "./store";

interface PlayersDocument {
  players: Player[];
}

// Players belong to a team, not a user — one store per team, keyed by
// teamId, each backed by its own file (teams/<teamId>/players.json).
// Cached so repeated calls within the same process reuse the same
// store instance instead of re-constructing it every time.
const storesByTeam = new Map<string, JsonDocumentStore<PlayersDocument>>();

function getStore(teamId: string): JsonDocumentStore<PlayersDocument> {
  let store = storesByTeam.get(teamId);
  if (!store) {
    store = createJsonStore<PlayersDocument>(`teams/${teamId}/players.json`, { players: [] });
    storesByTeam.set(teamId, store);
  }
  return store;
}

function generateId(): string {
  return `p_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Upgrades records saved before newer fields existed. Safe to run on
 * already-migrated records — they pass through unchanged.
 *  - `primaryPosition: Position | null` -> `primaryPositions: Position[]`
 *  - missing `preferredFoot` -> `null` (not set)
 *  - missing `injuryStatus` -> `"healthy"`
 *  - missing `membershipStatus` -> `"regular"` (every player recorded
 *    before this field existed was, in practice, an established regular)
 */
function migratePlayer(
  raw: Player & { primaryPosition?: string | null }
): Player {
  const { primaryPosition, ...rest } = raw;
  return {
    ...rest,
    primaryPositions: Array.isArray(raw.primaryPositions)
      ? raw.primaryPositions
      : primaryPosition
        ? [primaryPosition as Player["primaryPositions"][number]]
        : [],
    preferredFoot: raw.preferredFoot ?? null,
    injuryStatus: raw.injuryStatus ?? "healthy",
    membershipStatus: raw.membershipStatus ?? "regular",
  };
}

export async function listPlayers(teamId: string): Promise<Player[]> {
  const { players } = await getStore(teamId).read();
  return players.map(migratePlayer).sort((a, b) => a.name.localeCompare(b.name));
}

export async function getPlayer(teamId: string, id: string): Promise<Player | null> {
  const { players } = await getStore(teamId).read();
  const found = players.find((p) => p.id === id);
  return found ? migratePlayer(found) : null;
}

export async function createPlayer(teamId: string, input: PlayerInput): Promise<Player> {
  const now = new Date().toISOString();
  const player: Player = {
    id: generateId(),
    name: input.name.trim(),
    primaryPositions: input.primaryPositions ?? [],
    secondaryPositions: input.secondaryPositions ?? [],
    preferredFoot: input.preferredFoot ?? null,
    injuryStatus: input.injuryStatus ?? "healthy",
    membershipStatus: input.membershipStatus ?? "regular",
    notes: input.notes?.trim() || undefined,
    createdAt: now,
    updatedAt: now,
  };

  await getStore(teamId).update(
    (doc) => ({ players: [...doc.players, player] }),
    `Add player: ${player.name}`
  );

  return player;
}

export async function updatePlayer(teamId: string, id: string, input: PlayerInput): Promise<Player> {
  let updated: Player | null = null;

  await getStore(teamId).update((doc) => {
    const players = doc.players.map((p) => {
      if (p.id !== id) return p;
      updated = {
        ...migratePlayer(p),
        name: input.name.trim(),
        primaryPositions: input.primaryPositions ?? [],
        secondaryPositions: input.secondaryPositions ?? [],
        preferredFoot: input.preferredFoot ?? null,
        injuryStatus: input.injuryStatus ?? "healthy",
        membershipStatus: input.membershipStatus ?? "regular",
        notes: input.notes?.trim() || undefined,
        updatedAt: new Date().toISOString(),
      };
      return updated;
    });
    return { players };
  }, `Update player: ${input.name}`);

  if (!updated) throw new Error(`Player not found: ${id}`);
  return updated;
}

export async function deletePlayer(teamId: string, id: string): Promise<void> {
  await getStore(teamId).update(
    (doc) => ({ players: doc.players.filter((p) => p.id !== id) }),
    `Remove player: ${id}`
  );
}
