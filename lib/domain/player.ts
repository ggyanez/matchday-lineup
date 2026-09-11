import type { Position } from "./position";

export interface Player {
  id: string;
  name: string;
  /**
   * The position this player performs best in, or `null` if that hasn't
   * been figured out yet (e.g. a new player who hasn't played enough to
   * tell). A player with no primary position can still be confirmed for a
   * match and be assigned wherever fits — the recommendation just won't
   * treat them as a natural fit for any particular slot.
   */
  primaryPosition: Position | null;
  /** Other positions this player can cover, in order of preference. */
  secondaryPositions: Position[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type PlayerInput = Pick<
  Player,
  "name" | "primaryPosition" | "secondaryPositions" | "notes"
>;

export function isValidPlayerInput(input: Partial<PlayerInput>): input is PlayerInput {
  if (!input.name || input.name.trim().length === 0) return false;
  if (input.primaryPosition != null && typeof input.primaryPosition !== "string") return false;
  if (input.secondaryPositions && !Array.isArray(input.secondaryPositions)) return false;
  return true;
}
