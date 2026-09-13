"use client";

import { useState } from "react";
import { POSITIONS, POSITION_LABELS, type Position } from "@/lib/domain/position";
import {
  INJURY_STATUSES,
  INJURY_STATUS_LABELS,
  PREFERRED_FEET,
  PREFERRED_FOOT_LABELS,
  type InjuryStatus,
  type Player,
  type PlayerInput,
  type PreferredFoot,
} from "@/lib/domain/player";
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
                {p}
              </button>
            </PositionTooltip>
          );
        })}
      </div>

      {selected.length > 0 && (
        <ol className="mt-3 flex flex-col gap-1">
          {selected.map((p, i) => (
            <li
              key={p}
              className="flex items-center gap-2 rounded border border-black/10 px-2 py-1 text-sm dark:border-white/10"
            >
              <span className="w-4 text-black/40 dark:text-white/40">{i + 1}.</span>
              <PositionTooltip position={p} className="flex-1 cursor-help">
                <span>
                  {p} — {POSITION_LABELS[p]}
                </span>
              </PositionTooltip>
              <button
                type="button"
                onClick={() => onMove(i, -1)}
                disabled={i === 0}
                aria-label={`Move ${p} up`}
                className="disabled:opacity-30"
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => onMove(i, 1)}
                disabled={i === selected.length - 1}
                aria-label={`Move ${p} down`}
                className="disabled:opacity-30"
              >
                ↓
              </button>
              <button
                type="button"
                onClick={() => onToggle(p)}
                aria-label={`Remove ${p}`}
                className="text-black/50 hover:text-red-600 dark:text-white/50 dark:hover:text-red-400"
              >
                ✕
              </button>
            </li>
          ))}
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
      setError("Name is required.");
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
      setError("Something went wrong saving this player. Please try again.");
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
        Name
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="rounded border border-black/20 bg-transparent px-3 py-2 dark:border-white/20"
          placeholder="e.g. Diego Gómez"
        />
      </label>

      <PositionOrderPicker
        legend="Primary positions (leave empty if not set yet)"
        hint="Tap to add. A player can be equally good in more than one position — order still
          gives the first one a slight edge, so list the strongest first."
        selected={primaryPositions}
        excluded={secondaryPositions}
        onToggle={togglePrimary}
        onMove={(i, dir) => setPrimaryPositions((current) => moveInList(current, i, dir))}
      />

      <PositionOrderPicker
        legend="Secondary positions (can also cover)"
        hint="Tap to add. Order matters — the matching algorithm treats the first one as
          a better fit than the last, so list them from strongest to weakest."
        selected={secondaryPositions}
        excluded={primaryPositions}
        onToggle={toggleSecondary}
        onMove={(i, dir) => setSecondaryPositions((current) => moveInList(current, i, dir))}
      />

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <fieldset>
          <legend className="text-sm">Preferred foot</legend>
          <p className="mt-1 text-xs text-black/50 dark:text-white/50">
            Used to prefer the more strongly-sided slot among interchangeable ones (e.g. a
            left-sided center back among three).
          </p>
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
                  {PREFERRED_FOOT_LABELS[foot]}
                </button>
              );
            })}
          </div>
        </fieldset>

        <fieldset>
          <legend className="text-sm">Injury status</legend>
          <p className="mt-1 text-xs text-black/50 dark:text-white/50">
            An injured player can still be confirmed for a match, but the recommendation
            treats them as a last resort.
          </p>
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
                  {INJURY_STATUS_LABELS[status]}
                </button>
              );
            })}
          </div>
        </fieldset>
      </div>

      <label className="mt-4 flex flex-col gap-1 text-sm">
        Notes (optional)
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
          {submitting ? "Saving..." : initial ? "Save changes" : "Add player"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded border border-black/20 px-4 py-2 text-sm dark:border-white/20"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
