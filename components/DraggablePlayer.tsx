"use client";

import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import type { Player } from "@/lib/domain/player";
import type { Position } from "@/lib/domain/position";
import PlayerChip from "./PlayerChip";

interface DraggablePlayerProps {
  player: Player;
  position?: Position;
  positionLabel: string;
  variant?: "pitch" | "bench";
  /**
   * Fires on a plain click (not a drag) — dnd-kit only starts an actual
   * drag past a small movement threshold, so a tap/click still reaches
   * this normally. Used on the pitch to open the slot's position picker.
   */
  onClick?: (e: React.MouseEvent) => void;
}

/** A player chip that can be picked up and dropped onto a slot or the bench. */
export default function DraggablePlayer({
  player,
  position,
  positionLabel,
  variant = "pitch",
  onClick,
}: DraggablePlayerProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: player.id,
  });

  return (
    <button
      type="button"
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      onClick={onClick}
      style={{ transform: CSS.Translate.toString(transform), touchAction: "none" }}
      className={`cursor-grab touch-none appearance-none border-none bg-transparent p-0 active:cursor-grabbing ${
        isDragging ? "opacity-30" : ""
      }`}
      aria-label={`Drag ${player.name}`}
    >
      <PlayerChip player={player} position={position} positionLabel={positionLabel} variant={variant} />
    </button>
  );
}
