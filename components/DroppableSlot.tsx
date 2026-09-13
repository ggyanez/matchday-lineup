"use client";

import { useDroppable } from "@dnd-kit/core";
import type { Player } from "@/lib/domain/player";
import type { FitQuality } from "@/lib/lineup/matching";
import DraggablePlayer from "./DraggablePlayer";

export const SLOT_DROP_PREFIX = "slot:";

interface DroppableSlotProps {
  slotId: string;
  x: number;
  y: number;
  position: string;
  player: Player | null;
  fit: FitQuality;
}

export default function DroppableSlot({ slotId, x, y, position, player, fit }: DroppableSlotProps) {
  const { setNodeRef, isOver } = useDroppable({ id: `${SLOT_DROP_PREFIX}${slotId}` });

  return (
    <div
      ref={setNodeRef}
      className={`absolute -translate-x-1/2 translate-y-1/2 rounded-full transition ${
        isOver ? "ring-4 ring-white/70" : ""
      }`}
      style={{ left: `${x}%`, bottom: `${y}%` }}
    >
      {player ? (
        <DraggablePlayer player={player} fit={fit} positionLabel={position} variant="pitch" />
      ) : (
        <div className="flex flex-col items-center gap-1">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-dashed border-white/50 text-xs font-semibold text-white/60">
            {position}
          </div>
          <span className="text-[11px] text-white/40">—</span>
        </div>
      )}
    </div>
  );
}
