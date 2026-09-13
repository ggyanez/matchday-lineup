import type { Player } from "../domain/player";
import type { Position } from "../domain/position";
import { POSITION_GROUP, getPositionCode } from "../domain/position";
import type { Formation, FormationName, FormationSlot } from "../domain/formation";
import { FORMATIONS, getFormationDescription } from "../domain/formation";
import { DEFAULT_LOCALE, type Locale } from "../i18n/locale";
import { solveAssignment } from "./hungarian";

/** How well a player fits a given position. Higher is better. */
export const FIT_SCORE = {
  /** Score for a player's first-listed primary position. */
  PRIMARY_BEST: 3,
  /**
   * Each primary position past the first is worth only slightly less —
   * a player can be (almost) equally good at more than one position.
   */
  PRIMARY_RANK_DECAY: 0.1,
  /** Floor for any listed primary position, comfortably above the best possible secondary score. */
  PRIMARY_MIN: 2.7,
  /** Score for a player's first-listed (best) secondary position. */
  SECONDARY_BEST: 2,
  /** Each secondary position past the first is worth a bit less than the previous one. */
  SECONDARY_RANK_DECAY: 0.2,
  /**
   * Floor for any listed secondary position, however far down the list —
   * always kept above SAME_LINE so an explicitly declared secondary
   * position is worth more than a generic same-line fallback.
   */
  SECONDARY_MIN: 1.2,
  SAME_LINE: 1,
  NO_FIT: 0,
} as const;

export type FitQuality = "primary" | "secondary" | "makeshift" | "unfilled";

/**
 * Scores how well a player fits a position, and classifies that fit.
 *
 * Both primary and secondary positions are ranked by the order the player
 * listed them in — earlier entries are treated as a (slightly, for
 * primary; more noticeably, for secondary) better fit than later ones.
 */
export function evaluateFit(
  player: Player,
  position: Position
): { score: number; fit: Exclude<FitQuality, "unfilled"> } {
  const primaryRank = player.primaryPositions.indexOf(position);
  if (primaryRank !== -1) {
    const score = Math.max(
      FIT_SCORE.PRIMARY_MIN,
      FIT_SCORE.PRIMARY_BEST - primaryRank * FIT_SCORE.PRIMARY_RANK_DECAY
    );
    return { score, fit: "primary" };
  }

  const secondaryRank = player.secondaryPositions.indexOf(position);
  if (secondaryRank !== -1) {
    const score = Math.max(
      FIT_SCORE.SECONDARY_MIN,
      FIT_SCORE.SECONDARY_BEST - secondaryRank * FIT_SCORE.SECONDARY_RANK_DECAY
    );
    return { score, fit: "secondary" };
  }

  const sameLine = player.primaryPositions.some(
    (p) => POSITION_GROUP[p] === POSITION_GROUP[position]
  );
  if (sameLine) {
    return { score: FIT_SCORE.SAME_LINE, fit: "makeshift" };
  }

  return { score: FIT_SCORE.NO_FIT, fit: "makeshift" };
}

export function compatibilityScore(player: Player, position: Position): number {
  return evaluateFit(player, position).score;
}

/**
 * Bonus for an established regular ("fijo") over a guest ("invitado"), so
 * the recommendation prefers regulars by a wide margin — a guest only
 * takes a slot when there isn't a comparably-fit regular for it. Set well
 * above the biggest realistic fit gap (a first-listed primary position, 3,
 * versus any listed secondary position, floor 1.2 — a gap of 1.8), so a
 * regular is preferred even in their weaker, secondary position over a
 * guest who's a natural fit for the slot.
 */
const MEMBERSHIP_BONUS: Record<Player["membershipStatus"], number> = {
  regular: 2,
  guest: 0,
};

/**
 * How much to knock off a player's score for being injured, so a confirmed
 * but injured player is only picked over a fit healthy one when there
 * isn't a healthy alternative — "last resort", not "excluded". Health
 * still matters more than being a regular: these penalties are set above
 * the combined regular bonus and fit range (best case for an injured
 * regular: primary position, 3, plus the regular bonus, 2, totaling 5)
 * versus any healthy player's secondary-position score (at most 2, floor
 * 1.2, with no bonus if they're a guest) — playing hurt, even as a
 * regular in your best position, still loses to a healthy guest filling
 * in from a secondary one. A major injury goes further, dropping below
 * even a healthy same-line fallback (1).
 */
const INJURY_PENALTY: Record<Player["injuryStatus"], number> = {
  healthy: 0,
  minor: 4,
  major: 4.6,
};

/**
 * Small nudge (much smaller than any real fit-score gap) that prefers
 * assigning a left-footed player to the leftmost of several interchangeable
 * slots sharing the same position code (e.g. the left-sided center back
 * among three), and a right-footed player to the rightmost. Two-footed
 * players or slots at the exact center get no nudge either way. This only
 * ever breaks ties between otherwise-equally-suited slots — it can't
 * outweigh an actual difference in positional fit.
 */
const FOOT_ALIGNMENT_WEIGHT = 0.02;

function footAlignmentBonus(player: Player, slot: FormationSlot): number {
  if (!player.preferredFoot || player.preferredFoot === "both") return 0;
  const sideOffset = (slot.x - 50) / 50; // -1 (far left) .. +1 (far right)
  const bonus = player.preferredFoot === "left" ? -sideOffset : sideOffset;
  return bonus * FOOT_ALIGNMENT_WEIGHT;
}

/**
 * The score used to decide the *automatic* assignment — positional fit,
 * softened for injuries and nudged for foot/side alignment. Kept separate
 * from {@link compatibilityScore} (which stays pure positional fit) so the
 * displayed fit badges and warnings are never confused by these secondary
 * preferences; only the solver's decision is.
 */
function assignmentScore(player: Player, slot: FormationSlot): number {
  const base = compatibilityScore(player, slot.position);
  const adjusted =
    base +
    MEMBERSHIP_BONUS[player.membershipStatus] -
    INJURY_PENALTY[player.injuryStatus] +
    footAlignmentBonus(player, slot);
  return Math.max(0, adjusted);
}

export interface SlotAssignment {
  slotId: string;
  position: Position;
  x: number;
  y: number;
  player: Player | null;
  fit: FitQuality;
}

export interface FormationRecommendation {
  formation: FormationName;
  description: string;
  slots: SlotAssignment[];
  bench: Player[];
  /** Sum of fit scores across filled slots. */
  totalScore: number;
  /** totalScore normalized to the formation's slot count, for comparing formations fairly. */
  averageScore: number;
  unfilledSlots: number;
  warnings: string[];
}

const INJURY_WORD: Record<Locale, Record<"minor" | "major", string>> = {
  es: { minor: "leve", major: "grave" },
  en: { minor: "minor", major: "major" },
};

const WARNING_TEXT = {
  es: {
    unfilledSlots: (count: number) =>
      `${count} puesto(s) sin cubrir — no hay suficientes jugadores confirmados.`,
    noGoalkeeper: (name: string) =>
      `No hay un arquero natural entre los confirmados — ${name} está cubriendo el puesto.`,
    outOfPosition: (count: number, list: string) =>
      `${count} jugador(es) están fuera de su posición habitual: ${list}.`,
    playingInjured: (list: string) => `Jugando lesionado: ${list}.`,
    playingAsGuest: (list: string) => `Jugando como invitado: ${list}.`,
    at: (name: string, code: string) => `${name} de ${code}`,
  },
  en: {
    unfilledSlots: (count: number) =>
      `${count} slot(s) could not be filled — not enough confirmed players.`,
    noGoalkeeper: (name: string) => `No natural goalkeeper among confirmed players — ${name} is filling in.`,
    outOfPosition: (count: number, list: string) =>
      `${count} player(s) are out of their usual positions: ${list}.`,
    playingInjured: (list: string) => `Playing while injured: ${list}.`,
    playingAsGuest: (list: string) => `Playing as a guest: ${list}.`,
    at: (name: string, code: string) => `${name} at ${code}`,
  },
} as const;

/**
 * Builds a full recommendation result (fit per slot, bench, score,
 * warnings) from a concrete, already-decided assignment of players to
 * slots. This is the shared tail end used both by the algorithmic
 * {@link assignFormation} (which decides the assignment itself) and by
 * manual, user-edited lineups (which just report whatever the user
 * dragged into place) — so both paths render identically and share the
 * same warnings logic.
 *
 * `playerIdBySlot` only needs to cover the slots that are filled; missing
 * or unknown player ids are treated as an empty slot.
 */
export function buildRecommendationFromAssignment(
  players: Player[],
  formation: Formation,
  playerIdBySlot: Record<string, string | null | undefined>,
  locale: Locale = DEFAULT_LOCALE
): FormationRecommendation {
  const playersById = new Map(players.map((p) => [p.id, p]));
  const assignedIds = new Set<string>();
  const text = WARNING_TEXT[locale];

  const slotAssignments: SlotAssignment[] = formation.slots.map((slot) => {
    const player = playersById.get(playerIdBySlot[slot.id] ?? "") ?? null;
    if (player) assignedIds.add(player.id);
    return {
      slotId: slot.id,
      position: slot.position,
      x: slot.x,
      y: slot.y,
      player,
      fit: player ? evaluateFit(player, slot.position).fit : "unfilled",
    };
  });

  const bench = players.filter((p) => !assignedIds.has(p.id));

  const totalScore = slotAssignments.reduce((sum, s) => {
    if (!s.player) return sum;
    return sum + compatibilityScore(s.player, s.position);
  }, 0);
  const unfilledSlots = slotAssignments.filter((s) => !s.player).length;

  const warnings: string[] = [];
  if (unfilledSlots > 0) {
    warnings.push(text.unfilledSlots(unfilledSlots));
  }
  const goalkeeperSlot = slotAssignments.find((s) => s.position === "ARQ");
  if (goalkeeperSlot && goalkeeperSlot.fit === "makeshift" && goalkeeperSlot.player) {
    warnings.push(text.noGoalkeeper(goalkeeperSlot.player.name));
  }
  const makeshiftOutfield = slotAssignments.filter(
    (s): s is SlotAssignment & { player: Player } =>
      s.fit === "makeshift" && s.position !== "ARQ" && s.player != null
  );
  if (makeshiftOutfield.length > 0) {
    const list = makeshiftOutfield
      .map((s) => text.at(s.player.name, getPositionCode(s.position, locale)))
      .join(", ");
    warnings.push(text.outOfPosition(makeshiftOutfield.length, list));
  }

  const injured = slotAssignments.filter(
    (s): s is SlotAssignment & { player: Player } => s.player != null && s.player.injuryStatus !== "healthy"
  );
  if (injured.length > 0) {
    const list = injured
      .map((s) => `${s.player.name} (${INJURY_WORD[locale][s.player.injuryStatus as "minor" | "major"]})`)
      .join(", ");
    warnings.push(text.playingInjured(list));
  }

  const guests = slotAssignments.filter(
    (s): s is SlotAssignment & { player: Player } =>
      s.player != null && s.player.membershipStatus === "guest"
  );
  if (guests.length > 0) {
    warnings.push(text.playingAsGuest(guests.map((s) => s.player.name).join(", ")));
  }

  return {
    formation: formation.name,
    description: getFormationDescription(formation.name, locale),
    slots: slotAssignments,
    bench,
    totalScore,
    averageScore: formation.slots.length > 0 ? totalScore / formation.slots.length : 0,
    unfilledSlots,
    warnings,
  };
}

/**
 * Finds the best possible assignment of confirmed players onto a single
 * formation's slots, maximizing overall positional fit.
 *
 * Uses the Hungarian algorithm on a square cost matrix padded with dummy
 * rows/columns so that:
 *  - real slots are always filled with a real player when enough players
 *    are confirmed, even if the fit is imperfect ("makeshift");
 *  - surplus players fall out naturally as bench;
 *  - slots are only left unfilled when there truly aren't enough players.
 */
export function assignFormation(
  players: Player[],
  formation: Formation,
  locale: Locale = DEFAULT_LOCALE
): FormationRecommendation {
  const slots = formation.slots;
  const n = Math.max(slots.length, players.length);
  const DUMMY_COST = FIT_SCORE.PRIMARY_BEST + 1; // strictly worse than any real match

  const cost: number[][] = [];
  for (let i = 0; i < n; i++) {
    const row: number[] = [];
    for (let j = 0; j < n; j++) {
      const isRealSlot = i < slots.length;
      const isRealPlayer = j < players.length;
      if (isRealSlot && isRealPlayer) {
        const score = assignmentScore(players[j], slots[i]);
        row.push(FIT_SCORE.PRIMARY_BEST - score); // convert to cost (lower is better)
      } else {
        row.push(DUMMY_COST);
      }
    }
    cost.push(row);
  }

  const { rowAssignment } = solveAssignment(cost);

  const playerIdBySlot: Record<string, string | null> = {};
  slots.forEach((slot, i) => {
    const j = rowAssignment[i];
    playerIdBySlot[slot.id] = j >= 0 && j < players.length ? players[j].id : null;
  });

  return buildRecommendationFromAssignment(players, formation, playerIdBySlot, locale);
}

/**
 * Small nudge applied only when ranking candidate formations against each
 * other (see `recommendFormations`), not to any player's own fit score —
 * a formation the team has starred as a favorite needs to be within this
 * much average fit of a non-favorite to still come out on top, so the
 * recommendation leans toward formations the team actually plays without
 * ever picking a clearly worse-fitting one just because it's starred.
 */
const FAVORITE_FORMATION_BONUS = 0.2;

/**
 * Evaluates every candidate formation (or a given subset) against the
 * confirmed players and returns them ranked from best to worst fit.
 *
 * `favoriteFormations` only affects the ranking here — the `averageScore`
 * on each returned recommendation stays the plain, unboosted fit value,
 * so what's displayed is never confused with this preference.
 */
export function recommendFormations(
  players: Player[],
  candidates: FormationName[] = Object.keys(FORMATIONS) as FormationName[],
  locale: Locale = DEFAULT_LOCALE,
  favoriteFormations: ReadonlySet<FormationName> = new Set()
): FormationRecommendation[] {
  const rankingScore = (r: FormationRecommendation) =>
    r.averageScore + (favoriteFormations.has(r.formation) ? FAVORITE_FORMATION_BONUS : 0);

  return candidates
    .map((name) => assignFormation(players, FORMATIONS[name], locale))
    .sort((a, b) => {
      if (a.unfilledSlots !== b.unfilledSlots) return a.unfilledSlots - b.unfilledSlots;
      return rankingScore(b) - rankingScore(a);
    });
}
