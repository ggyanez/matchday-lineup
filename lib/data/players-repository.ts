import type { Player, PlayerInput } from "../domain/player";
import { createJsonStore } from "./store";

interface PlayersDocument {
  players: Player[];
}

const store = createJsonStore<PlayersDocument>("players.json", { players: [] });

function generateId(): string {
  return `p_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Upgrades records saved before newer fields existed. Safe to run on
 * already-migrated records — they pass through unchanged.
 *  - `primaryPosition: Position | null` -> `primaryPositions: Position[]`
 *  - missing `preferredFoot` -> `null` (not set)
 *  - missing `injuryStatus` -> `"healthy"`
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
  };
}

export async function listPlayers(): Promise<Player[]> {
  const { players } = await store.read();
  return players.map(migratePlayer).sort((a, b) => a.name.localeCompare(b.name));
}

export async function getPlayer(id: string): Promise<Player | null> {
  const { players } = await store.read();
  const found = players.find((p) => p.id === id);
  return found ? migratePlayer(found) : null;
}

export async function createPlayer(input: PlayerInput): Promise<Player> {
  const now = new Date().toISOString();
  const player: Player = {
    id: generateId(),
    name: input.name.trim(),
    primaryPositions: input.primaryPositions ?? [],
    secondaryPositions: input.secondaryPositions ?? [],
    preferredFoot: input.preferredFoot ?? null,
    injuryStatus: input.injuryStatus ?? "healthy",
    notes: input.notes?.trim() || undefined,
    createdAt: now,
    updatedAt: now,
  };

  await store.update(
    (doc) => ({ players: [...doc.players, player] }),
    `Add player: ${player.name}`
  );

  return player;
}

export async function updatePlayer(id: string, input: PlayerInput): Promise<Player> {
  let updated: Player | null = null;

  await store.update((doc) => {
    const players = doc.players.map((p) => {
      if (p.id !== id) return p;
      updated = {
        ...migratePlayer(p),
        name: input.name.trim(),
        primaryPositions: input.primaryPositions ?? [],
        secondaryPositions: input.secondaryPositions ?? [],
        preferredFoot: input.preferredFoot ?? null,
        injuryStatus: input.injuryStatus ?? "healthy",
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

export async function deletePlayer(id: string): Promise<void> {
  await store.update(
    (doc) => ({ players: doc.players.filter((p) => p.id !== id) }),
    `Remove player: ${id}`
  );
}
