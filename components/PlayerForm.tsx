"use client";

import { useState } from "react";
import { getPositionCode, getPositionName, POSITIONS, type Position } from "@/lib/domain/position";
import {
  getInjuryStatusLabel,
  getPreferredFootLabel,
  INJURY_STATUSES,
  PREFERRED_FEET,
  type InjuryStatus,
  type Player,
  type PlayerInput,
  type PreferredFoot,
} from "@/lib/domain/player";
import { formatMoveDown, formatMoveUp, formatRemoveCode } from "@/lib/i18n/translations";
import { useLocale } from "@/lib/i18n/LocaleContext";
import PositionTooltip from "./PositionTooltip";
import InjuryBadge from "./InjuryBadge";

interface PlayerFormProps {
  initial?: Player | null;
  onSubmit: (input: PlayerInput) => Promise<void>;
  onCancel: () => void;
}

interface PositionOrderPickerProps {
  legend: string;
  hint: string;
  selected: Position[];
  /** Positions already claimed by the other list — hidden from this one's toggle grid. */
  excluded: Position[];
  onToggle: (position: Position) => void;
  onMove: (index: number, direction: -1 | 1) => void;
}

/** Tap-to-add positions, shown below as a reorderable, numbered list. */
function PositionOrderPicker({
  legend,
  hint,
  selected,
  excluded,
  onToggle,
  onMove,
}: PositionOrderPickerProps) {
  const { locale } = useLocale();
  return (
    <fieldset className="mt-4">
      <legend className="text-sm">{legend}</legend>
      <p className="mt-1 text-xs text-black/50 dark:text-white/50">{hint}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {POSITIONS.filter((p) => !excluded.includes(p)).map((p) => {
          const active = selected.includes(p);
          return (
            <PositionTooltip key={p} position={p}>
              <button
                type="button"
                onClick={() => onToggle(p)}
                className={`rounded-full border px-3 py-1 text-xs transition ${
                  active
                    ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black"
                    : "border-black/20 text-black/70 dark:border-white/20 dark:text-white/70"
                }`}
              >
                {getPositionCode(p, locale)}
              </button>
            </PositionTooltip>
          );
        })}
      </div>

      {selected.length > 0 && (
        <ol className="mt-3 flex flex-col gap-1">
          {selected.map((p, i) => {
            const code = getPositionCode(p, locale);
            return (
              <li
                key={p}
                className="flex items-center gap-2 rounded border border-black/10 px-2 py-1 text-sm dark:border-white/10"
              >
                <span className="w-4 text-black/40 dark:text-white/40">{i + 1}.</span>
                <PositionTooltip position={p} className="flex-1 cursor-help">
                  <span>
                    {code} — {getPositionName(p, locale)}
                  </span>
                </PositionTooltip>
                <button
                  type="button"
                  onClick={() => onMove(i, -1)}
                  disabled={i === 0}
                  aria-label={formatMoveUp(locale, code)}
                  className="disabled:opacity-30"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => onMove(i, 1)}
                  disabled={i === selected.length - 1}
                  aria-label={formatMoveDown(locale, code)}
                  className="disabled:opacity-30"
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => onToggle(p)}
                  aria-label={formatRemoveCode(locale, code)}
                  className="text-black/50 hover:text-red-600 dark:text-white/50 dark:hover:text-red-400"
                >
                  ✕
                </button>
              </li>
            );
          })}
        </ol>
      )}
    </fieldset>
  );
}

function moveInList<T>(list: T[], index: number, direction: -1 | 1): T[] {
  const target = index + direction;
  if (target < 0 || target >= list.length) return list;
  const next = [...list];
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}

export default function PlayerForm({ initial, onSubmit, onCancel }: PlayerFormProps) {
  const { locale, t } = useLocale();
  const [name, setName] = useState(initial?.name ?? "");
  const [primaryPositions, setPrimaryPositions] = useState<Position[]>(
    initial?.primaryPositions ?? []
  );
  const [secondaryPositions, setSecondaryPositions] = useState<Position[]>(
    initial?.secondaryPositions ?? []
  );
  const [preferredFoot, setPreferredFoot] = useState<PreferredFoot | null>(
    initial?.preferredFoot ?? null
  );
  const [injuryStatus, setInjuryStatus] = useState<InjuryStatus>(initial?.injuryStatus ?? "healthy");
  const [notes, setNotes] = useState(initial?.notes ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function togglePrimary(position: Position) {
    setPrimaryPositions((current) =>
      current.includes(position) ? current.filter((p) => p !== position) : [...current, position]
    );
    setSecondaryPositions((current) => current.filter((p) => p !== position));
  }

  function toggleSecondary(position: Position) {
    setSecondaryPositions((current) =>
      current.includes(position) ? current.filter((p) => p !== position) : [...current, position]
    );
    setPrimaryPositions((current) => current.filter((p) => p !== position));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError(t("form.nameRequired"));
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await onSubmit({
        name: name.trim(),
        primaryPositions,
        secondaryPositions,
        preferredFoot,
        injuryStatus,
        notes: notes.trim() || undefined,
      });
    } catch {
      setError(t("form.saveError"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg border border-black/10 p-5 dark:border-white/10"
    >
      <label className="flex flex-col gap-1 text-sm">
        {t("form.nameLabel")}
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="rounded border border-black/20 bg-transparent px-3 py-2 dark:border-white/20"
          placeholder={t("form.namePlaceholder")}
        />
      </label>

      <PositionOrderPicker
        legend={t("form.primaryLegend")}
        hint={t("form.primaryHint")}
        selected={primaryPositions}
        excluded={secondaryPositions}
        onToggle={togglePrimary}
        onMove={(i, dir) => setPrimaryPositions((current) => moveInList(current, i, dir))}
      />

      <PositionOrderPicker
        legend={t("form.secondaryLegend")}
        hint={t("form.secondaryHint")}
        selected={secondaryPositions}
        excluded={primaryPositions}
        onToggle={toggleSecondary}
        onMove={(i, dir) => setSecondaryPositions((current) => moveInList(current, i, dir))}
      />

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <fieldset>
          <legend className="text-sm">{t("form.footLegend")}</legend>
          <p className="mt-1 text-xs text-black/50 dark:text-white/50">{t("form.footHint")}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {PREFERRED_FEET.map((foot) => {
              const active = preferredFoot === foot;
              return (
                <button
                  key={foot}
                  type="button"
                  onClick={() => setPreferredFoot(active ? null : foot)}
                  className={`rounded-full border px-3 py-1 text-xs transition ${
                    active
                      ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black"
                      : "border-black/20 text-black/70 dark:border-white/20 dark:text-white/70"
                  }`}
                >
                  {getPreferredFootLabel(foot, locale)}
                </button>
              );
            })}
          </div>
        </fieldset>

        <fieldset>
          <legend className="text-sm">{t("form.injuryLegend")}</legend>
          <p className="mt-1 text-xs text-black/50 dark:text-white/50">{t("form.injuryHint")}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {INJURY_STATUSES.map((status) => {
              const active = injuryStatus === status;
              return (
                <button
                  key={status}
                  type="button"
                  onClick={() => setInjuryStatus(status)}
                  className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs transition ${
                    active
                      ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black"
                      : "border-black/20 text-black/70 dark:border-white/20 dark:text-white/70"
                  }`}
                >
                  <InjuryBadge status={status} />
                  {getInjuryStatusLabel(status, locale)}
                </button>
              );
            })}
          </div>
        </fieldset>
      </div>

      <label className="mt-4 flex flex-col gap-1 text-sm">
        {t("form.notesLabel")}
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          className="rounded border border-black/20 bg-transparent px-3 py-2 dark:border-white/20"
        />
      </label>

      {error && <p className="mt-3 text-sm text-red-600 dark:text-red-400">{error}</p>}

      <div className="mt-5 flex gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="rounded bg-black px-4 py-2 text-sm text-white disabled:opacity-50 dark:bg-white dark:text-black"
        >
          {submitting ? t("form.saving") : initial ? t("form.saveChanges") : t("players.addPlayer")}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded border border-black/20 px-4 py-2 text-sm dark:border-white/20"
        >
          {t("form.cancel")}
        </button>
      </div>
    </form>
  );
}
