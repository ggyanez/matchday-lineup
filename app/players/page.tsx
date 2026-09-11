"use client";

import { useEffect, useState } from "react";
import PlayerForm from "@/components/PlayerForm";
import type { Player, PlayerInput } from "@/lib/domain/player";
import {
  createPlayerRequest,
  deletePlayerRequest,
  fetchPlayers,
  updatePlayerRequest,
} from "@/lib/api-client";

export default function PlayersPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Player | null>(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    const { players } = await fetchPlayers();
    setPlayers(players);
    setLoading(false);
  }

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
        <div className="mt-6">
          <PlayerForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} />
        </div>
      )}

      {editing && (
        <div className="mt-6">
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
                    {player.primaryPosition}
                    {player.secondaryPositions.length > 0 &&
                      ` · also: ${player.secondaryPositions.join(", ")}`}
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
