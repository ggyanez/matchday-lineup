import { INJURY_STATUS_LABELS, type InjuryStatus } from "@/lib/domain/player";

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
  if (status === "healthy") return null;
  return (
    <span
      className={`${INJURY_COLOR[status]} ${className}`}
      title={INJURY_STATUS_LABELS[status]}
      aria-label={INJURY_STATUS_LABELS[status]}
    >
      ✚
    </span>
  );
}
