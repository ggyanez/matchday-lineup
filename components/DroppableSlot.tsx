"use client";

import { useDroppable } from "@dnd-kit/core";
import type { Player } from "@/lib/domain/player";
import { getPositionCode, POSITION_ALTERNATIVES, type Position } from "@/lib/domain/position";
import { useLocale } from "@/lib/i18n/LocaleContext";
import DraggablePlayer from "./DraggablePlayer";

export const SLOT_DROP_PREFIX = "slot:";

interface DroppableSlotProps {
  slotId: string;
  x: number;
  y: number;
  /** The formation's own designated position for this slot — always the base for the alternatives menu, regardless of any active override. */
  basePosition: Position;
  /** Currently displayed/scored position for this slot (`basePosition`, unless overridden). */
  activePosition: Position;
  player: Player | null;
  menuOpen: boolean;
  onToggleMenu: () => void;
  /** Called with the chosen position — pass `basePosition` itself to clear the override. */
  onChoosePosition: (position: Position) => void;
}

export default function DroppableSlot({
  slotId,
  x,
  y,
  basePosition,
  activePosition,
  player,
  menuOpen,
  onToggleMenu,
  onChoosePosition,
}: DroppableSlotProps) {
  const { setNodeRef, isOver } = useDroppable({ id: `${SLOT_DROP_PREFIX}${slotId}` });
  const { locale } = useLocale();

  const options = [basePosition, ...POSITION_ALTERNATIVES[basePosition]];
  // A slot with no alternatives (goalkeeper, center back) has nothing to
  // pick between, so it isn't worth making clickable at all.
  const pickable = player != null && options.length > 1;
  // Slots in the lower half of the pitch (defenders, near the bottom of the
  // screen) open their menu upward, toward the center, so it doesn't run
  // off the edge of the pitch; the rest open downward.
  const openUpward = y < 50;

  return (
    <div
      ref={setNodeRef}
      className={`absolute -translate-x-1/2 translate-y-1/2 rounded-full transition ${
        isOver ? "ring-4 ring-white/70" : ""
      }`}
      style={{ left: `${x}%`, bottom: `${y}%` }}
    >
      {player ? (
        <DraggablePlayer
          player={player}
          position={activePosition}
          positionLabel={getPositionCode(activePosition, locale)}
          variant="pitch"
          onClick={
            pickable
              ? (e) => {
                  e.stopPropagation();
                  onToggleMenu();
                }
              : undefined
          }
        />
      ) : (
        <div className="flex flex-col items-center gap-1">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-dashed border-white/50 text-xs font-semibold text-white/60">
            {getPositionCode(activePosition, locale)}
          </div>
          <span className="text-[11px] text-white/40">—</span>
        </div>
      )}

      {menuOpen && pickable && (
        <div
          className={`absolute left-1/2 z-20 flex -translate-x-1/2 flex-col gap-1 rounded-lg border border-black/10 bg-white p-1.5 shadow-lg dark:border-white/10 dark:bg-neutral-800 ${
            openUpward ? "bottom-full mb-2" : "top-full mt-2"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => onChoosePosition(option)}
              className={`whitespace-nowrap rounded px-2.5 py-1 text-left text-xs transition ${
                option === activePosition
                  ? "bg-black text-white dark:bg-white dark:text-black"
                  : "text-black/70 hover:bg-black/5 dark:text-white/70 dark:hover:bg-white/10"
              }`}
            >
              {getPositionCode(option, locale)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
