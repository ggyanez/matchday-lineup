import type { Locale } from "../i18n/locale";
import { getPositionCode, type Position } from "./position";

export const PREFERRED_FEET = ["left", "right", "both"] as const;
export type PreferredFoot = (typeof PREFERRED_FEET)[number];

const PREFERRED_FOOT_LABEL_BY_LOCALE: Record<Locale, Record<PreferredFoot, string>> = {
  es: {
    left: "Zurdo",
    right: "Diestro",
    both: "Ambidiestro",
  },
  en: {
    left: "Left-footed",
    right: "Right-footed",
    both: "Two-footed",
  },
};

export function getPreferredFootLabel(foot: PreferredFoot, locale: Locale): string {
  return PREFERRED_FOOT_LABEL_BY_LOCALE[locale][foot];
}

export const INJURY_STATUSES = ["healthy", "minor", "major"] as const;
export type InjuryStatus = (typeof INJURY_STATUSES)[number];

const INJURY_STATUS_LABEL_BY_LOCALE: Record<Locale, Record<InjuryStatus, string>> = {
  es: {
    healthy: "Sano",
    minor: "Lesión leve",
    major: "Lesión grave",
  },
  en: {
    healthy: "Healthy",
    minor: "Minor injury",
    major: "Major injury",
  },
};

export function getInjuryStatusLabel(status: InjuryStatus, locale: Locale): string {
  return INJURY_STATUS_LABEL_BY_LOCALE[locale][status];
}

export const MEMBERSHIP_STATUSES = ["regular", "guest"] as const;
export type MembershipStatus = (typeof MEMBERSHIP_STATUSES)[number];

const MEMBERSHIP_STATUS_LABEL_BY_LOCALE: Record<Locale, Record<MembershipStatus, string>> = {
  es: {
    regular: "Fijo",
    guest: "Invitado",
  },
  en: {
    regular: "Regular",
    guest: "Guest",
  },
};

export function getMembershipStatusLabel(status: MembershipStatus, locale: Locale): string {
  return MEMBERSHIP_STATUS_LABEL_BY_LOCALE[locale][status];
}

export interface Player {
  id: string;
  name: string;
  /**
   * Positions this player performs best in, in order of preference — a
   * player can be equally (or almost equally) good in more than one. The
   * first listed is treated as a slightly better fit than the rest.
   * Empty if that hasn't been figured out yet (e.g. a new player who
   * hasn't played enough to tell). A player with no primary position can
   * still be confirmed for a match and assigned wherever fits — the
   * recommendation just won't treat them as a natural fit for any
   * particular slot.
   */
  primaryPositions: Position[];
  /** Other positions this player can cover, in order of preference. */
  secondaryPositions: Position[];
  /** `null` if not set yet. Used to prefer the more strongly-sided slot among interchangeable ones (e.g. a lefty center back on the left of a back three). */
  preferredFoot: PreferredFoot | null;
  /**
   * Whether this player is carrying an injury. A confirmed player who's
   * injured can still be selected — teams often bring them along just in
   * case — but the recommendation treats them as a last resort, only
   * picking them over a fit healthy alternative when there isn't one.
   */
  injuryStatus: InjuryStatus;
  /**
   * Whether this player is an established regular ("fijo" — always turns
   * out) or a guest brought in occasionally / for the first time
   * ("invitado"). Being a regular carries a large weight in the
   * recommendation — see `MEMBERSHIP_BONUS` in `lib/lineup/matching.ts` —
   * so a guest only takes a slot a regular would otherwise fill when
   * there's no fit regular alternative, similar in spirit to how an
   * injury is treated as a last resort.
   */
  membershipStatus: MembershipStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type PlayerInput = Pick<
  Player,
  | "name"
  | "primaryPositions"
  | "secondaryPositions"
  | "preferredFoot"
  | "injuryStatus"
  | "membershipStatus"
  | "notes"
>;

export function isValidPlayerInput(input: Partial<PlayerInput>): input is PlayerInput {
  if (!input.name || input.name.trim().length === 0) return false;
  if (input.primaryPositions && !Array.isArray(input.primaryPositions)) return false;
  if (input.secondaryPositions && !Array.isArray(input.secondaryPositions)) return false;
  if (
    input.preferredFoot != null &&
    !(PREFERRED_FEET as readonly string[]).includes(input.preferredFoot)
  ) {
    return false;
  }
  if (input.injuryStatus != null && !(INJURY_STATUSES as readonly string[]).includes(input.injuryStatus)) {
    return false;
  }
  if (
    input.membershipStatus != null &&
    !(MEMBERSHIP_STATUSES as readonly string[]).includes(input.membershipStatus)
  ) {
    return false;
  }
  return true;
}

/** A short "CB/RB" style label for a player's primary positions in the given language, or "" if none are set. */
export function primaryPositionLabel(player: Pick<Player, "primaryPositions">, locale: Locale): string {
  return player.primaryPositions.map((p) => getPositionCode(p, locale)).join("/");
}
