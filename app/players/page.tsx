"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import PlayerForm from "@/components/PlayerForm";
import PositionTooltip from "@/components/PositionTooltip";
import type { Player, PlayerInput } from "@/lib/domain/player";
import type { Position } from "@/lib/domain/position";
import {
  createPlayerRequest,
  deletePlayerRequest,
  fetchPlayers,
  updatePlayerRequest,
} from "@/lib/api-client";
import { useRefetchOnFocus } from "@/lib/use-refetch-on-focus";

/** Renders a "ARQ/DFC"-style list where each code has its own hover tooltip. */
function PositionBadgeList({ positions }: { positions: Position[] }) {
  return (
    <>
      {positions.map((position, i) => (
        <span key={position}>
          <PositionTooltip position={position}>
            <span className="cursor-help underline decoration-dotted decoration-black/30 underline-offset-2 dark:decoration-white/30">
              {position}
            </span>
          </PositionTooltip>
          {i < positions.length - 1 && "/"}
        </span>
      ))}
    </>
  );
}

export default function PlayersPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Player | null>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { players } = await fetchPlayers();
    setPlayers(players);
    setLoading(false);
  }, []);

  /* eslint-disable react-hooks/set-state-in-effect -- intentional: fetching on mount */
  useEffect(() => {
    load();
  }, [load]);
  /* eslint-enable react-hooks/set-state-in-effect */

  // Covers Next's client Router Cache reusing this page, and the browser's
  // bfcache restoring it verbatim on back/forward — both can otherwise show
  // a player edited elsewhere with its old data.
  useRefetchOnFocus(load);

  // The form renders above the list, which can be scrolled well out of view
  // by the time you click Edit on a player further down — bring it into
  // view instead of silently opening off-screen.
  useEffect(() => {
    if (showForm || editing) {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [showForm, editing]);

  async function handleCreate(input: PlayerInput) {
    await createPlayerRequest(input);
    setShowForm(false);
    await load();
  }

  async function handleUpdate(input: PlayerInput) {
    if (!editing) return;
    await updatePlayerRequest(editing.id, input);
    setEditing(null);
    await load();
  }

  async function handleDelete(player: Player) {
    if (!confirm(`Remove ${player.name} from the squad?`)) return;
    await deletePlayerRequest(player.id);
    await load();
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Players</h1>
        {!showForm && !editing && (
          <button
            onClick={() => setShowForm(true)}
            className="rounded bg-black px-4 py-2 text-sm text-white dark:bg-white dark:text-black"
          >
            Add player
          </button>
        )}
      </div>

      {showForm && (
        <div ref={formRef} className="mt-6 scroll-mt-6">
          <PlayerForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} />
        </div>
      )}

      {editing && (
        <div ref={formRef} className="mt-6 scroll-mt-6">
          <PlayerForm
            initial={editing}
            onSubmit={handleUpdate}
            onCancel={() => setEditing(null)}
          />
        </div>
      )}

      <div className="mt-8">
        {loading ? (
          <p className="text-sm text-black/60 dark:text-white/60">Loading...</p>
        ) : players.length === 0 ? (
          <p className="text-sm text-black/60 dark:text-white/60">
            No players yet. Add your first one to get started.
          </p>
        ) : (
          <ul className="divide-y divide-black/10 dark:divide-white/10">
            {players.map((player) => (
              <li key={player.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium">{player.name}</p>
                  <p className="text-sm text-black/60 dark:text-white/60">
                    {player.primaryPositions.length > 0 ? (
                      <PositionBadgeList positions={player.primaryPositions} />
                    ) : (
                      <span className="italic text-amber-600 dark:text-amber-400">
                        No position set
                      </span>
                    )}
                    {player.secondaryPositions.length > 0 && (
                      <>
                        {" · also: "}
                        <PositionBadgeList positions={player.secondaryPositions} />
                      </>
                    )}
                  </p>
                </div>
                <div className="flex gap-3 text-sm">
                  <button
                    onClick={() => {
                      setShowForm(false);
                      setEditing(player);
                    }}
                    className="text-black/70 hover:text-black dark:text-white/70 dark:hover:text-white"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(player)}
                    className="text-red-600 hover:text-red-700 dark:text-red-400"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
