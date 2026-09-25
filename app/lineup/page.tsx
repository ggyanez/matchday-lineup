"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import PitchBoard, {
  type PositionNudges,
  type PositionOverrides,
  type SlotAssignments,
} from "@/components/PitchBoard";
import InjuryBadge from "@/components/InjuryBadge";
import { getMembershipStatusLabel, primaryPositionLabel, type Player } from "@/lib/domain/player";
import {
  getPositionGroupLabel,
  POSITION_GROUP,
  POSITION_GROUP_ORDER,
  type Position,
  type PositionGroup,
} from "@/lib/domain/position";
import {
  FORMATIONS,
  FORMATION_NAMES_BY_LINE_COUNTS,
  getFormationDescription,
  withPositionOverrides,
  type FormationName,
} from "@/lib/domain/formation";
import {
  analyzeLineupRequest,
  fetchFavoriteFormations,
  fetchPlayers,
  generateLineup,
  type LineupResponse,
} from "@/lib/api-client";
import { buildRecommendationFromAssignment, type SlotAssignment } from "@/lib/lineup/matching";
import { clearMatchDayDraft, loadMatchDayDraft, saveMatchDayDraft } from "@/lib/matchday-storage";
import { useRefetchOnFocus } from "@/lib/use-refetch-on-focus";
import { useLocale } from "@/lib/i18n/LocaleContext";
import { formatConfirmedCount } from "@/lib/i18n/translations";

function assignmentsFromSlots(slots: SlotAssignment[]): SlotAssignments {
  return Object.fromEntries(slots.map((s) => [s.slotId, s.player?.id ?? null]));
}

export default function MatchDayPage() {
  const { locale, t } = useLocale();
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmed, setConfirmed] = useState<Set<string>>(new Set());
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<LineupResponse | null>(null);
  const [activeFormationName, setActiveFormationName] = useState<FormationName | null>(null);
  const [assignments, setAssignments] = useState<SlotAssignments>({});
  const [positionOverrides, setPositionOverrides] = useState<PositionOverrides>({});
  const [positionNudges, setPositionNudges] = useState<PositionNudges>({});
  const [favoriteFormations, setFavoriteFormations] = useState<Set<FormationName>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [restored, setRestored] = useState(false);
  // Collapsed once there's already a lineup on the board — the pitch is
  // what you came back for, not the roster you already confirmed last
  // time. Reopens on demand (to tweak who's confirmed) or automatically
  // once you start over.
  const [playersSectionOpen, setPlayersSectionOpen] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [analysisSnapshot, setAnalysisSnapshot] = useState<string | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const loadPlayers = useCallback(() => {
    fetchPlayers().then(({ players }) => {
      setPlayers(players);
      setLoading(false);
    });
  }, []);

  const loadFavoriteFormations = useCallback(() => {
    fetchFavoriteFormations().then(({ formations }) => {
      setFavoriteFormations(new Set(formations));
    });
  }, []);

  useEffect(() => {
    loadPlayers();
  }, [loadPlayers]);

  useEffect(() => {
    loadFavoriteFormations();
  }, [loadFavoriteFormations]);

  // Covers Next's client Router Cache reusing this page, and the browser's
  // bfcache restoring it verbatim on back/forward — both can otherwise
  // leave confirmed players (and their positions) showing stale data after
  // an edit made on another page.
  const refetchAll = useCallback(() => {
    loadPlayers();
    loadFavoriteFormations();
  }, [loadPlayers, loadFavoriteFormations]);
  useRefetchOnFocus(refetchAll);

  // Favorited formations (set on the Formations page) come first, each
  // marked with a star; everything else follows in its usual line-size
  // order.
  const orderedFormationNames = useMemo(() => {
    const favorites = FORMATION_NAMES_BY_LINE_COUNTS.filter((name) =>
      favoriteFormations.has(name)
    );
    const rest = FORMATION_NAMES_BY_LINE_COUNTS.filter((name) => !favoriteFormations.has(name));
    return [...favorites, ...rest];
  }, [favoriteFormations]);

  // Restore whatever was left in progress (confirmed players, the board
  // layout, last generated lineup) so switching to another page and back
  // doesn't lose it. This page is statically prerendered, so the
  // server-rendered shell is always the empty state — restoring has to
  // happen post-mount, in an effect, to avoid a hydration mismatch against
  // that shell.
  /* eslint-disable react-hooks/set-state-in-effect -- intentional: syncing
     one-time from localStorage after mount, not deriving from props/state */
  useEffect(() => {
    const draft = loadMatchDayDraft();
    setConfirmed(new Set(draft.confirmedIds));
    setResult(draft.result);
    setActiveFormationName(draft.activeFormation);
    setAssignments(draft.assignments);
    setPositionOverrides(draft.positionOverrides);
    setPositionNudges(draft.positionNudges);
    setAnalysis(draft.analysis);
    setAnalysisSnapshot(draft.analysisSnapshot);
    setPlayersSectionOpen(!draft.activeFormation);
    setRestored(true);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  // Persist on every change, once the initial restore above has run —
  // otherwise this would fire first with empty state and wipe the draft.
  useEffect(() => {
    if (!restored) return;
    saveMatchDayDraft({
      confirmedIds: Array.from(confirmed),
      result,
      activeFormation: activeFormationName,
      assignments,
      positionOverrides,
      positionNudges,
      analysis,
      analysisSnapshot,
    });
  }, [
    restored,
    confirmed,
    result,
    activeFormationName,
    assignments,
    positionOverrides,
    positionNudges,
    analysis,
    analysisSnapshot,
  ]);

  const confirmedPlayers = useMemo(
    () => players.filter((p) => confirmed.has(p.id)),
    [players, confirmed]
  );

  // Grouped by the player's first-listed primary position, so a long
  // squad reads like a team sheet instead of one flat alphabetical list.
  const playersByGroup = useMemo(() => {
    const groups = new Map<PositionGroup | "none", Player[]>();
    for (const player of players) {
      const primary = player.primaryPositions[0];
      const key: PositionGroup | "none" = primary ? POSITION_GROUP[primary] : "none";
      const list = groups.get(key);
      if (list) list.push(player);
      else groups.set(key, [player]);
    }
    return groups;
  }, [players]);

  const formationOptions = useMemo(
    () => (result ? [result.best, ...result.alternatives] : []),
    [result]
  );

  const activeFormation = activeFormationName ? FORMATIONS[activeFormationName] : null;

  // The formation actually used for scoring/display, with any per-slot
  // position overrides (see PitchBoard) applied on top of the canonical
  // one — e.g. a DC slot the user relabeled as SD is evaluated as SD.
  const effectiveFormation = useMemo(
    () => (activeFormation ? withPositionOverrides(activeFormation, positionOverrides) : null),
    [activeFormation, positionOverrides]
  );

  // Recomputed live from the current (possibly hand-edited) assignments —
  // not frozen from whatever the algorithm originally suggested.
  const live = useMemo(
    () =>
      effectiveFormation
        ? buildRecommendationFromAssignment(confirmedPlayers, effectiveFormation, assignments, locale)
        : null,
    [effectiveFormation, confirmedPlayers, assignments, locale]
  );

  // A fingerprint of exactly what's on the board right now — formation,
  // who's in which slot (and what position that slot is currently
  // playing, after any override), who's on the bench, and each of those
  // players' own relevant attributes. Comparing this against the
  // snapshot taken when the AI analysis was last requested is how we
  // detect that the analysis has gone stale (a drag-and-drop edit, an
  // override, or even an edit to a player's data elsewhere).
  const liveFingerprint = useMemo(() => {
    if (!live) return null;
    return JSON.stringify({
      formation: live.formation,
      slots: live.slots.map((s) => ({
        slotId: s.slotId,
        position: s.position,
        player: s.player
          ? [
              s.player.id,
              s.player.primaryPositions,
              s.player.secondaryPositions,
              s.player.preferredFoot,
              s.player.injuryStatus,
              s.player.membershipStatus,
            ]
          : null,
      })),
      bench: live.bench.map((p) => p.id),
    });
  }, [live]);

  const isAnalysisStale =
    analysis !== null && analysisSnapshot !== null && analysisSnapshot !== liveFingerprint;

  function toggle(id: string) {
    setConfirmed((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function openFormation(name: FormationName, initialAssignments: SlotAssignments = {}) {
    setActiveFormationName(name);
    setAssignments(initialAssignments);
    setPositionOverrides({});
    setPositionNudges({});
    setAnalysis(null);
    setAnalysisSnapshot(null);
    setAnalysisError(null);
  }

  /** Manually nudges a slot's marker to a free-form spot on the pitch — purely visual, doesn't affect scoring. */
  function handlePositionNudgeChange(slotId: string, position: { x: number; y: number }) {
    setPositionNudges((current) => ({ ...current, [slotId]: position }));
  }

  async function handleAnalyze() {
    if (!live) return;
    setAnalyzing(true);
    setAnalysisError(null);
    try {
      const { explanation } = await analyzeLineupRequest(live, locale);
      if (explanation) {
        setAnalysis(explanation);
        setAnalysisSnapshot(liveFingerprint);
      } else {
        setAnalysisError(t("matchday.analysisError"));
      }
    } catch {
      setAnalysisError(t("matchday.analysisError"));
    } finally {
      setAnalyzing(false);
    }
  }

  /** Relabels one slot as one of its tactical alternatives (or clears the override, if choosing the slot's own base position). */
  function handlePositionOverrideChange(slotId: string, position: Position) {
    const basePosition = activeFormation?.slots.find((s) => s.id === slotId)?.position;
    setPositionOverrides((current) => {
      if (position === basePosition) {
        const next = { ...current };
        delete next[slotId];
        return next;
      }
      return { ...current, [slotId]: position };
    });
  }

  async function handleGenerate() {
    setError(null);
    setGenerating(true);
    try {
      const response = await generateLineup(Array.from(confirmed), { locale });
      setResult(response);
      openFormation(response.best.formation, assignmentsFromSlots(response.best.slots));
      setPlayersSectionOpen(false);
    } catch {
      setError(t("matchday.generateError"));
    } finally {
      setGenerating(false);
    }
  }

  /** Runs the same algorithm as "Generate", but locked to whichever formation is picked. */
  async function handleForceFormation() {
    if (!activeFormationName) return;
    setError(null);
    setGenerating(true);
    try {
      const response = await generateLineup(Array.from(confirmed), {
        formations: [activeFormationName],
        locale,
      });
      setResult(response);
      openFormation(response.best.formation, assignmentsFromSlots(response.best.slots));
      setPlayersSectionOpen(false);
    } catch {
      setError(t("matchday.forceError"));
    } finally {
      setGenerating(false);
    }
  }

  function handleReset() {
    setPlayersSectionOpen(true);
    setConfirmed(new Set());
    setResult(null);
    setActiveFormationName(null);
    setAssignments({});
    setPositionOverrides({});
    setPositionNudges({});
    setAnalysis(null);
    setAnalysisSnapshot(null);
    setAnalysisError(null);
    setError(null);
    clearMatchDayDraft();
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="text-2xl font-semibold tracking-tight">{t("matchday.heading")}</h1>
      <p className="mt-2 text-sm text-muted">{t("matchday.subtitle")}</p>

      <section className="mt-6 rounded-2xl border border-border bg-surface">
        <button
          type="button"
          onClick={() => setPlayersSectionOpen((open) => !open)}
          className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left"
        >
          <span className="flex items-center gap-2">
            <span className="text-sm font-medium">{t("matchday.confirmedPlayers")}</span>
            {!loading && players.length > 0 && (
              <span className="text-xs text-muted">
                {formatConfirmedCount(locale, confirmed.size, players.length)}
              </span>
            )}
          </span>
          <span className={`text-muted transition-transform ${playersSectionOpen ? "rotate-180" : ""}`}>
            ▾
          </span>
        </button>

        {playersSectionOpen && (
          <div className="border-t border-border px-4 pb-4 pt-1">
            {loading ? (
              <p className="mt-2 text-sm text-muted">{t("matchday.loadingPlayers")}</p>
            ) : players.length === 0 ? (
              <p className="mt-2 text-sm text-muted">{t("matchday.noPlayersYet")}</p>
            ) : (
              <div className="mt-3 flex flex-col gap-5">
                {[...POSITION_GROUP_ORDER, "none" as const].map((group) => {
                  const groupPlayers = playersByGroup.get(group);
                  if (!groupPlayers || groupPlayers.length === 0) return null;
                  return (
                    <div key={group}>
                      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
                        {group === "none"
                          ? t("matchday.noPositionSet")
                          : getPositionGroupLabel(group, locale)}
                      </h3>
                      <div className="grid gap-2 sm:grid-cols-2">
                        {groupPlayers.map((player) => (
                          <label
                            key={player.id}
                            className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition ${
                              confirmed.has(player.id)
                                ? "border-accent/40 bg-accent/10"
                                : "border-border-strong hover:border-border"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={confirmed.has(player.id)}
                              onChange={() => toggle(player.id)}
                              className="accent-green-500"
                            />
                            <span className="flex items-center gap-1">
                              {player.name}
                              <InjuryBadge status={player.injuryStatus} />
                              {player.membershipStatus === "guest" && (
                                <span className="rounded-full border border-amber-500/40 px-1.5 py-0.5 text-[10px] font-medium text-amber-400">
                                  {getMembershipStatusLabel("guest", locale)}
                                </span>
                              )}
                            </span>
                            <span className="text-muted">
                              ({primaryPositionLabel(player, locale) || t("matchday.noPositionInline")})
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </section>

      <section className="mt-6 flex flex-col gap-4">
        {/* Two ways to get a lineup, side by side so it's clear it's one or the other. */}
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={activeFormationName ?? ""}
            onChange={(e) => {
              const name = e.target.value as FormationName | "";
              if (name) openFormation(name);
            }}
            disabled={confirmed.size === 0}
            className="rounded-lg border border-border-strong bg-background px-3 py-2 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/30 disabled:opacity-50"
          >
            <option value="">{t("matchday.chooseFormation")}</option>
            {orderedFormationNames.map((name) => (
              <option key={name} value={name}>
                {favoriteFormations.has(name) ? `★ ${name}` : name}
              </option>
            ))}
          </select>
          <button
            onClick={handleForceFormation}
            disabled={!activeFormationName || confirmed.size === 0 || generating}
            title={t("matchday.forceTitle")}
            className="rounded-lg border border-accent px-4 py-2 text-sm font-medium text-accent transition hover:bg-accent/10 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {generating ? t("matchday.generatingButton") : t("matchday.generateButton")}
          </button>

          <span className="text-sm text-muted">{t("matchday.or")}</span>

          <button
            onClick={handleGenerate}
            disabled={confirmed.size === 0 || generating}
            className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-40"
          >
            {generating ? t("matchday.recommendingButton") : t("matchday.recommendButton")}
          </button>
        </div>

        {(confirmed.size > 0 || result) && (
          <button
            onClick={handleReset}
            className="self-start text-sm text-muted transition hover:text-danger"
          >
            {t("matchday.reset")}
          </button>
        )}
      </section>

      {error && (
        <p className="mt-4 rounded-lg border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">
          {error}
        </p>
      )}

      {activeFormation && live && (
        <section className="mt-10 grid gap-8 sm:grid-cols-[1fr_1.2fr]">
          <div>
            {formationOptions.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-2">
                {formationOptions.map((option) => (
                  <button
                    key={option.formation}
                    onClick={() => openFormation(option.formation, assignmentsFromSlots(option.slots))}
                    className={`rounded-full border px-3 py-1 text-xs transition ${
                      activeFormationName === option.formation
                        ? "border-accent bg-accent/15 text-accent"
                        : "border-border-strong text-muted hover:border-border hover:text-foreground"
                    }`}
                  >
                    {option.formation}
                  </button>
                ))}
              </div>
            )}
            <PitchBoard
              formation={activeFormation}
              players={confirmedPlayers}
              assignments={assignments}
              onAssignmentsChange={setAssignments}
              positionOverrides={positionOverrides}
              onPositionOverrideChange={handlePositionOverrideChange}
              positionNudges={positionNudges}
              onPositionNudgeChange={handlePositionNudgeChange}
            />
          </div>

          <div>
            <h2 className="text-lg font-medium">{activeFormation.name}</h2>
            <p className="text-sm text-muted">{getFormationDescription(activeFormation.name, locale)}</p>

            {live.warnings.length > 0 && (
              <ul className="mt-3 space-y-1 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-300">
                {live.warnings.map((w, i) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
            )}

            <button
              onClick={handleAnalyze}
              disabled={analyzing}
              className="mt-3 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-40"
            >
              {analyzing ? `✨ ${t("matchday.analyzingButton")}` : `✨ ${t("matchday.analyzeButton")}`}
            </button>

            {analysisError && <p className="mt-2 text-sm text-danger">{analysisError}</p>}

            {analysis && (
              <div className="mt-4 rounded-xl border border-border bg-surface p-4 text-sm">
                <p>{analysis}</p>
                {isAnalysisStale && (
                  <p className="mt-2 text-xs italic text-muted">
                    {t("matchday.staleExplanationNote")}
                  </p>
                )}
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
