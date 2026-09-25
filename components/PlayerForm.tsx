"use client";

import { useState } from "react";
import { getPositionCode, getPositionName, POSITIONS, type Position } from "@/lib/domain/position";
import {
  getInjuryStatusLabel,
  getMembershipStatusLabel,
  getPreferredFootLabel,
  INJURY_STATUSES,
  MEMBERSHIP_STATUSES,
  PREFERRED_FEET,
  type InjuryStatus,
  type MembershipStatus,
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
      <legend className="text-sm font-medium">{legend}</legend>
      <p className="mt-1 text-xs text-muted">{hint}</p>
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
                    ? "border-accent bg-accent/15 text-accent"
                    : "border-border-strong text-muted hover:border-border hover:text-foreground"
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
                className="flex items-center gap-2 rounded-lg border border-border px-2 py-1 text-sm"
              >
                <span className="w-4 text-muted">{i + 1}.</span>
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
                  className="text-muted transition hover:text-foreground disabled:opacity-30"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => onMove(i, 1)}
                  disabled={i === selected.length - 1}
                  aria-label={formatMoveDown(locale, code)}
                  className="text-muted transition hover:text-foreground disabled:opacity-30"
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => onToggle(p)}
                  aria-label={formatRemoveCode(locale, code)}
                  className="text-muted transition hover:text-danger"
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
  const [membershipStatus, setMembershipStatus] = useState<MembershipStatus>(
    initial?.membershipStatus ?? "regular"
  );
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
        membershipStatus,
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
      className="rounded-2xl border border-border bg-surface p-5"
    >
      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium">{t("form.nameLabel")}</span>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="rounded-lg border border-border-strong bg-background px-3 py-2 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/30"
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

      <fieldset className="mt-4">
        <legend className="text-sm font-medium">{t("form.membershipLegend")}</legend>
        <p className="mt-1 text-xs text-muted">{t("form.membershipHint")}</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {MEMBERSHIP_STATUSES.map((status) => {
            const active = membershipStatus === status;
            return (
              <button
                key={status}
                type="button"
                onClick={() => setMembershipStatus(status)}
                className={`rounded-full border px-3 py-1 text-xs transition ${
                  active
                    ? "border-accent bg-accent/15 text-accent"
                    : "border-border-strong text-muted hover:border-border hover:text-foreground"
                }`}
              >
                {getMembershipStatusLabel(status, locale)}
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <fieldset>
          <legend className="text-sm font-medium">{t("form.footLegend")}</legend>
          <p className="mt-1 text-xs text-muted">{t("form.footHint")}</p>
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
                      ? "border-accent bg-accent/15 text-accent"
                      : "border-border-strong text-muted hover:border-border hover:text-foreground"
                  }`}
                >
                  {getPreferredFootLabel(foot, locale)}
                </button>
              );
            })}
          </div>
        </fieldset>

        <fieldset>
          <legend className="text-sm font-medium">{t("form.injuryLegend")}</legend>
          <p className="mt-1 text-xs text-muted">{t("form.injuryHint")}</p>
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
                      ? "border-accent bg-accent/15 text-accent"
                      : "border-border-strong text-muted hover:border-border hover:text-foreground"
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

      <label className="mt-4 flex flex-col gap-1.5 text-sm">
        <span className="font-medium">{t("form.notesLabel")}</span>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          className="rounded-lg border border-border-strong bg-background px-3 py-2 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/30"
        />
      </label>

      {error && (
        <p className="mt-3 rounded-lg border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">
          {error}
        </p>
      )}

      <div className="mt-5 flex gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-40"
        >
          {submitting ? t("form.saving") : initial ? t("form.saveChanges") : t("players.addPlayer")}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-border-strong px-4 py-2 text-sm transition hover:bg-surface-hover"
        >
          {t("form.cancel")}
        </button>
      </div>
    </form>
  );
}
