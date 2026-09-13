import type { Position } from "./position";

export interface Player {
  id: string;
  name: string;
  /**
   * Positions this player performs best in, in order of preference — a
   * player can be equally (or almost equally) good in more than one. The
   * first listed is treated as a slightly better fit than the rest.
   * Empty if that hasn't been figured out yet (e.g. a new player who
   * hasn't played enough to tell). A player with no primary position can
   * still be confirmed for a match and assigned wherever fits — the
   * recommendation just won't treat them as a natural fit for any
   * particular slot.
   */
  primaryPositions: Position[];
  /** Other positions this player can cover, in order of preference. */
  secondaryPositions: Position[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type PlayerInput = Pick<
  Player,
  "name" | "primaryPositions" | "secondaryPositions" | "notes"
>;

export function isValidPlayerInput(input: Partial<PlayerInput>): input is PlayerInput {
  if (!input.name || input.name.trim().length === 0) return false;
  if (input.primaryPositions && !Array.isArray(input.primaryPositions)) return false;
  if (input.secondaryPositions && !Array.isArray(input.secondaryPositions)) return false;
  return true;
}

/** A short "CB/RB" style label for a player's primary positions, or "" if none are set. */
export function primaryPositionLabel(player: Pick<Player, "primaryPositions">): string {
  return player.primaryPositions.join("/");
}
