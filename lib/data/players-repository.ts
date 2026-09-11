import type { Player, PlayerInput } from "../domain/player";
import { createJsonStore } from "./store";

interface PlayersDocument {
  players: Player[];
}

const store = createJsonStore<PlayersDocument>("players.json", { players: [] });

function generateId(): string {
  return `p_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

export async function listPlayers(): Promise<Player[]> {
  const { players } = await store.read();
  return [...players].sort((a, b) => a.name.localeCompare(b.name));
}

export async function getPlayer(id: string): Promise<Player | null> {
  const { players } = await store.read();
  return players.find((p) => p.id === id) ?? null;
}

export async function createPlayer(input: PlayerInput): Promise<Player> {
  const now = new Date().toISOString();
  const player: Player = {
    id: generateId(),
    name: input.name.trim(),
    primaryPosition: input.primaryPosition,
    secondaryPositions: input.secondaryPositions ?? [],
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
        ...p,
        name: input.name.trim(),
        primaryPosition: input.primaryPosition,
        secondaryPositions: input.secondaryPositions ?? [],
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
