import { POSITION_DESCRIPTIONS, POSITION_LABELS, type Position } from "@/lib/domain/position";

interface PositionTooltipProps {
  position: Position;
  children: React.ReactNode;
  /** Merged onto the wrapping span — pass e.g. "flex-1" when the trigger needs to fill space. */
  className?: string;
}

/**
 * Wraps a position code (a pill, a letter badge, plain text — whatever's
 * passed as children) with a hover tooltip showing its full name and a
 * one-sentence explanation. Pure CSS (`group`/`group-hover`) — no JS state,
 * no library.
 */
export default function PositionTooltip({ position, children, className }: PositionTooltipProps) {
  return (
    <span className={`group relative inline-flex ${className ?? ""}`}>
      {children}
      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 w-56 -translate-x-1/2 rounded-md bg-black px-2.5 py-1.5 text-xs opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100 dark:bg-white"
      >
        <strong className="block text-white dark:text-black">
          {position} — {POSITION_LABELS[position]}
        </strong>
        <span className="mt-0.5 block text-white/70 dark:text-black/70">
          {POSITION_DESCRIPTIONS[position]}
        </span>
      </span>
    </span>
  );
}
