import type { Position } from "./position";

/**
 * A single spot on the pitch that a formation needs to fill.
 *
 * `x`/`y` are percentages (0-100) used purely for rendering the pitch
 * diagram, with y=0 at the goalkeeper's line and y=100 at the opposing
 * goal line.
 */
export interface FormationSlot {
  id: string;
  position: Position;
  x: number;
  y: number;
}

/**
 * Every formation commonly used in modern football, grouped by back-line
 * size. Genuinely obsolete historical shapes (the 1880s 2-3-5 pyramid, the
 * old WM system) are deliberately left out — nobody actually lines up in
 * them anymore.
 */
export type FormationName =
  // Back four
  | "4-4-2"
  | "4-4-2 diamond"
  | "4-4-1-1"
  | "4-3-3"
  | "4-2-3-1"
  | "4-1-4-1"
  | "4-3-2-1"
  | "4-2-2-2"
  | "4-2-4"
  | "4-1-3-2"
  | "4-5-1"
  // Back three
  | "3-4-3"
  | "3-4-2-1"
  | "3-4-1-2"
  | "3-5-2"
  | "3-1-4-2"
  | "3-5-1-1"
  // Back five
  | "5-3-2"
  | "5-4-1"
  | "5-2-2-1"
  | "5-2-3";

export interface Formation {
  name: FormationName;
  description: string;
  slots: FormationSlot[];
}

export const FORMATIONS: Record<FormationName, Formation> = {
  "4-4-2": {
    name: "4-4-2",
    description: "Balanced, two banks of four behind a strike partnership.",
    slots: [
      { id: "ARQ", position: "ARQ", x: 50, y: 9 },
      { id: "LI", position: "LI", x: 20, y: 23 },
      { id: "DFC-1", position: "DFC", x: 38, y: 21 },
      { id: "DFC-2", position: "DFC", x: 62, y: 21 },
      { id: "LD", position: "LD", x: 80, y: 23 },
      { id: "MDI", position: "MDI", x: 20, y: 50 },
      { id: "MC-1", position: "MC", x: 38, y: 48 },
      { id: "MC-2", position: "MC", x: 62, y: 48 },
      { id: "MDD", position: "MDD", x: 80, y: 50 },
      { id: "DC-1", position: "DC", x: 38, y: 82 },
      { id: "DC-2", position: "DC", x: 62, y: 82 },
    ],
  },
  "4-4-2 diamond": {
    name: "4-4-2 diamond",
    description: "A narrow central diamond feeds two strikers, trading width for control.",
    slots: [
      { id: "ARQ", position: "ARQ", x: 50, y: 9 },
      { id: "LI", position: "LI", x: 20, y: 23 },
      { id: "DFC-1", position: "DFC", x: 38, y: 21 },
      { id: "DFC-2", position: "DFC", x: 62, y: 21 },
      { id: "LD", position: "LD", x: 80, y: 23 },
      { id: "MCD", position: "MCD", x: 50, y: 38 },
      { id: "MC-1", position: "MC", x: 30, y: 52 },
      { id: "MC-2", position: "MC", x: 70, y: 52 },
      { id: "MCO", position: "MCO", x: 50, y: 62 },
      { id: "DC-1", position: "DC", x: 38, y: 85 },
      { id: "DC-2", position: "DC", x: 62, y: 85 },
    ],
  },
  "4-4-1-1": {
    name: "4-4-1-1",
    description: "A withdrawn forward links midfield and attack, feeding the striker ahead.",
    slots: [
      { id: "ARQ", position: "ARQ", x: 50, y: 9 },
      { id: "LI", position: "LI", x: 20, y: 23 },
      { id: "DFC-1", position: "DFC", x: 38, y: 21 },
      { id: "DFC-2", position: "DFC", x: 62, y: 21 },
      { id: "LD", position: "LD", x: 80, y: 23 },
      { id: "MDI", position: "MDI", x: 15, y: 48 },
      { id: "MC-1", position: "MC", x: 38, y: 45 },
      { id: "MC-2", position: "MC", x: 62, y: 45 },
      { id: "MDD", position: "MDD", x: 85, y: 48 },
      { id: "SD", position: "SD", x: 50, y: 70 },
      { id: "DC", position: "DC", x: 50, y: 88 },
    ],
  },
  "4-3-3": {
    name: "4-3-3",
    description: "Width from the wingers, control through a midfield trio.",
    slots: [
      { id: "ARQ", position: "ARQ", x: 50, y: 9 },
      { id: "LI", position: "LI", x: 20, y: 23 },
      { id: "DFC-1", position: "DFC", x: 38, y: 21 },
      { id: "DFC-2", position: "DFC", x: 62, y: 21 },
      { id: "LD", position: "LD", x: 80, y: 23 },
      { id: "MC-1", position: "MC", x: 30, y: 48 },
      { id: "MCD", position: "MCD", x: 50, y: 40 },
      { id: "MC-2", position: "MC", x: 70, y: 48 },
      { id: "EXI", position: "EXI", x: 20, y: 82 },
      { id: "DC", position: "DC", x: 50, y: 88 },
      { id: "EXD", position: "EXD", x: 80, y: 82 },
    ],
  },
  "4-2-3-1": {
    name: "4-2-3-1",
    description: "Double pivot shielding the back four, one out-and-out striker.",
    slots: [
      { id: "ARQ", position: "ARQ", x: 50, y: 9 },
      { id: "LI", position: "LI", x: 20, y: 23 },
      { id: "DFC-1", position: "DFC", x: 38, y: 21 },
      { id: "DFC-2", position: "DFC", x: 62, y: 21 },
      { id: "LD", position: "LD", x: 80, y: 23 },
      { id: "MCD-1", position: "MCD", x: 38, y: 38 },
      { id: "MCD-2", position: "MCD", x: 62, y: 38 },
      { id: "EXI", position: "EXI", x: 20, y: 62 },
      { id: "MCO", position: "MCO", x: 50, y: 58 },
      { id: "EXD", position: "EXD", x: 80, y: 62 },
      { id: "DC", position: "DC", x: 50, y: 85 },
    ],
  },
  "4-1-4-1": {
    name: "4-1-4-1",
    description: "A holding midfielder shields the back four, freeing a flat four ahead of them.",
    slots: [
      { id: "ARQ", position: "ARQ", x: 50, y: 9 },
      { id: "LI", position: "LI", x: 20, y: 23 },
      { id: "DFC-1", position: "DFC", x: 38, y: 21 },
      { id: "DFC-2", position: "DFC", x: 62, y: 21 },
      { id: "LD", position: "LD", x: 80, y: 23 },
      { id: "MCD", position: "MCD", x: 50, y: 35 },
      { id: "MDI", position: "MDI", x: 15, y: 55 },
      { id: "MC-1", position: "MC", x: 38, y: 52 },
      { id: "MC-2", position: "MC", x: 62, y: 52 },
      { id: "MDD", position: "MDD", x: 85, y: 55 },
      { id: "DC", position: "DC", x: 50, y: 88 },
    ],
  },
  "4-3-2-1": {
    name: "4-3-2-1",
    description:
      "The 'Christmas tree' — two withdrawn forwards feed a lone striker in a narrow shape.",
    slots: [
      { id: "ARQ", position: "ARQ", x: 50, y: 9 },
      { id: "LI", position: "LI", x: 20, y: 23 },
      { id: "DFC-1", position: "DFC", x: 38, y: 21 },
      { id: "DFC-2", position: "DFC", x: 62, y: 21 },
      { id: "LD", position: "LD", x: 80, y: 23 },
      { id: "MCD", position: "MCD", x: 50, y: 40 },
      { id: "MC-1", position: "MC", x: 30, y: 48 },
      { id: "MC-2", position: "MC", x: 70, y: 48 },
      { id: "MCO-1", position: "MCO", x: 35, y: 65 },
      { id: "MCO-2", position: "MCO", x: 65, y: 65 },
      { id: "DC", position: "DC", x: 50, y: 88 },
    ],
  },
  "4-2-2-2": {
    name: "4-2-2-2",
    description: "The 'magic square' — a double pivot and two attacking mids support two strikers.",
    slots: [
      { id: "ARQ", position: "ARQ", x: 50, y: 9 },
      { id: "LI", position: "LI", x: 20, y: 23 },
      { id: "DFC-1", position: "DFC", x: 38, y: 21 },
      { id: "DFC-2", position: "DFC", x: 62, y: 21 },
      { id: "LD", position: "LD", x: 80, y: 23 },
      { id: "MCD-1", position: "MCD", x: 35, y: 42 },
      { id: "MCD-2", position: "MCD", x: 65, y: 42 },
      { id: "MCO-1", position: "MCO", x: 35, y: 62 },
      { id: "MCO-2", position: "MCO", x: 65, y: 62 },
      { id: "DC-1", position: "DC", x: 38, y: 85 },
      { id: "DC-2", position: "DC", x: 62, y: 85 },
    ],
  },
  "4-2-4": {
    name: "4-2-4",
    description: "Maximum width and numbers up front, with just two central midfielders behind it.",
    slots: [
      { id: "ARQ", position: "ARQ", x: 50, y: 9 },
      { id: "LI", position: "LI", x: 20, y: 23 },
      { id: "DFC-1", position: "DFC", x: 38, y: 21 },
      { id: "DFC-2", position: "DFC", x: 62, y: 21 },
      { id: "LD", position: "LD", x: 80, y: 23 },
      { id: "MC-1", position: "MC", x: 35, y: 45 },
      { id: "MC-2", position: "MC", x: 65, y: 45 },
      { id: "EXI", position: "EXI", x: 15, y: 82 },
      { id: "DC-1", position: "DC", x: 38, y: 86 },
      { id: "DC-2", position: "DC", x: 62, y: 86 },
      { id: "EXD", position: "EXD", x: 85, y: 82 },
    ],
  },
  "4-1-3-2": {
    name: "4-1-3-2",
    description:
      "A defensive midfielder anchors the back four, freeing three attacking mids and two strikers.",
    slots: [
      { id: "ARQ", position: "ARQ", x: 50, y: 9 },
      { id: "LI", position: "LI", x: 20, y: 23 },
      { id: "DFC-1", position: "DFC", x: 38, y: 21 },
      { id: "DFC-2", position: "DFC", x: 62, y: 21 },
      { id: "LD", position: "LD", x: 80, y: 23 },
      { id: "MCD", position: "MCD", x: 50, y: 38 },
      { id: "MDI", position: "MDI", x: 20, y: 58 },
      { id: "MCO", position: "MCO", x: 50, y: 55 },
      { id: "MDD", position: "MDD", x: 80, y: 58 },
      { id: "DC-1", position: "DC", x: 38, y: 85 },
      { id: "DC-2", position: "DC", x: 62, y: 85 },
    ],
  },
  "4-5-1": {
    name: "4-5-1",
    description: "Extra body in midfield, a lone striker up top.",
    slots: [
      { id: "ARQ", position: "ARQ", x: 50, y: 9 },
      { id: "LI", position: "LI", x: 20, y: 23 },
      { id: "DFC-1", position: "DFC", x: 38, y: 21 },
      { id: "DFC-2", position: "DFC", x: 62, y: 21 },
      { id: "LD", position: "LD", x: 80, y: 23 },
      { id: "MDI", position: "MDI", x: 15, y: 48 },
      { id: "MC-1", position: "MC", x: 35, y: 45 },
      { id: "MC-2", position: "MC", x: 50, y: 42 },
      { id: "MC-3", position: "MC", x: 65, y: 45 },
      { id: "MDD", position: "MDD", x: 85, y: 48 },
      { id: "DC", position: "DC", x: 50, y: 85 },
    ],
  },
  "3-4-3": {
    name: "3-4-3",
    description: "Three center backs, attacking width from the flanks.",
    slots: [
      { id: "ARQ", position: "ARQ", x: 50, y: 9 },
      { id: "DFC-1", position: "DFC", x: 30, y: 27 },
      { id: "DFC-2", position: "DFC", x: 50, y: 24 },
      { id: "DFC-3", position: "DFC", x: 70, y: 27 },
      { id: "CAI", position: "CAI", x: 15, y: 48 },
      { id: "MC-1", position: "MC", x: 38, y: 45 },
      { id: "MC-2", position: "MC", x: 62, y: 45 },
      { id: "CAD", position: "CAD", x: 85, y: 48 },
      { id: "EXI", position: "EXI", x: 25, y: 82 },
      { id: "DC", position: "DC", x: 50, y: 88 },
      { id: "EXD", position: "EXD", x: 75, y: 82 },
    ],
  },
  "3-4-2-1": {
    name: "3-4-2-1",
    description: "Wing backs provide the width, with two withdrawn forwards feeding a lone striker.",
    slots: [
      { id: "ARQ", position: "ARQ", x: 50, y: 9 },
      { id: "DFC-1", position: "DFC", x: 30, y: 27 },
      { id: "DFC-2", position: "DFC", x: 50, y: 24 },
      { id: "DFC-3", position: "DFC", x: 70, y: 27 },
      { id: "CAI", position: "CAI", x: 12, y: 48 },
      { id: "MC-1", position: "MC", x: 38, y: 45 },
      { id: "MC-2", position: "MC", x: 62, y: 45 },
      { id: "CAD", position: "CAD", x: 88, y: 48 },
      { id: "MCO-1", position: "MCO", x: 35, y: 65 },
      { id: "MCO-2", position: "MCO", x: 65, y: 65 },
      { id: "DC", position: "DC", x: 50, y: 88 },
    ],
  },
  "3-4-1-2": {
    name: "3-4-1-2",
    description: "Wing backs and a single playmaker support an orthodox strike partnership.",
    slots: [
      { id: "ARQ", position: "ARQ", x: 50, y: 9 },
      { id: "DFC-1", position: "DFC", x: 30, y: 27 },
      { id: "DFC-2", position: "DFC", x: 50, y: 24 },
      { id: "DFC-3", position: "DFC", x: 70, y: 27 },
      { id: "CAI", position: "CAI", x: 12, y: 48 },
      { id: "MC-1", position: "MC", x: 38, y: 45 },
      { id: "MC-2", position: "MC", x: 62, y: 45 },
      { id: "CAD", position: "CAD", x: 88, y: 48 },
      { id: "MCO", position: "MCO", x: 50, y: 62 },
      { id: "DC-1", position: "DC", x: 38, y: 85 },
      { id: "DC-2", position: "DC", x: 62, y: 85 },
    ],
  },
  "3-5-2": {
    name: "3-5-2",
    description: "Wing backs provide the width, packed midfield, two strikers.",
    slots: [
      { id: "ARQ", position: "ARQ", x: 50, y: 9 },
      { id: "DFC-1", position: "DFC", x: 30, y: 27 },
      { id: "DFC-2", position: "DFC", x: 50, y: 24 },
      { id: "DFC-3", position: "DFC", x: 70, y: 27 },
      { id: "CAI", position: "CAI", x: 10, y: 45 },
      { id: "MC-1", position: "MC", x: 33, y: 48 },
      { id: "MC-2", position: "MC", x: 50, y: 42 },
      { id: "MC-3", position: "MC", x: 67, y: 48 },
      { id: "CAD", position: "CAD", x: 90, y: 45 },
      { id: "DC-1", position: "DC", x: 38, y: 82 },
      { id: "DC-2", position: "DC", x: 62, y: 82 },
    ],
  },
  "3-1-4-2": {
    name: "3-1-4-2",
    description: "A deep-lying midfielder shields the back three, freeing a busy four and two strikers.",
    slots: [
      { id: "ARQ", position: "ARQ", x: 50, y: 9 },
      { id: "DFC-1", position: "DFC", x: 30, y: 27 },
      { id: "DFC-2", position: "DFC", x: 50, y: 24 },
      { id: "DFC-3", position: "DFC", x: 70, y: 27 },
      { id: "MCD", position: "MCD", x: 50, y: 35 },
      { id: "MDI", position: "MDI", x: 15, y: 55 },
      { id: "MC-1", position: "MC", x: 38, y: 52 },
      { id: "MC-2", position: "MC", x: 62, y: 52 },
      { id: "MDD", position: "MDD", x: 85, y: 55 },
      { id: "DC-1", position: "DC", x: 38, y: 85 },
      { id: "DC-2", position: "DC", x: 62, y: 85 },
    ],
  },
  "3-5-1-1": {
    name: "3-5-1-1",
    description: "Wing backs and a five-man midfield support a withdrawn forward playing off a striker.",
    slots: [
      { id: "ARQ", position: "ARQ", x: 50, y: 9 },
      { id: "DFC-1", position: "DFC", x: 30, y: 27 },
      { id: "DFC-2", position: "DFC", x: 50, y: 24 },
      { id: "DFC-3", position: "DFC", x: 70, y: 27 },
      { id: "CAI", position: "CAI", x: 10, y: 45 },
      { id: "MC-1", position: "MC", x: 33, y: 48 },
      { id: "MC-2", position: "MC", x: 50, y: 42 },
      { id: "MC-3", position: "MC", x: 67, y: 48 },
      { id: "CAD", position: "CAD", x: 90, y: 45 },
      { id: "SD", position: "SD", x: 50, y: 68 },
      { id: "DC", position: "DC", x: 50, y: 88 },
    ],
  },
  "5-3-2": {
    name: "5-3-2",
    description: "Five at the back for a settled defense, direct two up top.",
    slots: [
      { id: "ARQ", position: "ARQ", x: 50, y: 9 },
      { id: "CAI", position: "CAI", x: 10, y: 25 },
      { id: "DFC-1", position: "DFC", x: 30, y: 27 },
      { id: "DFC-2", position: "DFC", x: 50, y: 24 },
      { id: "DFC-3", position: "DFC", x: 70, y: 27 },
      { id: "CAD", position: "CAD", x: 90, y: 25 },
      { id: "MC-1", position: "MC", x: 30, y: 48 },
      { id: "MC-2", position: "MC", x: 50, y: 45 },
      { id: "MC-3", position: "MC", x: 70, y: 48 },
      { id: "DC-1", position: "DC", x: 38, y: 82 },
      { id: "DC-2", position: "DC", x: 62, y: 82 },
    ],
  },
  "5-4-1": {
    name: "5-4-1",
    description: "Five at the back, a flat four ahead of them, and one out-and-out striker.",
    slots: [
      { id: "ARQ", position: "ARQ", x: 50, y: 9 },
      { id: "CAI", position: "CAI", x: 10, y: 25 },
      { id: "DFC-1", position: "DFC", x: 30, y: 27 },
      { id: "DFC-2", position: "DFC", x: 50, y: 24 },
      { id: "DFC-3", position: "DFC", x: 70, y: 27 },
      { id: "CAD", position: "CAD", x: 90, y: 25 },
      { id: "MDI", position: "MDI", x: 15, y: 50 },
      { id: "MC-1", position: "MC", x: 38, y: 48 },
      { id: "MC-2", position: "MC", x: 62, y: 48 },
      { id: "MDD", position: "MDD", x: 85, y: 50 },
      { id: "DC", position: "DC", x: 50, y: 85 },
    ],
  },
  "5-2-2-1": {
    name: "5-2-2-1",
    description: "A settled back five and double pivot, with two attacking mids behind one striker.",
    slots: [
      { id: "ARQ", position: "ARQ", x: 50, y: 9 },
      { id: "CAI", position: "CAI", x: 10, y: 25 },
      { id: "DFC-1", position: "DFC", x: 30, y: 27 },
      { id: "DFC-2", position: "DFC", x: 50, y: 24 },
      { id: "DFC-3", position: "DFC", x: 70, y: 27 },
      { id: "CAD", position: "CAD", x: 90, y: 25 },
      { id: "MCD-1", position: "MCD", x: 35, y: 42 },
      { id: "MCD-2", position: "MCD", x: 65, y: 42 },
      { id: "MCO-1", position: "MCO", x: 35, y: 62 },
      { id: "MCO-2", position: "MCO", x: 65, y: 62 },
      { id: "DC", position: "DC", x: 50, y: 85 },
    ],
  },
  "5-2-3": {
    name: "5-2-3",
    description: "Wing backs sit in a back five while width up front comes from advanced wingers.",
    slots: [
      { id: "ARQ", position: "ARQ", x: 50, y: 9 },
      { id: "CAI", position: "CAI", x: 10, y: 25 },
      { id: "DFC-1", position: "DFC", x: 30, y: 27 },
      { id: "DFC-2", position: "DFC", x: 50, y: 24 },
      { id: "DFC-3", position: "DFC", x: 70, y: 27 },
      { id: "CAD", position: "CAD", x: 90, y: 25 },
      { id: "MC-1", position: "MC", x: 38, y: 48 },
      { id: "MC-2", position: "MC", x: 62, y: 48 },
      { id: "EXI", position: "EXI", x: 20, y: 82 },
      { id: "DC", position: "DC", x: 50, y: 88 },
      { id: "EXD", position: "EXD", x: 80, y: 82 },
    ],
  },
};

export const FORMATION_NAMES = Object.keys(FORMATIONS) as FormationName[];

/** How many players make up each of a formation's lines, per its own name. */
export interface FormationLineCounts {
  defenders: number;
  midfielders: number;
  forwards: number;
}

/**
 * Reads the line sizes straight from the formation's own name (e.g.
 * "3-5-2" -> 3 defenders, 5 midfielders, 2 forwards), rather than from the
 * position codes on its slots. That matters for wing-back slots (CAI/CAD):
 * they're grouped with the back line for scoring purposes (see
 * `POSITION_GROUP`), but conventionally count toward the *midfield* number
 * in a back-three shape like "3-5-2" and toward the *defense* number in a
 * back-five shape like "5-3-2" — a distinction only the name captures.
 * A trailing qualifier like " diamond" is ignored.
 */
export function getLineCounts(formation: Formation): FormationLineCounts {
  const numbers = formation.name.split(" ")[0].split("-").map(Number);
  const defenders = numbers[0];
  const forwards = numbers[numbers.length - 1];
  const midfielders = numbers.slice(1, -1).reduce((sum, n) => sum + n, 0);
  return { defenders, midfielders, forwards };
}

/**
 * Orders formations by the size of their back line first (fewest defenders
 * first), then by midfield size, then by attack size — falling back to the
 * name for formations that end up tied on all three (e.g. 4-2-3-1 and
 * 4-1-4-1 both count as 4 defenders / 5 midfielders / 1 forward under this
 * three-line classification).
 */
export function compareFormationsByLineCounts(a: Formation, b: Formation): number {
  const countsA = getLineCounts(a);
  const countsB = getLineCounts(b);
  if (countsA.defenders !== countsB.defenders) return countsA.defenders - countsB.defenders;
  if (countsA.midfielders !== countsB.midfielders) return countsA.midfielders - countsB.midfielders;
  if (countsA.forwards !== countsB.forwards) return countsA.forwards - countsB.forwards;
  return a.name.localeCompare(b.name);
}

/** All formations, ordered by back-line size first, then midfield, then attack. */
export const FORMATION_NAMES_BY_LINE_COUNTS: FormationName[] = [...FORMATION_NAMES].sort((a, b) =>
  compareFormationsByLineCounts(FORMATIONS[a], FORMATIONS[b])
);
