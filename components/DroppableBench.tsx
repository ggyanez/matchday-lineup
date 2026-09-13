"use client";

import { useDroppable } from "@dnd-kit/core";
import { primaryPositionLabel, type Player } from "@/lib/domain/player";
import { useLocale } from "@/lib/i18n/LocaleContext";
import DraggablePlayer from "./DraggablePlayer";

export const BENCH_DROP_ID = "bench";

interface DroppableBenchProps {
  players: Player[];
}

/** Drop a player here to unassign them from the pitch. */
export default function DroppableBench({ players }: DroppableBenchProps) {
  const { setNodeRef, isOver } = useDroppable({ id: BENCH_DROP_ID });
  const { locale, t } = useLocale();

  return (
    <div
      ref={setNodeRef}
      className={`min-h-16 rounded-lg border-2 border-dashed p-3 transition ${
        isOver
          ? "border-black/40 bg-black/5 dark:border-white/40 dark:bg-white/10"
          : "border-black/15 dark:border-white/15"
      }`}
    >
      {players.length === 0 ? (
        <p className="text-sm text-black/40 dark:text-white/40">{t("matchday.benchEmpty")}</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {players.map((player) => (
            <DraggablePlayer
              key={player.id}
              player={player}
              positionLabel={primaryPositionLabel(player, locale) || "?"}
              variant="bench"
            />
          ))}
        </div>
      )}
    </div>
  );
}
