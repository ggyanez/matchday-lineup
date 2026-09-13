import type { Player } from "@/lib/domain/player";
import type { FitQuality } from "@/lib/lineup/matching";

export const FIT_STYLES: Record<FitQuality, string> = {
  primary: "bg-emerald-600 border-emerald-700 text-white",
  secondary: "bg-sky-600 border-sky-700 text-white",
  makeshift: "bg-amber-500 border-amber-600 text-white",
  unfilled: "border-dashed border-black/30 text-black/40 dark:border-white/30 dark:text-white/40",
};

interface PlayerChipProps {
  player: Player;
  /** Only meaningful for the "pitch" variant — bench players aren't fit against any slot. */
  fit?: FitQuality;
  positionLabel: string;
  /** "pitch" is a compact circle for the pitch diagram; "bench" is a wider pill. */
  variant?: "pitch" | "bench";
  dragging?: boolean;
}

/**
 * Purely presentational — the draggable behavior is layered on by whatever
 * wraps this (see DraggablePlayer), so the same visuals can also be reused
 * as the DragOverlay preview, which must not itself be draggable.
 */
export default function PlayerChip({
  player,
  fit,
  positionLabel,
  variant = "pitch",
  dragging = false,
}: PlayerChipProps) {
  if (variant === "bench") {
    return (
      <div
        className={`flex items-center gap-2 rounded-full border border-black/15 bg-white px-3 py-1.5 text-xs font-medium text-black/80 shadow-sm dark:border-white/15 dark:bg-white/10 dark:text-white/80 ${dragging ? "shadow-lg" : ""}`}
      >
        <span className="max-w-28 truncate">{player.name}</span>
        <span className="opacity-60">{positionLabel}</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-full border-2 text-xs font-semibold shadow-sm ${FIT_STYLES[fit ?? "unfilled"]} ${dragging ? "shadow-lg" : ""}`}
      >
        {positionLabel}
      </div>
      <span className="max-w-20 truncate text-center text-[11px] font-medium text-white drop-shadow">
        {player.name.split(" ")[0]}
      </span>
    </div>
  );
}
