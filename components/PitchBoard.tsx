"use client";

import { useMemo, useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import type { Formation } from "@/lib/domain/formation";
import type { Player } from "@/lib/domain/player";
import { evaluateFit } from "@/lib/lineup/matching";
import DroppableSlot, { SLOT_DROP_PREFIX } from "./DroppableSlot";
import DroppableBench, { BENCH_DROP_ID } from "./DroppableBench";
import PlayerChip from "./PlayerChip";

export type SlotAssignments = Record<string, string | null>;

interface PitchBoardProps {
  formation: Formation;
  /** All players confirmed for this match — some sit in slots, the rest sit on the bench. */
  players: Player[];
  assignments: SlotAssignments;
  onAssignmentsChange: (next: SlotAssignments) => void;
}

/**
 * An interactive pitch: drag a player from a slot to another slot (swaps
 * them), from the bench onto a slot (fills it, benching whoever was there),
 * or from a slot back onto the bench (unassigns them). Works with mouse,
 * touch, and pen via dnd-kit's pointer sensor.
 */
export default function PitchBoard({
  formation,
  players,
  assignments,
  onAssignmentsChange,
}: PitchBoardProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const playersById = useMemo(() => new Map(players.map((p) => [p.id, p])), [players]);

  const assignedIds = useMemo(() => new Set(Object.values(assignments).filter(Boolean)), [
    assignments,
  ]);
  const bench = useMemo(
    () => players.filter((p) => !assignedIds.has(p.id)),
    [players, assignedIds]
  );

  const activePlayer = activeId ? playersById.get(activeId) ?? null : null;
  const activeSlot = activeId
    ? formation.slots.find((slot) => assignments[slot.id] === activeId)
    : undefined;

  function handleDragStart(event: DragStartEvent) {
    setActiveId(String(event.active.id));
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveId(null);
    const draggedId = String(event.active.id);
    const overId = event.over ? String(event.over.id) : null;
    if (!overId) return;

    const fromSlotId =
      Object.keys(assignments).find((slotId) => assignments[slotId] === draggedId) ?? null;

    if (overId === BENCH_DROP_ID) {
      if (!fromSlotId) return; // already on the bench
      onAssignmentsChange({ ...assignments, [fromSlotId]: null });
      return;
    }

    if (!overId.startsWith(SLOT_DROP_PREFIX)) return;
    const toSlotId = overId.slice(SLOT_DROP_PREFIX.length);
    if (toSlotId === fromSlotId) return;

    const displacedPlayerId = assignments[toSlotId] ?? null;
    const next: SlotAssignments = { ...assignments, [toSlotId]: draggedId };
    if (fromSlotId) {
      next[fromSlotId] = displacedPlayerId;
    }
    onAssignmentsChange(next);
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveId(null)}
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg bg-emerald-800">
        <div className="pointer-events-none absolute inset-4 rounded border border-white/30" />
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/30" />
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/60" />

        {formation.slots.map((slot) => {
          const playerId = assignments[slot.id];
          const player = playerId ? playersById.get(playerId) ?? null : null;
          return (
            <DroppableSlot
              key={slot.id}
              slotId={slot.id}
              x={slot.x}
              y={slot.y}
              position={slot.position}
              player={player}
              fit={player ? evaluateFit(player, slot.position).fit : "unfilled"}
            />
          );
        })}
      </div>

      <div className="mt-4">
        <h3 className="mb-2 text-sm font-medium">Bench</h3>
        <DroppableBench players={bench} />
      </div>

      <DragOverlay>
        {activePlayer && (
          <PlayerChip
            player={activePlayer}
            positionLabel={activeSlot ? activeSlot.position : activePlayer.primaryPosition ?? "?"}
            fit={activeSlot ? evaluateFit(activePlayer, activeSlot.position).fit : undefined}
            variant={activeSlot ? "pitch" : "bench"}
            dragging
          />
        )}
      </DragOverlay>
    </DndContext>
  );
}
