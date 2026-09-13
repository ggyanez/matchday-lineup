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

/** One-sentence, plain-language explanation of what each position actually does. */
export const POSITION_DESCRIPTIONS: Record<Position, string> = {
  ARQ: "The last line of defense — the only player allowed to use their hands, and only inside the penalty area.",
  DFC: "Marks the middle of the defense, breaking up attacks and winning aerial duels near their own goal.",
  LI: "Defends the left flank, tracking opposing wingers and supporting attacks down that side.",
  LD: "Defends the right flank, tracking opposing wingers and supporting attacks down that side.",
  CAI: "A left back who pushes further forward, providing width in both defense and attack.",
  CAD: "A right back who pushes further forward, providing width in both defense and attack.",
  MCD: "Sits in front of the defense, breaking up opposition attacks and shielding the back line.",
  MC: "Links defense and attack through the middle, involved in both winning the ball and building play.",
  MDI: "Covers the left side of midfield, contributing to both defense and attack down that flank.",
  MDD: "Covers the right side of midfield, contributing to both defense and attack down that flank.",
  MCO: "Plays just behind the strikers, creating chances and linking midfield to attack.",
  EXI: "An attacker who hugs the left touchline, using pace and dribbling to beat defenders and create chances.",
  EXD: "An attacker who hugs the right touchline, using pace and dribbling to beat defenders and create chances.",
  SD: "Plays just behind the main striker, dropping deep to link play while still threatening the goal.",
  DC: "The furthest player forward, focused on scoring goals and leading the attack.",
};

/** Display order and labels for grouping players by their line. */
export const POSITION_GROUP_ORDER: PositionGroup[] = [
  "goalkeeper",
  "defense",
  "midfield",
  "attack",
];

export const POSITION_GROUP_LABELS: Record<PositionGroup, string> = {
  goalkeeper: "Goalkeepers",
  defense: "Defenders",
  midfield: "Midfielders",
  attack: "Forwards",
};
