"use client";

import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import type { Player } from "@/lib/domain/player";
import PlayerChip from "./PlayerChip";

interface DraggablePlayerProps {
  player: Player;
  positionLabel: string;
  variant?: "pitch" | "bench";
}

/** A player chip that can be picked up and dropped onto a slot or the bench. */
export default function DraggablePlayer({
  player,
  positionLabel,
  variant = "pitch",
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
      style={{ transform: CSS.Translate.toString(transform), touchAction: "none" }}
      className={`cursor-grab touch-none appearance-none border-none bg-transparent p-0 active:cursor-grabbing ${
        isDragging ? "opacity-30" : ""
      }`}
      aria-label={`Drag ${player.name}`}
    >
      <PlayerChip player={player} positionLabel={positionLabel} variant={variant} />
    </button>
  );
}
