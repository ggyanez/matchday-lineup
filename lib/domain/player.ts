import type { Position } from "./position";

export interface Player {
  id: string;
  name: string;
  /** The position this player performs best in. */
  primaryPosition: Position;
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
  if (!input.primaryPosition) return false;
  if (input.secondaryPositions && !Array.isArray(input.secondaryPositions)) return false;
  return true;
}
