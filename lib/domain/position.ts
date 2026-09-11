/**
 * Football positions supported across the app.
 *
 * The list intentionally stays close to common broadcast/scouting
 * abbreviations so it reads naturally to any coach, regardless of
 * league or country.
 */
export const POSITIONS = [
  "GK",
  "CB",
  "LB",
  "RB",
  "LWB",
  "RWB",
  "DM",
  "CM",
  "AM",
  "LM",
  "RM",
  "LW",
  "RW",
  "ST",
  "CF",
] as const;

export type Position = (typeof POSITIONS)[number];

export const POSITION_LABELS: Record<Position, string> = {
  GK: "Goalkeeper",
  CB: "Center Back",
  LB: "Left Back",
  RB: "Right Back",
  LWB: "Left Wing Back",
  RWB: "Right Wing Back",
  DM: "Defensive Midfielder",
  CM: "Central Midfielder",
  AM: "Attacking Midfielder",
  LM: "Left Midfielder",
  RM: "Right Midfielder",
  LW: "Left Winger",
  RW: "Right Winger",
  ST: "Striker",
  CF: "Center Forward",
};

/**
 * Broad tactical line each position belongs to. Used as a fallback
 * compatibility signal when no exact position match is available
 * (e.g. a CM filling in for a DM in a pinch).
 */
export type PositionGroup = "goalkeeper" | "defense" | "midfield" | "attack";

export const POSITION_GROUP: Record<Position, PositionGroup> = {
  GK: "goalkeeper",
  CB: "defense",
  LB: "defense",
  RB: "defense",
  LWB: "defense",
  RWB: "defense",
  DM: "midfield",
  CM: "midfield",
  AM: "midfield",
  LM: "midfield",
  RM: "midfield",
  LW: "attack",
  RW: "attack",
  ST: "attack",
  CF: "attack",
};

export function isPosition(value: string): value is Position {
  return (POSITIONS as readonly string[]).includes(value);
}
