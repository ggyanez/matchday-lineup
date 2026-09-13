import type { Player } from "@/lib/domain/player";
import { POSITION_GROUP, isPosition, type PositionGroup } from "@/lib/domain/position";

/** Classic formation-editor coloring: the marker's color is the line being played, not how well-suited the player is to it. */
export const POSITION_GROUP_STYLES: Record<PositionGroup, string> = {
  goalkeeper: "bg-yellow-400 border-yellow-600 text-yellow-950",
  defense: "bg-sky-600 border-sky-700 text-white",
  midfield: "bg-emerald-600 border-emerald-700 text-white",
  attack: "bg-red-600 border-red-700 text-white",
};

const FALLBACK_STYLE = "bg-black/60 border-black/70 text-white dark:bg-white/60 dark:border-white/70";

interface PlayerChipProps {
  player: Player;
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

  // On the pitch, the marker's color is the position being played there
  // (like a formation editor's jersey colors), not a judgment of fit —
  // whether someone's out of their usual position is called out in the
  // warnings list instead.
  const style = isPosition(positionLabel) ? POSITION_GROUP_STYLES[POSITION_GROUP[positionLabel]] : FALLBACK_STYLE;

  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-full border-2 text-xs font-semibold shadow-sm ${style} ${dragging ? "shadow-lg" : ""}`}
      >
        {positionLabel}
      </div>
      <span className="max-w-20 truncate text-center text-[11px] font-medium text-white drop-shadow">
        {player.name.split(" ")[0]}
      </span>
    </div>
  );
}
