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

export type FormationName =
  | "4-4-2"
  | "4-3-3"
  | "3-4-3"
  | "4-2-3-1"
  | "3-5-2"
  | "5-3-2"
  | "4-5-1";

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
      { id: "ARQ", position: "ARQ", x: 50, y: 5 },
      { id: "LI", position: "LI", x: 20, y: 20 },
      { id: "DFC-1", position: "DFC", x: 38, y: 18 },
      { id: "DFC-2", position: "DFC", x: 62, y: 18 },
      { id: "LD", position: "LD", x: 80, y: 20 },
      { id: "MDI", position: "MDI", x: 20, y: 50 },
      { id: "MC-1", position: "MC", x: 38, y: 48 },
      { id: "MC-2", position: "MC", x: 62, y: 48 },
      { id: "MDD", position: "MDD", x: 80, y: 50 },
      { id: "DC-1", position: "DC", x: 38, y: 82 },
      { id: "DC-2", position: "DC", x: 62, y: 82 },
    ],
  },
  "4-3-3": {
    name: "4-3-3",
    description: "Width from the wingers, control through a midfield trio.",
    slots: [
      { id: "ARQ", position: "ARQ", x: 50, y: 5 },
      { id: "LI", position: "LI", x: 20, y: 20 },
      { id: "DFC-1", position: "DFC", x: 38, y: 18 },
      { id: "DFC-2", position: "DFC", x: 62, y: 18 },
      { id: "LD", position: "LD", x: 80, y: 20 },
      { id: "MC-1", position: "MC", x: 30, y: 48 },
      { id: "MCD", position: "MCD", x: 50, y: 40 },
      { id: "MC-2", position: "MC", x: 70, y: 48 },
      { id: "EXI", position: "EXI", x: 20, y: 82 },
      { id: "DC", position: "DC", x: 50, y: 88 },
      { id: "EXD", position: "EXD", x: 80, y: 82 },
    ],
  },
  "3-4-3": {
    name: "3-4-3",
    description: "Three center backs, attacking width from the flanks.",
    slots: [
      { id: "ARQ", position: "ARQ", x: 50, y: 5 },
      { id: "DFC-1", position: "DFC", x: 30, y: 18 },
      { id: "DFC-2", position: "DFC", x: 50, y: 15 },
      { id: "DFC-3", position: "DFC", x: 70, y: 18 },
      { id: "CAI", position: "CAI", x: 15, y: 48 },
      { id: "MC-1", position: "MC", x: 38, y: 45 },
      { id: "MC-2", position: "MC", x: 62, y: 45 },
      { id: "CAD", position: "CAD", x: 85, y: 48 },
      { id: "EXI", position: "EXI", x: 25, y: 82 },
      { id: "DC", position: "DC", x: 50, y: 88 },
      { id: "EXD", position: "EXD", x: 75, y: 82 },
    ],
  },
  "4-2-3-1": {
    name: "4-2-3-1",
    description: "Double pivot shielding the back four, one out-and-out striker.",
    slots: [
      { id: "ARQ", position: "ARQ", x: 50, y: 5 },
      { id: "LI", position: "LI", x: 20, y: 20 },
      { id: "DFC-1", position: "DFC", x: 38, y: 18 },
      { id: "DFC-2", position: "DFC", x: 62, y: 18 },
      { id: "LD", position: "LD", x: 80, y: 20 },
      { id: "MCD-1", position: "MCD", x: 38, y: 38 },
      { id: "MCD-2", position: "MCD", x: 62, y: 38 },
      { id: "EXI", position: "EXI", x: 20, y: 62 },
      { id: "MCO", position: "MCO", x: 50, y: 58 },
      { id: "EXD", position: "EXD", x: 80, y: 62 },
      { id: "DC", position: "DC", x: 50, y: 85 },
    ],
  },
  "3-5-2": {
    name: "3-5-2",
    description: "Wing backs provide the width, packed midfield, two strikers.",
    slots: [
      { id: "ARQ", position: "ARQ", x: 50, y: 5 },
      { id: "DFC-1", position: "DFC", x: 30, y: 18 },
      { id: "DFC-2", position: "DFC", x: 50, y: 15 },
      { id: "DFC-3", position: "DFC", x: 70, y: 18 },
      { id: "CAI", position: "CAI", x: 10, y: 45 },
      { id: "MC-1", position: "MC", x: 33, y: 48 },
      { id: "MC-2", position: "MC", x: 50, y: 42 },
      { id: "MC-3", position: "MC", x: 67, y: 48 },
      { id: "CAD", position: "CAD", x: 90, y: 45 },
      { id: "DC-1", position: "DC", x: 38, y: 82 },
      { id: "DC-2", position: "DC", x: 62, y: 82 },
    ],
  },
  "5-3-2": {
    name: "5-3-2",
    description: "Five at the back for a settled defense, direct two up top.",
    slots: [
      { id: "ARQ", position: "ARQ", x: 50, y: 5 },
      { id: "CAI", position: "CAI", x: 10, y: 25 },
      { id: "DFC-1", position: "DFC", x: 30, y: 18 },
      { id: "DFC-2", position: "DFC", x: 50, y: 15 },
      { id: "DFC-3", position: "DFC", x: 70, y: 18 },
      { id: "CAD", position: "CAD", x: 90, y: 25 },
      { id: "MC-1", position: "MC", x: 30, y: 48 },
      { id: "MC-2", position: "MC", x: 50, y: 45 },
      { id: "MC-3", position: "MC", x: 70, y: 48 },
      { id: "DC-1", position: "DC", x: 38, y: 82 },
      { id: "DC-2", position: "DC", x: 62, y: 82 },
    ],
  },
  "4-5-1": {
    name: "4-5-1",
    description: "Extra body in midfield, a lone striker up top.",
    slots: [
      { id: "ARQ", position: "ARQ", x: 50, y: 5 },
      { id: "LI", position: "LI", x: 20, y: 20 },
      { id: "DFC-1", position: "DFC", x: 38, y: 18 },
      { id: "DFC-2", position: "DFC", x: 62, y: 18 },
      { id: "LD", position: "LD", x: 80, y: 20 },
      { id: "MDI", position: "MDI", x: 15, y: 48 },
      { id: "MC-1", position: "MC", x: 35, y: 45 },
      { id: "MC-2", position: "MC", x: 50, y: 42 },
      { id: "MC-3", position: "MC", x: 65, y: 45 },
      { id: "MDD", position: "MDD", x: 85, y: 48 },
      { id: "DC", position: "DC", x: 50, y: 85 },
    ],
  },
};

export const FORMATION_NAMES = Object.keys(FORMATIONS) as FormationName[];
