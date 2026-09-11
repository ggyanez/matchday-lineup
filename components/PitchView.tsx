import type { SlotAssignment } from "@/lib/lineup/matching";

const FIT_STYLES: Record<SlotAssignment["fit"], string> = {
  primary: "bg-emerald-600 border-emerald-700 text-white",
  secondary: "bg-sky-600 border-sky-700 text-white",
  makeshift: "bg-amber-500 border-amber-600 text-white",
  unfilled: "border-dashed border-black/30 text-black/40 dark:border-white/30 dark:text-white/40",
};

interface PitchViewProps {
  slots: SlotAssignment[];
}

export default function PitchView({ slots }: PitchViewProps) {
  return (
    <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg bg-emerald-800">
      <div className="pointer-events-none absolute inset-4 rounded border border-white/30" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/30" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/60" />

      {slots.map((slot) => (
        <div
          key={slot.slotId}
          className="absolute -translate-x-1/2 translate-y-1/2 flex flex-col items-center gap-1"
          style={{ left: `${slot.x}%`, bottom: `${slot.y}%` }}
        >
          <div
            className={`flex h-9 w-9 items-center justify-center rounded-full border-2 text-xs font-semibold ${FIT_STYLES[slot.fit]}`}
            title={slot.player ? `${slot.player.name} — ${slot.position}` : `${slot.position} — unfilled`}
          >
            {slot.position}
          </div>
          <span className="max-w-20 truncate text-center text-[11px] font-medium text-white drop-shadow">
            {slot.player ? slot.player.name.split(" ")[0] : "—"}
          </span>
        </div>
      ))}
    </div>
  );
}
