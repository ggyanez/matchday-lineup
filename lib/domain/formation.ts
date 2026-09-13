import type { Position } from "./position";
import type { Locale } from "../i18n/locale";

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
  slots: FormationSlot[];
}

export const FORMATIONS: Record<FormationName, Formation> = {
  "4-4-2": {
    name: "4-4-2",
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
    slots: [
      { id: "ARQ", position: "ARQ", x: 50, y: 9 },
      { id: "LI", position: "LI", x: 10, y: 25 },
      { id: "DFC-1", position: "DFC", x: 30, y: 27 },
      { id: "DFC-2", position: "DFC", x: 50, y: 24 },
      { id: "DFC-3", position: "DFC", x: 70, y: 27 },
      { id: "LD", position: "LD", x: 90, y: 25 },
      { id: "MC-1", position: "MC", x: 30, y: 48 },
      { id: "MC-2", position: "MC", x: 50, y: 45 },
      { id: "MC-3", position: "MC", x: 70, y: 48 },
      { id: "DC-1", position: "DC", x: 38, y: 82 },
      { id: "DC-2", position: "DC", x: 62, y: 82 },
    ],
  },
  "5-4-1": {
    name: "5-4-1",
    slots: [
      { id: "ARQ", position: "ARQ", x: 50, y: 9 },
      { id: "LI", position: "LI", x: 10, y: 25 },
      { id: "DFC-1", position: "DFC", x: 30, y: 27 },
      { id: "DFC-2", position: "DFC", x: 50, y: 24 },
      { id: "DFC-3", position: "DFC", x: 70, y: 27 },
      { id: "LD", position: "LD", x: 90, y: 25 },
      { id: "MDI", position: "MDI", x: 15, y: 50 },
      { id: "MC-1", position: "MC", x: 38, y: 48 },
      { id: "MC-2", position: "MC", x: 62, y: 48 },
      { id: "MDD", position: "MDD", x: 85, y: 50 },
      { id: "DC", position: "DC", x: 50, y: 85 },
    ],
  },
  "5-2-2-1": {
    name: "5-2-2-1",
    slots: [
      { id: "ARQ", position: "ARQ", x: 50, y: 9 },
      { id: "LI", position: "LI", x: 10, y: 25 },
      { id: "DFC-1", position: "DFC", x: 30, y: 27 },
      { id: "DFC-2", position: "DFC", x: 50, y: 24 },
      { id: "DFC-3", position: "DFC", x: 70, y: 27 },
      { id: "LD", position: "LD", x: 90, y: 25 },
      { id: "MCD-1", position: "MCD", x: 35, y: 42 },
      { id: "MCD-2", position: "MCD", x: 65, y: 42 },
      { id: "MCO-1", position: "MCO", x: 35, y: 62 },
      { id: "MCO-2", position: "MCO", x: 65, y: 62 },
      { id: "DC", position: "DC", x: 50, y: 85 },
    ],
  },
  "5-2-3": {
    name: "5-2-3",
    slots: [
      { id: "ARQ", position: "ARQ", x: 50, y: 9 },
      { id: "LI", position: "LI", x: 10, y: 25 },
      { id: "DFC-1", position: "DFC", x: 30, y: 27 },
      { id: "DFC-2", position: "DFC", x: 50, y: 24 },
      { id: "DFC-3", position: "DFC", x: 70, y: 27 },
      { id: "LD", position: "LD", x: 90, y: 25 },
      { id: "MC-1", position: "MC", x: 38, y: 48 },
      { id: "MC-2", position: "MC", x: 62, y: 48 },
      { id: "EXI", position: "EXI", x: 20, y: 82 },
      { id: "DC", position: "DC", x: 50, y: 88 },
      { id: "EXD", position: "EXD", x: 80, y: 82 },
    ],
  },
};

export const FORMATION_NAMES = Object.keys(FORMATIONS) as FormationName[];

/** One-sentence tactical description of each formation, per language. */
const FORMATION_DESCRIPTION_BY_LOCALE: Record<Locale, Record<FormationName, string>> = {
  es: {
    "4-4-2": "Equilibrado, dos líneas de cuatro detrás de una dupla de ataque.",
    "4-4-2 diamond": "Un rombo central angosto alimenta a dos delanteros, a cambio de ancho por afuera.",
    "4-4-1-1": "Un delantero retrasado conecta el medio con el ataque, alimentando al delantero de área.",
    "4-3-3": "Ancho por los extremos, control del juego con un trío de mediocampistas.",
    "4-2-3-1": "Doble cinco que protege la línea de cuatro, con un solo delantero de área.",
    "4-1-4-1": "Un mediocampista de contención protege la defensa, liberando una línea de cuatro por delante.",
    "4-3-2-1":
      "El 'árbol de Navidad' — dos enganches retrasados alimentan a un solo delantero en un esquema angosto.",
    "4-2-2-2": "El 'cuadrado mágico' — doble cinco y dos enganches sostienen a una dupla de ataque.",
    "4-2-4": "Máximo ancho y gente arriba, con solo dos mediocampistas centrales de sostén.",
    "4-1-3-2":
      "Un cinco protege la línea de cuatro, liberando a tres mediocampistas ofensivos y dos delanteros.",
    "4-5-1": "Un jugador extra en el medio, un solo delantero de área arriba.",
    "3-4-3": "Tres centrales, ancho ofensivo por las bandas.",
    "3-4-2-1": "Los carrileros dan el ancho, con dos enganches retrasados alimentando a un solo delantero.",
    "3-4-1-2": "Carrileros y un solo enganche sostienen a una dupla de área ortodoxa.",
    "3-5-2": "Los carrileros dan el ancho, mediocampo cargado, dos delanteros.",
    "3-1-4-2":
      "Un mediocampista retrasado protege la línea de tres, liberando un mediocampo cargado y dos delanteros.",
    "3-5-1-1":
      "Carrileros y un mediocampo de cinco sostienen a un delantero retrasado jugando con otro de área.",
    "5-3-2": "Línea de cinco para una defensa sólida, dos delanteros directos arriba.",
    "5-4-1": "Línea de cinco, una línea de cuatro por delante, y un solo delantero de área.",
    "5-2-2-1": "Línea de cinco sólida y doble cinco, con dos enganches detrás de un delantero.",
    "5-2-3": "Los laterales completan la línea de cinco, mientras el ancho llega por los extremos adelantados.",
  },
  en: {
    "4-4-2": "Balanced, two banks of four behind a strike partnership.",
    "4-4-2 diamond": "A narrow central diamond feeds two strikers, trading width for control.",
    "4-4-1-1": "A withdrawn forward links midfield and attack, feeding the striker ahead.",
    "4-3-3": "Width from the wingers, control through a midfield trio.",
    "4-2-3-1": "Double pivot shielding the back four, one out-and-out striker.",
    "4-1-4-1": "A holding midfielder shields the back four, freeing a flat four ahead of them.",
    "4-3-2-1": "The 'Christmas tree' — two withdrawn forwards feed a lone striker in a narrow shape.",
    "4-2-2-2": "The 'magic square' — a double pivot and two attacking mids support two strikers.",
    "4-2-4": "Maximum width and numbers up front, with just two central midfielders behind it.",
    "4-1-3-2": "A defensive midfielder anchors the back four, freeing three attacking mids and two strikers.",
    "4-5-1": "Extra body in midfield, a lone striker up top.",
    "3-4-3": "Three center backs, attacking width from the flanks.",
    "3-4-2-1": "Wing backs provide the width, with two withdrawn forwards feeding a lone striker.",
    "3-4-1-2": "Wing backs and a single playmaker support an orthodox strike partnership.",
    "3-5-2": "Wing backs provide the width, packed midfield, two strikers.",
    "3-1-4-2": "A deep-lying midfielder shields the back three, freeing a busy four and two strikers.",
    "3-5-1-1": "Wing backs and a five-man midfield support a withdrawn forward playing off a striker.",
    "5-3-2": "Five at the back for a settled defense, direct two up top.",
    "5-4-1": "Five at the back, a flat four ahead of them, and one out-and-out striker.",
    "5-2-2-1": "A settled back five and double pivot, with two attacking mids behind one striker.",
    "5-2-3": "Fullbacks complete the back five, while width up front comes from advanced wingers.",
  },
};

export function getFormationDescription(name: FormationName, locale: Locale): string {
  return FORMATION_DESCRIPTION_BY_LOCALE[locale][name];
}

/** How many players make up each of a formation's lines, per its own name. */
export interface FormationLineCounts {
  defenders: number;
  midfielders: number;
  forwards: number;
}

/**
 * Reads the line sizes straight from the formation's own name (e.g.
 * "3-5-2" -> 3 defenders, 5 midfielders, 2 forwards), rather than from the
 * position codes on its slots — simpler, and it's already exactly what
 * the name encodes. A trailing qualifier like " diamond" is ignored.
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
