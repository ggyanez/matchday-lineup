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
      { id: "GK", position: "GK", x: 50, y: 5 },
      { id: "LB", position: "LB", x: 20, y: 20 },
      { id: "CB-1", position: "CB", x: 38, y: 18 },
      { id: "CB-2", position: "CB", x: 62, y: 18 },
      { id: "RB", position: "RB", x: 80, y: 20 },
      { id: "LM", position: "LM", x: 20, y: 50 },
      { id: "CM-1", position: "CM", x: 38, y: 48 },
      { id: "CM-2", position: "CM", x: 62, y: 48 },
      { id: "RM", position: "RM", x: 80, y: 50 },
      { id: "ST-1", position: "ST", x: 38, y: 82 },
      { id: "ST-2", position: "ST", x: 62, y: 82 },
    ],
  },
  "4-3-3": {
    name: "4-3-3",
    description: "Width from the wingers, control through a midfield trio.",
    slots: [
      { id: "GK", position: "GK", x: 50, y: 5 },
      { id: "LB", position: "LB", x: 20, y: 20 },
      { id: "CB-1", position: "CB", x: 38, y: 18 },
      { id: "CB-2", position: "CB", x: 62, y: 18 },
      { id: "RB", position: "RB", x: 80, y: 20 },
      { id: "CM-1", position: "CM", x: 30, y: 48 },
      { id: "DM", position: "DM", x: 50, y: 40 },
      { id: "CM-2", position: "CM", x: 70, y: 48 },
      { id: "LW", position: "LW", x: 20, y: 82 },
      { id: "ST", position: "ST", x: 50, y: 88 },
      { id: "RW", position: "RW", x: 80, y: 82 },
    ],
  },
  "3-4-3": {
    name: "3-4-3",
    description: "Three center backs, attacking width from the flanks.",
    slots: [
      { id: "GK", position: "GK", x: 50, y: 5 },
      { id: "CB-1", position: "CB", x: 30, y: 18 },
      { id: "CB-2", position: "CB", x: 50, y: 15 },
      { id: "CB-3", position: "CB", x: 70, y: 18 },
      { id: "LM", position: "LM", x: 15, y: 48 },
      { id: "CM-1", position: "CM", x: 38, y: 45 },
      { id: "CM-2", position: "CM", x: 62, y: 45 },
      { id: "RM", position: "RM", x: 85, y: 48 },
      { id: "LW", position: "LW", x: 25, y: 82 },
      { id: "ST", position: "ST", x: 50, y: 88 },
      { id: "RW", position: "RW", x: 75, y: 82 },
    ],
  },
  "4-2-3-1": {
    name: "4-2-3-1",
    description: "Double pivot shielding the back four, one out-and-out striker.",
    slots: [
      { id: "GK", position: "GK", x: 50, y: 5 },
      { id: "LB", position: "LB", x: 20, y: 20 },
      { id: "CB-1", position: "CB", x: 38, y: 18 },
      { id: "CB-2", position: "CB", x: 62, y: 18 },
      { id: "RB", position: "RB", x: 80, y: 20 },
      { id: "DM-1", position: "DM", x: 38, y: 38 },
      { id: "DM-2", position: "DM", x: 62, y: 38 },
      { id: "LW", position: "LW", x: 20, y: 62 },
      { id: "AM", position: "AM", x: 50, y: 58 },
      { id: "RW", position: "RW", x: 80, y: 62 },
      { id: "ST", position: "ST", x: 50, y: 85 },
    ],
  },
  "3-5-2": {
    name: "3-5-2",
    description: "Wing backs provide the width, packed midfield, two strikers.",
    slots: [
      { id: "GK", position: "GK", x: 50, y: 5 },
      { id: "CB-1", position: "CB", x: 30, y: 18 },
      { id: "CB-2", position: "CB", x: 50, y: 15 },
      { id: "CB-3", position: "CB", x: 70, y: 18 },
      { id: "LWB", position: "LWB", x: 10, y: 45 },
      { id: "CM-1", position: "CM", x: 33, y: 48 },
      { id: "CM-2", position: "CM", x: 50, y: 42 },
      { id: "CM-3", position: "CM", x: 67, y: 48 },
      { id: "RWB", position: "RWB", x: 90, y: 45 },
      { id: "ST-1", position: "ST", x: 38, y: 82 },
      { id: "ST-2", position: "ST", x: 62, y: 82 },
    ],
  },
  "5-3-2": {
    name: "5-3-2",
    description: "Five at the back for a settled defense, direct two up top.",
    slots: [
      { id: "GK", position: "GK", x: 50, y: 5 },
      { id: "LWB", position: "LWB", x: 10, y: 25 },
      { id: "CB-1", position: "CB", x: 30, y: 18 },
      { id: "CB-2", position: "CB", x: 50, y: 15 },
      { id: "CB-3", position: "CB", x: 70, y: 18 },
      { id: "RWB", position: "RWB", x: 90, y: 25 },
      { id: "CM-1", position: "CM", x: 30, y: 48 },
      { id: "CM-2", position: "CM", x: 50, y: 45 },
      { id: "CM-3", position: "CM", x: 70, y: 48 },
      { id: "ST-1", position: "ST", x: 38, y: 82 },
      { id: "ST-2", position: "ST", x: 62, y: 82 },
    ],
  },
  "4-5-1": {
    name: "4-5-1",
    description: "Extra body in midfield, a lone striker up top.",
    slots: [
      { id: "GK", position: "GK", x: 50, y: 5 },
      { id: "LB", position: "LB", x: 20, y: 20 },
      { id: "CB-1", position: "CB", x: 38, y: 18 },
      { id: "CB-2", position: "CB", x: 62, y: 18 },
      { id: "RB", position: "RB", x: 80, y: 20 },
      { id: "LM", position: "LM", x: 15, y: 48 },
      { id: "CM-1", position: "CM", x: 35, y: 45 },
      { id: "CM-2", position: "CM", x: 50, y: 42 },
      { id: "CM-3", position: "CM", x: 65, y: 45 },
      { id: "RM", position: "RM", x: 85, y: 48 },
      { id: "ST", position: "ST", x: 50, y: 85 },
    ],
  },
};

export const FORMATION_NAMES = Object.keys(FORMATIONS) as FormationName[];
