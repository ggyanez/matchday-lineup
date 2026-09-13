"use client";

import { useEffect, useMemo, useState } from "react";
import {
  FORMATIONS,
  FORMATION_NAMES_BY_LINE_COUNTS,
  getLineCounts,
  type FormationName,
} from "@/lib/domain/formation";
import { fetchFavoriteFormations, saveFavoriteFormations } from "@/lib/api-client";

export default function FormationsPage() {
  const [favorites, setFavorites] = useState<Set<FormationName>>(new Set());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<FormationName | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFavoriteFormations().then(({ formations }) => {
      setFavorites(new Set(formations));
      setLoading(false);
    });
  }, []);

  const groups = useMemo(() => {
    const byDefenders = new Map<number, FormationName[]>();
    for (const name of FORMATION_NAMES_BY_LINE_COUNTS) {
      const { defenders } = getLineCounts(FORMATIONS[name]);
      const list = byDefenders.get(defenders);
      if (list) list.push(name);
      else byDefenders.set(defenders, [name]);
    }
    return [...byDefenders.entries()].sort(([a], [b]) => a - b);
  }, []);

  async function toggleFavorite(name: FormationName) {
    const next = new Set(favorites);
    if (next.has(name)) next.delete(name);
    else next.add(name);

    setFavorites(next); // optimistic
    setSaving(name);
    setError(null);
    try {
      await saveFavoriteFormations([...next]);
    } catch {
      setFavorites(favorites); // revert
      setError("Could not save that — try again.");
    } finally {
      setSaving(null);
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="text-2xl font-semibold tracking-tight">Formations</h1>
      <p className="mt-2 text-sm text-black/60 dark:text-white/60">
        Star the formations your team actually uses — they&apos;ll show first (marked ★) in
        the Match Day formation picker.
      </p>

      {error && <p className="mt-4 text-sm text-red-600 dark:text-red-400">{error}</p>}

      {loading ? (
        <p className="mt-6 text-sm text-black/60 dark:text-white/60">Loading...</p>
      ) : (
        <div className="mt-8 flex flex-col gap-8">
          {groups.map(([defenders, names]) => (
            <section key={defenders}>
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-black/50 dark:text-white/50">
                {defenders} at the back
              </h2>
              <ul className="grid gap-2 sm:grid-cols-2">
                {names.map((name) => {
                  const formation = FORMATIONS[name];
                  const isFavorite = favorites.has(name);
                  return (
                    <li
                      key={name}
                      className="flex items-start gap-3 rounded border border-black/10 px-3 py-2 dark:border-white/10"
                    >
                      <button
                        type="button"
                        onClick={() => toggleFavorite(name)}
                        disabled={saving === name}
                        aria-label={isFavorite ? `Unfavorite ${name}` : `Favorite ${name}`}
                        aria-pressed={isFavorite}
                        className={`mt-0.5 text-lg leading-none disabled:opacity-40 ${
                          isFavorite
                            ? "text-amber-500"
                            : "text-black/25 hover:text-black/50 dark:text-white/25 dark:hover:text-white/50"
                        }`}
                      >
                        {isFavorite ? "★" : "☆"}
                      </button>
                      <div>
                        <p className="font-medium">{name}</p>
                        <p className="text-sm text-black/60 dark:text-white/60">
                          {formation.description}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
