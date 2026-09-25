"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  FORMATIONS,
  FORMATION_NAMES_BY_LINE_COUNTS,
  getFormationDescription,
  getLineCounts,
  type FormationName,
} from "@/lib/domain/formation";
import { fetchFavoriteFormations, saveFavoriteFormations } from "@/lib/api-client";
import { useRefetchOnFocus } from "@/lib/use-refetch-on-focus";
import { useLocale } from "@/lib/i18n/LocaleContext";
import { formatAtTheBack, formatFavorite } from "@/lib/i18n/translations";

export default function FormationsPage() {
  const { locale, t } = useLocale();
  const [favorites, setFavorites] = useState<Set<FormationName>>(new Set());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<FormationName | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    fetchFavoriteFormations().then(({ formations }) => {
      setFavorites(new Set(formations));
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Covers Next's client Router Cache reusing this page, and the browser's
  // bfcache restoring it verbatim on back/forward navigation.
  useRefetchOnFocus(load);

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
      setError(t("formations.saveError"));
    } finally {
      setSaving(null);
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="text-2xl font-semibold tracking-tight">{t("formations.heading")}</h1>
      <p className="mt-2 text-sm text-muted">{t("formations.subtitle")}</p>

      {error && (
        <p className="mt-4 rounded-lg border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">
          {error}
        </p>
      )}

      {loading ? (
        <p className="mt-6 text-sm text-muted">{t("formations.loading")}</p>
      ) : (
        <div className="mt-8 flex flex-col gap-8">
          {groups.map(([defenders, names]) => (
            <section key={defenders}>
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">
                {formatAtTheBack(locale, defenders)}
              </h2>
              <ul className="grid gap-2 sm:grid-cols-2">
                {names.map((name) => {
                  const isFavorite = favorites.has(name);
                  return (
                    <li
                      key={name}
                      className="flex items-start gap-3 rounded-xl border border-border bg-surface px-3 py-2.5"
                    >
                      <button
                        type="button"
                        onClick={() => toggleFavorite(name)}
                        disabled={saving === name}
                        aria-label={formatFavorite(locale, name, isFavorite)}
                        aria-pressed={isFavorite}
                        className={`mt-0.5 text-lg leading-none transition disabled:opacity-40 ${
                          isFavorite ? "text-amber-400" : "text-muted/60 hover:text-muted"
                        }`}
                      >
                        {isFavorite ? "★" : "☆"}
                      </button>
                      <div>
                        <p className="font-medium">{name}</p>
                        <p className="text-sm text-muted">{getFormationDescription(name, locale)}</p>
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
