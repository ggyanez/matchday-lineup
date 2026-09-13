import type { FormationName } from "./domain/formation";
import type { LineupResponse } from "./api-client";

/**
 * Keeps the in-progress Match Day selection (who's confirmed, the current
 * board layout, the last algorithmic result) in the browser's
 * localStorage, so navigating away to Players and back doesn't lose it.
 * This is purely a per-device convenience — nothing here is shared or
 * synced, and it's fine for it to come back empty (private browsing,
 * cleared site data, ...).
 */
export interface MatchDayDraft {
  confirmedIds: string[];
  explainWithAI: boolean;
  /** The last algorithmic recommendation, kept around for the alternatives tabs and the AI explanation. */
  result: LineupResponse | null;
  /** Which formation the board is currently showing — set either by generating or by picking one manually. */
  activeFormation: FormationName | null;
  /** The board's current slotId -> playerId layout, which the user can freely edit by dragging. */
  assignments: Record<string, string | null>;
}

const STORAGE_KEY = "matchday-lineup:draft:v2";

const EMPTY_DRAFT: MatchDayDraft = {
  confirmedIds: [],
  explainWithAI: false,
  result: null,
  activeFormation: null,
  assignments: {},
};

export function loadMatchDayDraft(): MatchDayDraft {
  if (typeof window === "undefined") return EMPTY_DRAFT;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_DRAFT;
    return { ...EMPTY_DRAFT, ...JSON.parse(raw) };
  } catch {
    return EMPTY_DRAFT;
  }
}

export function saveMatchDayDraft(draft: MatchDayDraft): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
  } catch {
    // Best-effort only — a full or disabled localStorage shouldn't break the page.
  }
}

export function clearMatchDayDraft(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
