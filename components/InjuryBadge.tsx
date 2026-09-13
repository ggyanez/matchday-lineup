"use client";

import { getInjuryStatusLabel, type InjuryStatus } from "@/lib/domain/player";
import { useLocale } from "@/lib/i18n/LocaleContext";

const INJURY_COLOR: Record<Exclude<InjuryStatus, "healthy">, string> = {
  minor: "text-yellow-500",
  major: "text-red-600",
};

interface InjuryBadgeProps {
  status: InjuryStatus;
  className?: string;
}

/**
 * A small medical-cross icon, PES-style — yellow for a knock the player is
 * carrying but can still turn out for, red for a serious injury. Renders
 * nothing at all when healthy, so it's safe to drop next to any player
 * name unconditionally.
 */
export default function InjuryBadge({ status, className = "" }: InjuryBadgeProps) {
  const { locale } = useLocale();
  if (status === "healthy") return null;
  const label = getInjuryStatusLabel(status, locale);
  return (
    <span className={`${INJURY_COLOR[status]} ${className}`} title={label} aria-label={label}>
      ✚
    </span>
  );
}
