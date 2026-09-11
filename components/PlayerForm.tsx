"use client";

import { useState } from "react";
import { POSITIONS, POSITION_LABELS, type Position } from "@/lib/domain/position";
import type { Player, PlayerInput } from "@/lib/domain/player";

interface PlayerFormProps {
  initial?: Player | null;
  onSubmit: (input: PlayerInput) => Promise<void>;
  onCancel: () => void;
}

export default function PlayerForm({ initial, onSubmit, onCancel }: PlayerFormProps) {
  const [name, setName] = useState(initial?.name ?? "");
  const [primaryPosition, setPrimaryPosition] = useState<Position>(
    initial?.primaryPosition ?? "MC"
  );
  const [secondaryPositions, setSecondaryPositions] = useState<Position[]>(
    initial?.secondaryPositions ?? []
  );
  const [notes, setNotes] = useState(initial?.notes ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function toggleSecondary(position: Position) {
    setSecondaryPositions((current) =>
      current.includes(position)
        ? current.filter((p) => p !== position)
        : [...current, position]
    );
  }

  function moveSecondary(index: number, direction: -1 | 1) {
    setSecondaryPositions((current) => {
      const target = index + direction;
      if (target < 0 || target >= current.length) return current;
      const next = [...current];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
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
        primaryPosition,
        secondaryPositions: secondaryPositions.filter((p) => p !== primaryPosition),
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
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm">
          Name
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded border border-black/20 bg-transparent px-3 py-2 dark:border-white/20"
            placeholder="e.g. Diego Gómez"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          Primary position
          <select
            value={primaryPosition}
            onChange={(e) => setPrimaryPosition(e.target.value as Position)}
            className="rounded border border-black/20 bg-transparent px-3 py-2 dark:border-white/20"
          >
            {POSITIONS.map((p) => (
              <option key={p} value={p}>
                {p} — {POSITION_LABELS[p]}
              </option>
            ))}
          </select>
        </label>
      </div>

      <fieldset className="mt-4">
        <legend className="text-sm">Secondary positions (can also cover)</legend>
        <p className="mt-1 text-xs text-black/50 dark:text-white/50">
          Tap to add. Order matters — the matching algorithm treats the first one as
          a better fit than the last, so list them from strongest to weakest.
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {POSITIONS.filter((p) => p !== primaryPosition).map((p) => {
            const active = secondaryPositions.includes(p);
            return (
              <button
                key={p}
                type="button"
                onClick={() => toggleSecondary(p)}
                className={`rounded-full border px-3 py-1 text-xs transition ${
                  active
                    ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black"
                    : "border-black/20 text-black/70 dark:border-white/20 dark:text-white/70"
                }`}
              >
                {p}
              </button>
            );
          })}
        </div>

        {secondaryPositions.length > 0 && (
          <ol className="mt-3 flex flex-col gap-1">
            {secondaryPositions.map((p, i) => (
              <li
                key={p}
                className="flex items-center gap-2 rounded border border-black/10 px-2 py-1 text-sm dark:border-white/10"
              >
                <span className="w-4 text-black/40 dark:text-white/40">{i + 1}.</span>
                <span className="flex-1">
                  {p} — {POSITION_LABELS[p]}
                </span>
                <button
                  type="button"
                  onClick={() => moveSecondary(i, -1)}
                  disabled={i === 0}
                  aria-label={`Move ${p} up`}
                  className="disabled:opacity-30"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => moveSecondary(i, 1)}
                  disabled={i === secondaryPositions.length - 1}
                  aria-label={`Move ${p} down`}
                  className="disabled:opacity-30"
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => toggleSecondary(p)}
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
