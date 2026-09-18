import { FORMATION_NAMES, type FormationName } from "../domain/formation";
import type { JsonDocumentStore } from "./json-store";
import { createJsonStore } from "./store";

interface FavoritesDocument {
  formations: FormationName[];
}

// Favorite formations belong to a team, not a user — same per-team
// store-caching pattern as players-repository.
const storesByTeam = new Map<string, JsonDocumentStore<FavoritesDocument>>();

function getStore(teamId: string): JsonDocumentStore<FavoritesDocument> {
  let store = storesByTeam.get(teamId);
  if (!store) {
    store = createJsonStore<FavoritesDocument>(`teams/${teamId}/formation-favorites.json`, {
      formations: [],
    });
    storesByTeam.set(teamId, store);
  }
  return store;
}

export async function listFavoriteFormations(teamId: string): Promise<FormationName[]> {
  const { formations } = await getStore(teamId).read();
  // Defensive against a hand-edited or stale data file naming a formation
  // that no longer exists.
  const known = new Set<string>(FORMATION_NAMES);
  return formations.filter((f) => known.has(f));
}

export async function setFavoriteFormations(
  teamId: string,
  formations: FormationName[]
): Promise<FormationName[]> {
  await getStore(teamId).update(() => ({ formations }), "Update favorite formations");
  return formations;
}
