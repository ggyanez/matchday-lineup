import { FORMATION_NAMES, type FormationName } from "../domain/formation";
import { createJsonStore } from "./store";

interface FavoritesDocument {
  formations: FormationName[];
}

const store = createJsonStore<FavoritesDocument>("formation-favorites.json", { formations: [] });

export async function listFavoriteFormations(): Promise<FormationName[]> {
  const { formations } = await store.read();
  // Defensive against a hand-edited or stale data file naming a formation
  // that no longer exists.
  const known = new Set<string>(FORMATION_NAMES);
  return formations.filter((f) => known.has(f));
}

export async function setFavoriteFormations(formations: FormationName[]): Promise<FormationName[]> {
  await store.update(() => ({ formations }), "Update favorite formations");
  return formations;
}
