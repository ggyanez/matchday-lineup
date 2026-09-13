import type { Player, PlayerInput } from "./domain/player";
import type { FormationName } from "./domain/formation";
import type { FormationRecommendation } from "./lineup/matching";

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `Request failed (${res.status})`);
  }
  return res.json() as Promise<T>;
}

export function fetchPlayers(): Promise<{ players: Player[] }> {
  return request("/api/players");
}

export function createPlayerRequest(input: PlayerInput): Promise<{ player: Player }> {
  return request("/api/players", { method: "POST", body: JSON.stringify(input) });
}

export function updatePlayerRequest(
  id: string,
  input: PlayerInput
): Promise<{ player: Player }> {
  return request(`/api/players/${id}`, { method: "PUT", body: JSON.stringify(input) });
}

export function deletePlayerRequest(id: string): Promise<{ ok: true }> {
  return request(`/api/players/${id}`, { method: "DELETE" });
}

export interface LineupResponse {
  best: FormationRecommendation;
  alternatives: FormationRecommendation[];
  explanation: string | null;
}

export function generateLineup(
  playerIds: string[],
  options?: { formations?: FormationName[]; explain?: boolean }
): Promise<LineupResponse> {
  return request("/api/lineup", {
    method: "POST",
    body: JSON.stringify({ playerIds, ...options }),
  });
}

export function fetchFavoriteFormations(): Promise<{ formations: FormationName[] }> {
  return request("/api/formation-favorites");
}

export function saveFavoriteFormations(
  formations: FormationName[]
): Promise<{ formations: FormationName[] }> {
  return request("/api/formation-favorites", {
    method: "PUT",
    body: JSON.stringify({ formations }),
  });
}
