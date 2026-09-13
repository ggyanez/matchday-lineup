import type { Locale } from "../i18n/locale";

/**
 * Football positions supported across the app.
 *
 * These identifiers are the internal, canonical keys used everywhere in
 * the data and matching logic (storage, the algorithm, position groups) —
 * they never change with the display language. What DOES change per
 * language is the short code and label shown to the user (see
 * `POSITION_CODE_BY_LOCALE` etc. below): Spanish uses the same
 * Winning Eleven / PES codes as this list; English uses the codes from
 * the English-language versions of those same games (e.g. "CB" instead
 * of "DFC").
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
  // Wing backs are genuinely ambiguous — part of the back line in a 5-at-the-back
  // system, but functionally more like wide midfielders in a back three (which is
  // the more common reading of "carrilero"). Grouped as midfield: it makes for a
  // more sensible same-line fallback (a central midfielder deputizing out wide
  // beats a central back doing the same) and matches how most coaches would
  // categorize this player when scanning a squad list.
  CAI: "midfield",
  CAD: "midfield",
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

/** Display order for grouping players by their line. */
export const POSITION_GROUP_ORDER: PositionGroup[] = [
  "goalkeeper",
  "defense",
  "midfield",
  "attack",
];

/**
 * The short code shown to the user for each position, per language.
 * Spanish reuses the canonical codes above (that's the nomenclature this
 * app was built around); English uses the codes from the English-language
 * Winning Eleven / PES releases.
 */
const POSITION_CODE_BY_LOCALE: Record<Locale, Record<Position, string>> = {
  es: {
    ARQ: "ARQ",
    DFC: "DFC",
    LI: "LI",
    LD: "LD",
    CAI: "CAI",
    CAD: "CAD",
    MCD: "MCD",
    MC: "MC",
    MDI: "MDI",
    MDD: "MDD",
    MCO: "MCO",
    EXI: "EXI",
    EXD: "EXD",
    SD: "SD",
    DC: "DC",
  },
  en: {
    ARQ: "GK",
    DFC: "CB",
    LI: "LB",
    LD: "RB",
    CAI: "LWB",
    CAD: "RWB",
    MCD: "DMF",
    MC: "CMF",
    MDI: "LMF",
    MDD: "RMF",
    MCO: "AMF",
    EXI: "LWF",
    EXD: "RWF",
    SD: "SS",
    DC: "CF",
  },
};

const POSITION_NAME_BY_LOCALE: Record<Locale, Record<Position, string>> = {
  es: {
    ARQ: "Arquero",
    DFC: "Defensor Central",
    LI: "Lateral Izquierdo",
    LD: "Lateral Derecho",
    CAI: "Carrilero Izquierdo",
    CAD: "Carrilero Derecho",
    MCD: "Mediocampista Defensivo",
    MC: "Mediocampista Central",
    MDI: "Mediocampista Izquierdo",
    MDD: "Mediocampista Derecho",
    MCO: "Mediocampista Ofensivo",
    EXI: "Extremo Izquierdo",
    EXD: "Extremo Derecho",
    SD: "Segundo Delantero",
    DC: "Delantero Centro",
  },
  en: {
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
  },
};

/** One-sentence, plain-language explanation of what each position actually does. */
const POSITION_DESCRIPTION_BY_LOCALE: Record<Locale, Record<Position, string>> = {
  es: {
    ARQ: "El último hombre en defensa — el único que puede usar las manos, y solo dentro del área.",
    DFC: "Marca el centro de la defensa, corta ataques y gana los duelos aéreos cerca de su propio arco.",
    LI: "Defiende el sector izquierdo, marca a los extremos rivales y suma en ataque por esa banda.",
    LD: "Defiende el sector derecho, marca a los extremos rivales y suma en ataque por esa banda.",
    CAI: "Un lateral izquierdo que sube más, dando ancho tanto en defensa como en ataque.",
    CAD: "Un lateral derecho que sube más, dando ancho tanto en defensa como en ataque.",
    MCD: "Se para delante de la defensa, corta los ataques rivales y protege la línea de fondo.",
    MC: "Conecta defensa y ataque por el medio, participa tanto en la recuperación como en la generación de juego.",
    MDI: "Cubre el sector izquierdo del mediocampo, sumando en defensa y en ataque por ese lado.",
    MDD: "Cubre el sector derecho del mediocampo, sumando en defensa y en ataque por ese lado.",
    MCO: "Juega justo detrás de los delanteros, genera juego y conecta el medio con el ataque.",
    EXI: "Un atacante pegado a la banda izquierda, que usa velocidad y gambeta para desbordar y generar situaciones.",
    EXD: "Un atacante pegado a la banda derecha, que usa velocidad y gambeta para desbordar y generar situaciones.",
    SD: "Juega justo detrás del delantero de área, bajando a generar juego sin dejar de ser una amenaza de gol.",
    DC: "El jugador más adelantado, encargado de convertir los goles y liderar el ataque.",
  },
  en: {
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
  },
};

const POSITION_GROUP_LABEL_BY_LOCALE: Record<Locale, Record<PositionGroup, string>> = {
  es: {
    goalkeeper: "Arqueros",
    defense: "Defensores",
    midfield: "Mediocampistas",
    attack: "Delanteros",
  },
  en: {
    goalkeeper: "Goalkeepers",
    defense: "Defenders",
    midfield: "Midfielders",
    attack: "Forwards",
  },
};

export function getPositionCode(position: Position, locale: Locale): string {
  return POSITION_CODE_BY_LOCALE[locale][position];
}

export function getPositionName(position: Position, locale: Locale): string {
  return POSITION_NAME_BY_LOCALE[locale][position];
}

export function getPositionDescription(position: Position, locale: Locale): string {
  return POSITION_DESCRIPTION_BY_LOCALE[locale][position];
}

export function getPositionGroupLabel(group: PositionGroup, locale: Locale): string {
  return POSITION_GROUP_LABEL_BY_LOCALE[locale][group];
}
