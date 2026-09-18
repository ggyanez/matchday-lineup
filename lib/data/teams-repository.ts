import { normalizeTeamName, slugifyTeamName, type Team } from "../domain/team";
import { createJsonStore } from "./store";

interface TeamsDocument {
  teams: Team[];
}

// A flat, top-level file (not team-scoped, for obvious reasons) — the
// registry every other team-scoped file is keyed off of.
const store = createJsonStore<TeamsDocument>("teams.json", { teams: [] });

export async function listTeams(): Promise<Team[]> {
  const { teams } = await store.read();
  return teams;
}

export async function getTeam(id: string): Promise<Team | null> {
  const { teams } = await store.read();
  return teams.find((t) => t.id === id) ?? null;
}

/** Case-insensitive match on the team's display name — used at login. */
export async function findTeamByName(name: string): Promise<Team | null> {
  const target = normalizeTeamName(name);
  const { teams } = await store.read();
  return teams.find((t) => normalizeTeamName(t.name) === target) ?? null;
}

/**
 * Creates a team, deriving its stable `id` from `name` at this moment
 * only — the id never changes afterward even if the team is renamed.
 * Throws if the derived id or the name (case-insensitively) is already
 * taken.
 */
export async function createTeam(name: string): Promise<Team> {
  const id = slugifyTeamName(name);
  if (!id) throw new Error(`Team name doesn't produce a usable id: "${name}"`);

  const existingByName = await findTeamByName(name);
  if (existingByName) throw new Error(`A team named "${existingByName.name}" already exists.`);

  const team: Team = { id, name: name.trim(), createdAt: new Date().toISOString() };

  await store.update((doc) => {
    if (doc.teams.some((t) => t.id === id)) {
      throw new Error(`A team with id "${id}" already exists.`);
    }
    return { teams: [...doc.teams, team] };
  }, `Add team: ${team.name}`);

  return team;
}
