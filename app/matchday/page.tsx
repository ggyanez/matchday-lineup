"use client";

import { useEffect, useMemo, useState } from "react";
import PitchBoard, { type SlotAssignments } from "@/components/PitchBoard";
import { primaryPositionLabel, type Player } from "@/lib/domain/player";
import {
  POSITION_GROUP,
  POSITION_GROUP_LABELS,
  POSITION_GROUP_ORDER,
  type PositionGroup,
} from "@/lib/domain/position";
import {
  FORMATIONS,
  FORMATION_NAMES_BY_LINE_COUNTS,
  type FormationName,
} from "@/lib/domain/formation";
import {
  fetchFavoriteFormations,
  fetchPlayers,
  generateLineup,
  type LineupResponse,
} from "@/lib/api-client";
import { buildRecommendationFromAssignment, type SlotAssignment } from "@/lib/lineup/matching";
import { clearMatchDayDraft, loadMatchDayDraft, saveMatchDayDraft } from "@/lib/matchday-storage";

function assignmentsFromSlots(slots: SlotAssignment[]): SlotAssignments {
  return Object.fromEntries(slots.map((s) => [s.slotId, s.player?.id ?? null]));
}

function sameAssignments(a: SlotAssignments, b: SlotAssignments): boolean {
  const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
  for (const key of keys) {
    if ((a[key] ?? null) !== (b[key] ?? null)) return false;
  }
  return true;
}

export default function MatchDayPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmed, setConfirmed] = useState<Set<string>>(new Set());
  const [explainWithAI, setExplainWithAI] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<LineupResponse | null>(null);
  const [activeFormationName, setActiveFormationName] = useState<FormationName | null>(null);
  const [assignments, setAssignments] = useState<SlotAssignments>({});
  const [favoriteFormations, setFavoriteFormations] = useState<Set<FormationName>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [restored, setRestored] = useState(false);

  useEffect(() => {
    fetchPlayers().then(({ players }) => {
      setPlayers(players);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    fetchFavoriteFormations().then(({ formations }) => {
      setFavoriteFormations(new Set(formations));
    });
  }, []);

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
    setExplainWithAI(draft.explainWithAI);
    setResult(draft.result);
    setActiveFormationName(draft.activeFormation);
    setAssignments(draft.assignments);
    setRestored(true);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  // Persist on every change, once the initial restore above has run —
  // otherwise this would fire first with empty state and wipe the draft.
  useEffect(() => {
    if (!restored) return;
    saveMatchDayDraft({
      confirmedIds: Array.from(confirmed),
      explainWithAI,
      result,
      activeFormation: activeFormationName,
      assignments,
    });
  }, [restored, confirmed, explainWithAI, result, activeFormationName, assignments]);

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

  // Recomputed live from the current (possibly hand-edited) assignments —
  // not frozen from whatever the algorithm originally suggested.
  const live = useMemo(
    () =>
      activeFormation
        ? buildRecommendationFromAssignment(confirmedPlayers, activeFormation, assignments)
        : null,
    [activeFormation, confirmedPlayers, assignments]
  );

  const isShowingGeneratedBest =
    result !== null &&
    activeFormationName === result.best.formation &&
    sameAssignments(assignments, assignmentsFromSlots(result.best.slots));

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
  }

  async function handleGenerate() {
    setError(null);
    setGenerating(true);
    try {
      const response = await generateLineup(Array.from(confirmed), {
        explain: explainWithAI,
      });
      setResult(response);
      openFormation(response.best.formation, assignmentsFromSlots(response.best.slots));
    } catch {
      setError("Could not generate a lineup. Try confirming at least one player.");
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
        explain: explainWithAI,
        formations: [activeFormationName],
      });
      setResult(response);
      openFormation(response.best.formation, assignmentsFromSlots(response.best.slots));
    } catch {
      setError("Could not fit confirmed players into this formation.");
    } finally {
      setGenerating(false);
    }
  }

  function handleReset() {
    setConfirmed(new Set());
    setExplainWithAI(false);
    setResult(null);
    setActiveFormationName(null);
    setAssignments({});
    setError(null);
    clearMatchDayDraft();
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="text-2xl font-semibold tracking-tight">Match Day</h1>
      <p className="mt-2 text-sm text-black/60 dark:text-white/60">
        Confirm who&apos;s available for this match, generate the best-fitting lineup, then drag
        players between slots and the bench to fine-tune it.
      </p>

      <section className="mt-6">
        <h2 className="text-sm font-medium">Confirmed players</h2>
        {loading ? (
          <p className="mt-2 text-sm text-black/60 dark:text-white/60">Loading players...</p>
        ) : players.length === 0 ? (
          <p className="mt-2 text-sm text-black/60 dark:text-white/60">
            No players registered yet — add some on the Players page first.
          </p>
        ) : (
          <div className="mt-3 flex flex-col gap-5">
            {[...POSITION_GROUP_ORDER, "none" as const].map((group) => {
              const groupPlayers = playersByGroup.get(group);
              if (!groupPlayers || groupPlayers.length === 0) return null;
              return (
                <div key={group}>
                  <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-black/50 dark:text-white/50">
                    {group === "none" ? "No position set" : POSITION_GROUP_LABELS[group]}
                  </h3>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {groupPlayers.map((player) => (
                      <label
                        key={player.id}
                        className="flex items-center gap-2 rounded border border-black/10 px-3 py-2 text-sm dark:border-white/10"
                      >
                        <input
                          type="checkbox"
                          checked={confirmed.has(player.id)}
                          onChange={() => toggle(player.id)}
                        />
                        <span>{player.name}</span>
                        <span className="text-black/50 dark:text-white/50">
                          ({primaryPositionLabel(player) || "no position"})
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section className="mt-6 flex flex-wrap items-center gap-4">
        <button
          onClick={handleGenerate}
          disabled={confirmed.size === 0 || generating}
          className="rounded bg-black px-4 py-2 text-sm text-white disabled:opacity-50 dark:bg-white dark:text-black"
        >
          {generating ? "Generating..." : "Generate recommended lineup"}
        </button>
        <label className="flex items-center gap-2 text-sm text-black/70 dark:text-white/70">
          <input
            type="checkbox"
            checked={explainWithAI}
            onChange={(e) => setExplainWithAI(e.target.checked)}
          />
          Explain with AI
        </label>

        <label className="flex items-center gap-2 text-sm text-black/70 dark:text-white/70">
          or build manually:
          <select
            value={activeFormationName ?? ""}
            onChange={(e) => {
              const name = e.target.value as FormationName | "";
              if (name) openFormation(name);
            }}
            disabled={confirmed.size === 0}
            className="rounded border border-black/20 bg-transparent px-2 py-1 dark:border-white/20"
          >
            <option value="">Choose a formation…</option>
            {orderedFormationNames.map((name) => (
              <option key={name} value={name}>
                {favoriteFormations.has(name) ? `★ ${name}` : name}
              </option>
            ))}
          </select>
        </label>

        {activeFormationName && (
          <button
            onClick={handleForceFormation}
            disabled={confirmed.size === 0 || generating}
            title="Fill this exact formation with the best assignment of confirmed players"
            className="rounded bg-black px-4 py-2 text-sm text-white disabled:opacity-50 dark:bg-white dark:text-black"
          >
            {generating ? "Assigning..." : `Force ${activeFormationName}`}
          </button>
        )}

        {(confirmed.size > 0 || result) && (
          <button
            onClick={handleReset}
            className="text-sm text-black/50 hover:text-red-600 dark:text-white/50 dark:hover:text-red-400"
          >
            Reset
          </button>
        )}
      </section>

      {error && <p className="mt-4 text-sm text-red-600 dark:text-red-400">{error}</p>}

      {activeFormation && live && (
        <section className="mt-10 grid gap-8 sm:grid-cols-[1fr_1.2fr]">
          <div>
            {formationOptions.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-2">
                {formationOptions.map((option) => (
                  <button
                    key={option.formation}
                    onClick={() => openFormation(option.formation, assignmentsFromSlots(option.slots))}
                    className={`rounded-full border px-3 py-1 text-xs ${
                      activeFormationName === option.formation
                        ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black"
                        : "border-black/20 text-black/70 dark:border-white/20 dark:text-white/70"
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
            />
          </div>

          <div>
            <h2 className="text-lg font-medium">{activeFormation.name}</h2>
            <p className="text-sm text-black/60 dark:text-white/60">{activeFormation.description}</p>

            {live.warnings.length > 0 && (
              <ul className="mt-3 space-y-1 rounded border border-amber-500/40 bg-amber-500/10 p-3 text-xs text-amber-800 dark:text-amber-300">
                {live.warnings.map((w, i) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
            )}

            {result?.explanation && activeFormationName === result.best.formation && (
              <div className="mt-4 rounded border border-black/10 bg-black/5 p-3 text-sm dark:border-white/10 dark:bg-white/5">
                <p>{result.explanation}</p>
                {!isShowingGeneratedBest && (
                  <p className="mt-2 text-xs italic text-black/50 dark:text-white/50">
                    You&apos;ve edited this lineup since it was generated — the explanation above
                    refers to the original suggestion.
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
