"use client";

import { useEffect, useMemo, useState } from "react";
import PitchView from "@/components/PitchView";
import type { Player } from "@/lib/domain/player";
import { fetchPlayers, generateLineup, type LineupResponse } from "@/lib/api-client";
import type { FormationRecommendation } from "@/lib/lineup/matching";

export default function MatchDayPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmed, setConfirmed] = useState<Set<string>>(new Set());
  const [explainWithAI, setExplainWithAI] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<LineupResponse | null>(null);
  const [selected, setSelected] = useState<FormationRecommendation | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPlayers().then(({ players }) => {
      setPlayers(players);
      setLoading(false);
    });
  }, []);

  const options = useMemo(
    () => (result ? [result.best, ...result.alternatives] : []),
    [result]
  );

  function toggle(id: string) {
    setConfirmed((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function handleGenerate() {
    setError(null);
    setGenerating(true);
    try {
      const response = await generateLineup(Array.from(confirmed), {
        explain: explainWithAI,
      });
      setResult(response);
      setSelected(response.best);
    } catch {
      setError("Could not generate a lineup. Try confirming at least one player.");
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="text-2xl font-semibold tracking-tight">Match Day</h1>
      <p className="mt-2 text-sm text-black/60 dark:text-white/60">
        Confirm who&apos;s available for this match, then generate the best-fitting lineup.
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
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {players.map((player) => (
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
                  ({player.primaryPosition})
                </span>
              </label>
            ))}
          </div>
        )}
      </section>

      <section className="mt-6 flex items-center gap-4">
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
      </section>

      {error && <p className="mt-4 text-sm text-red-600 dark:text-red-400">{error}</p>}

      {result && selected && (
        <section className="mt-10 grid gap-8 sm:grid-cols-[1fr_1.2fr]">
          <div>
            <div className="flex flex-wrap gap-2">
              {options.map((option) => (
                <button
                  key={option.formation}
                  onClick={() => setSelected(option)}
                  className={`rounded-full border px-3 py-1 text-xs ${
                    selected.formation === option.formation
                      ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black"
                      : "border-black/20 text-black/70 dark:border-white/20 dark:text-white/70"
                  }`}
                >
                  {option.formation}
                </button>
              ))}
            </div>
            <PitchView slots={selected.slots} />
          </div>

          <div>
            <h2 className="text-lg font-medium">{selected.formation}</h2>
            <p className="text-sm text-black/60 dark:text-white/60">{selected.description}</p>

            {selected.warnings.length > 0 && (
              <ul className="mt-3 space-y-1 rounded border border-amber-500/40 bg-amber-500/10 p-3 text-xs text-amber-800 dark:text-amber-300">
                {selected.warnings.map((w, i) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
            )}

            {result.explanation && selected.formation === result.best.formation && (
              <p className="mt-4 rounded border border-black/10 bg-black/5 p-3 text-sm dark:border-white/10 dark:bg-white/5">
                {result.explanation}
              </p>
            )}

            <div className="mt-5">
              <h3 className="text-sm font-medium">Bench</h3>
              {selected.bench.length === 0 ? (
                <p className="text-sm text-black/60 dark:text-white/60">No one left over.</p>
              ) : (
                <p className="text-sm text-black/60 dark:text-white/60">
                  {selected.bench.map((p) => p.name).join(", ")}
                </p>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
