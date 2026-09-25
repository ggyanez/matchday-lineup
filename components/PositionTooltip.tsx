"use client";

import { getPositionCode, getPositionDescription, getPositionName, type Position } from "@/lib/domain/position";
import { useLocale } from "@/lib/i18n/LocaleContext";

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
  const { locale } = useLocale();
  return (
    <span className={`group relative inline-flex ${className ?? ""}`}>
      {children}
      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 w-56 -translate-x-1/2 rounded-lg border border-border-strong bg-surface px-2.5 py-1.5 text-xs opacity-0 shadow-lg shadow-black/30 transition-opacity duration-150 group-hover:opacity-100"
      >
        <strong className="block text-foreground">
          {getPositionCode(position, locale)} — {getPositionName(position, locale)}
        </strong>
        <span className="mt-0.5 block text-muted">
          {getPositionDescription(position, locale)}
        </span>
      </span>
    </span>
  );
}
