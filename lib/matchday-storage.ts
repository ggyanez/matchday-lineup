import type { FormationName } from "./domain/formation";
import type { Position } from "./domain/position";
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
  /** The last algorithmic recommendation, kept around for the alternatives tabs. */
  result: LineupResponse | null;
  /** Which formation the board is currently showing — set either by generating or by picking one manually. */
  activeFormation: FormationName | null;
  /** The board's current slotId -> playerId layout, which the user can freely edit by dragging. */
  assignments: Record<string, string | null>;
  /** Per-slot position relabels (e.g. a DC slot the user set to play as SD), keyed by slot id. */
  positionOverrides: Record<string, Position>;
  /** Per-slot marker nudges (a manual drag to a free spot on the pitch), keyed by slot id — purely visual. */
  positionNudges: Record<string, { x: number; y: number }>;
  /** The AI's analysis of the lineup, last requested manually via the "Analyze" button. */
  analysis: string | null;
  /** A fingerprint of the lineup the analysis above was actually generated from, to detect drift. */
  analysisSnapshot: string | null;
}

const STORAGE_KEY = "matchday-lineup:draft:v3";

const EMPTY_DRAFT: MatchDayDraft = {
  confirmedIds: [],
  result: null,
  activeFormation: null,
  assignments: {},
  positionOverrides: {},
  positionNudges: {},
  analysis: null,
  analysisSnapshot: null,
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
