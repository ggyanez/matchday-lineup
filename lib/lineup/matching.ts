import type { Player } from "../domain/player";
import type { Position } from "../domain/position";
import { POSITION_GROUP } from "../domain/position";
import type { Formation, FormationName } from "../domain/formation";
import { FORMATIONS } from "../domain/formation";
import { solveAssignment } from "./hungarian";

/** How well a player fits a given position. Higher is better. */
export const FIT_SCORE = {
  PRIMARY: 3,
  SECONDARY: 2,
  SAME_LINE: 1,
  NO_FIT: 0,
} as const;

export function compatibilityScore(player: Player, position: Position): number {
  if (player.primaryPosition === position) return FIT_SCORE.PRIMARY;
  if (player.secondaryPositions.includes(position)) return FIT_SCORE.SECONDARY;
  if (POSITION_GROUP[player.primaryPosition] === POSITION_GROUP[position]) {
    return FIT_SCORE.SAME_LINE;
  }
  return FIT_SCORE.NO_FIT;
}

export type FitQuality = "primary" | "secondary" | "makeshift" | "unfilled";

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

function fitQualityFor(score: number, filled: boolean): FitQuality {
  if (!filled) return "unfilled";
  if (score >= FIT_SCORE.PRIMARY) return "primary";
  if (score >= FIT_SCORE.SECONDARY) return "secondary";
  return "makeshift";
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
  formation: Formation
): FormationRecommendation {
  const slots = formation.slots;
  const n = Math.max(slots.length, players.length);
  const DUMMY_COST = FIT_SCORE.PRIMARY + 1; // strictly worse than any real match

  const cost: number[][] = [];
  for (let i = 0; i < n; i++) {
    const row: number[] = [];
    for (let j = 0; j < n; j++) {
      const isRealSlot = i < slots.length;
      const isRealPlayer = j < players.length;
      if (isRealSlot && isRealPlayer) {
        const score = compatibilityScore(players[j], slots[i].position);
        row.push(FIT_SCORE.PRIMARY - score); // convert to cost (lower is better)
      } else {
        row.push(DUMMY_COST);
      }
    }
    cost.push(row);
  }

  const { rowAssignment } = solveAssignment(cost);

  const usedPlayerIndexes = new Set<number>();
  const slotAssignments: SlotAssignment[] = slots.map((slot, i) => {
    const j = rowAssignment[i];
    const isRealPlayer = j >= 0 && j < players.length;
    const player = isRealPlayer ? players[j] : null;
    if (isRealPlayer) usedPlayerIndexes.add(j);
    const score = player ? compatibilityScore(player, slot.position) : 0;
    return {
      slotId: slot.id,
      position: slot.position,
      x: slot.x,
      y: slot.y,
      player,
      fit: fitQualityFor(score, Boolean(player)),
    };
  });

  const bench = players.filter((_, j) => !usedPlayerIndexes.has(j));

  const totalScore = slotAssignments.reduce((sum, s) => {
    if (!s.player) return sum;
    return sum + compatibilityScore(s.player, s.position);
  }, 0);
  const unfilledSlots = slotAssignments.filter((s) => !s.player).length;

  const warnings: string[] = [];
  if (unfilledSlots > 0) {
    warnings.push(
      `${unfilledSlots} slot(s) could not be filled — not enough confirmed players.`
    );
  }
  const goalkeeperSlot = slotAssignments.find((s) => s.position === "GK");
  if (goalkeeperSlot && goalkeeperSlot.fit === "makeshift") {
    warnings.push(
      `No natural goalkeeper among confirmed players — ${goalkeeperSlot.player?.name} is filling in.`
    );
  }
  const makeshiftOutfield = slotAssignments.filter(
    (s) => s.fit === "makeshift" && s.position !== "GK"
  );
  if (makeshiftOutfield.length > 0) {
    warnings.push(
      `${makeshiftOutfield.length} player(s) are out of their usual positions: ` +
        makeshiftOutfield.map((s) => `${s.player?.name} at ${s.position}`).join(", ") +
        "."
    );
  }

  return {
    formation: formation.name,
    description: formation.description,
    slots: slotAssignments,
    bench,
    totalScore,
    averageScore: slots.length > 0 ? totalScore / slots.length : 0,
    unfilledSlots,
    warnings,
  };
}

/**
 * Evaluates every candidate formation (or a given subset) against the
 * confirmed players and returns them ranked from best to worst fit.
 */
export function recommendFormations(
  players: Player[],
  candidates: FormationName[] = Object.keys(FORMATIONS) as FormationName[]
): FormationRecommendation[] {
  return candidates
    .map((name) => assignFormation(players, FORMATIONS[name]))
    .sort((a, b) => {
      if (a.unfilledSlots !== b.unfilledSlots) return a.unfilledSlots - b.unfilledSlots;
      return b.averageScore - a.averageScore;
    });
}
