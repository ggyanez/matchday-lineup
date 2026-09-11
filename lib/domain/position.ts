/**
 * Football positions supported across the app.
 *
 * Codes follow the classic Winning Eleven / PES formation-editor
 * nomenclature (e.g. "ARQ" for goalkeeper), which is what most amateur
 * players in Spanish-speaking leagues already use day to day to talk
 * about positions.
 */
export const POSITIONS = [
  "ARQ",
  "DFC",
  "LI",
  "LD",
  "CAI",
  "CAD",
  "MCD",
  "MC",
  "MDI",
  "MDD",
  "MCO",
  "EXI",
  "EXD",
  "SD",
  "DC",
] as const;

export type Position = (typeof POSITIONS)[number];

export const POSITION_LABELS: Record<Position, string> = {
  ARQ: "Goalkeeper",
  DFC: "Center Back",
  LI: "Left Back",
  LD: "Right Back",
  CAI: "Left Wing Back",
  CAD: "Right Wing Back",
  MCD: "Defensive Midfielder",
  MC: "Central Midfielder",
  MDI: "Left Midfielder",
  MDD: "Right Midfielder",
  MCO: "Attacking Midfielder",
  EXI: "Left Winger",
  EXD: "Right Winger",
  SD: "Second Striker",
  DC: "Center Forward",
};

/**
 * Broad tactical line each position belongs to. Used as a fallback
 * compatibility signal when no exact position match is available
 * (e.g. a MC filling in for a MCD in a pinch).
 */
export type PositionGroup = "goalkeeper" | "defense" | "midfield" | "attack";

export const POSITION_GROUP: Record<Position, PositionGroup> = {
  ARQ: "goalkeeper",
  DFC: "defense",
  LI: "defense",
  LD: "defense",
  CAI: "defense",
  CAD: "defense",
  MCD: "midfield",
  MC: "midfield",
  MDI: "midfield",
  MDD: "midfield",
  MCO: "midfield",
  EXI: "attack",
  EXD: "attack",
  SD: "attack",
  DC: "attack",
};

export function isPosition(value: string): value is Position {
  return (POSITIONS as readonly string[]).includes(value);
}
