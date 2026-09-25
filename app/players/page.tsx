"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import PlayerForm from "@/components/PlayerForm";
import PositionTooltip from "@/components/PositionTooltip";
import InjuryBadge from "@/components/InjuryBadge";
import { getMembershipStatusLabel, getPreferredFootLabel, type Player, type PlayerInput } from "@/lib/domain/player";
import { getPositionCode, POSITION_GROUP, POSITIONS, type Position, type PositionGroup } from "@/lib/domain/position";
import { useLocale } from "@/lib/i18n/LocaleContext";
import { formatRemoveConfirm } from "@/lib/i18n/translations";
import {
  createPlayerRequest,
  deletePlayerRequest,
  fetchPlayers,
  updatePlayerRequest,
} from "@/lib/api-client";
import { useRefetchOnFocus } from "@/lib/use-refetch-on-focus";

/** Renders a "ARQ/DFC"-style list where each code has its own hover tooltip. */
function PositionBadgeList({ positions, locale }: { positions: Position[]; locale: "es" | "en" }) {
  return (
    <>
      {positions.map((position, i) => (
        <span key={position}>
          <PositionTooltip position={position}>
            <span className="cursor-help underline decoration-dotted decoration-muted underline-offset-2">
              {getPositionCode(position, locale)}
            </span>
          </PositionTooltip>
          {i < positions.length - 1 && "/"}
        </span>
      ))}
    </>
  );
}

type SortMode = "name" | "position";

/** Index of a player's first-listed primary position in the canonical
 * field order (goalkeeper, then defense, midfield, attack) — players
 * with no primary position sort to the end. */
function positionSortKey(player: Player): number {
  const primary = player.primaryPositions[0];
  const index = primary ? POSITIONS.indexOf(primary) : -1;
  return index === -1 ? POSITIONS.length : index;
}

/** A player's overall "line", based on their first-listed primary
 * position — the same rule used for sorting and for grouping on the
 * Match Day page, so a player filed under "defense" here is the same
 * one you'd see under "Defenders" there. */
function positionGroupOf(player: Player): PositionGroup | "none" {
  const primary = player.primaryPositions[0];
  return primary ? POSITION_GROUP[primary] : "none";
}

type MembershipFilter = "all" | "regular" | "guest";
type HealthFilter = "all" | "healthy" | "injured";
type PositionFilter = "all" | PositionGroup | "none";

export default function PlayersPage() {
  const { locale, t } = useLocale();
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Player | null>(null);
  const [sortMode, setSortMode] = useState<SortMode>("name");
  const [membershipFilter, setMembershipFilter] = useState<MembershipFilter>("all");
  const [healthFilter, setHealthFilter] = useState<HealthFilter>("all");
  const [positionFilter, setPositionFilter] = useState<PositionFilter>("all");
  const formRef = useRef<HTMLDivElement>(null);

  const filtersActive =
    membershipFilter !== "all" || healthFilter !== "all" || positionFilter !== "all";

  function resetFilters() {
    setMembershipFilter("all");
    setHealthFilter("all");
    setPositionFilter("all");
  }

  // The three filters are independent facets, combined with AND — e.g.
  // "Solo Invitados" plus "Solo Defensores" together shows only guest
  // defenders. Clicking an already-active chip clears just that facet.
  const filteredPlayers = useMemo(() => {
    return players.filter((player) => {
      if (membershipFilter !== "all" && player.membershipStatus !== membershipFilter) return false;
      if (healthFilter === "healthy" && player.injuryStatus !== "healthy") return false;
      if (healthFilter === "injured" && player.injuryStatus === "healthy") return false;
      if (positionFilter !== "all" && positionGroupOf(player) !== positionFilter) return false;
      return true;
    });
  }, [players, membershipFilter, healthFilter, positionFilter]);

  // The server already returns players sorted by name, but the sort mode
  // is purely a display concern — position order is computed here so
  // switching it doesn't need a round-trip.
  const sortedPlayers = useMemo(() => {
    if (sortMode === "name") return filteredPlayers;
    return [...filteredPlayers].sort((a, b) => {
      const byPosition = positionSortKey(a) - positionSortKey(b);
      return byPosition !== 0 ? byPosition : a.name.localeCompare(b.name);
    });
  }, [filteredPlayers, sortMode]);

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
    if (!confirm(formatRemoveConfirm(locale, player.name))) return;
    await deletePlayerRequest(player.id);
    await load();
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">{t("players.heading")}</h1>
        {!showForm && !editing && (
          <button
            onClick={() => setShowForm(true)}
            className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground transition hover:bg-accent-hover"
          >
            {t("players.addPlayer")}
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

      {!loading && players.length > 0 && (
        <div className="mt-6 flex items-center gap-2 text-sm text-muted">
          {t("players.sortBy")}
          {(["name", "position"] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setSortMode(mode)}
              aria-pressed={sortMode === mode}
              className={`rounded-full border px-3 py-1 text-xs transition ${
                sortMode === mode
                  ? "border-accent bg-accent/15 text-accent"
                  : "border-border-strong text-muted hover:border-border hover:text-foreground"
              }`}
            >
              {mode === "name" ? t("players.sortByName") : t("players.sortByPosition")}
            </button>
          ))}
        </div>
      )}

      {!loading && players.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-muted">
          {t("players.filterBy")}
          <button
            type="button"
            onClick={resetFilters}
            aria-pressed={!filtersActive}
            className={`rounded-full border px-3 py-1 text-xs transition ${
              !filtersActive
                ? "border-accent bg-accent/15 text-accent"
                : "border-border-strong text-muted hover:border-border hover:text-foreground"
            }`}
          >
            {t("players.filterAll")}
          </button>
          {(
            [
              { value: "regular", label: t("players.filterRegularOnly"), active: membershipFilter === "regular", onClick: () => setMembershipFilter((c) => (c === "regular" ? "all" : "regular")) },
              { value: "guest", label: t("players.filterGuestOnly"), active: membershipFilter === "guest", onClick: () => setMembershipFilter((c) => (c === "guest" ? "all" : "guest")) },
              { value: "healthy", label: t("players.filterHealthyOnly"), active: healthFilter === "healthy", onClick: () => setHealthFilter((c) => (c === "healthy" ? "all" : "healthy")) },
              { value: "injured", label: t("players.filterInjuredOnly"), active: healthFilter === "injured", onClick: () => setHealthFilter((c) => (c === "injured" ? "all" : "injured")) },
              { value: "goalkeeper", label: t("players.filterGoalkeepersOnly"), active: positionFilter === "goalkeeper", onClick: () => setPositionFilter((c) => (c === "goalkeeper" ? "all" : "goalkeeper")) },
              { value: "defense", label: t("players.filterDefendersOnly"), active: positionFilter === "defense", onClick: () => setPositionFilter((c) => (c === "defense" ? "all" : "defense")) },
              { value: "midfield", label: t("players.filterMidfieldersOnly"), active: positionFilter === "midfield", onClick: () => setPositionFilter((c) => (c === "midfield" ? "all" : "midfield")) },
              { value: "attack", label: t("players.filterForwardsOnly"), active: positionFilter === "attack", onClick: () => setPositionFilter((c) => (c === "attack" ? "all" : "attack")) },
              { value: "none", label: t("players.filterNoPositionOnly"), active: positionFilter === "none", onClick: () => setPositionFilter((c) => (c === "none" ? "all" : "none")) },
            ] as const
          ).map((chip) => (
            <button
              key={chip.value}
              type="button"
              onClick={chip.onClick}
              aria-pressed={chip.active}
              className={`rounded-full border px-3 py-1 text-xs transition ${
                chip.active
                  ? "border-accent bg-accent/15 text-accent"
                  : "border-border-strong text-muted hover:border-border hover:text-foreground"
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>
      )}

      <div className="mt-8">
        {loading ? (
          <p className="text-sm text-muted">{t("players.loading")}</p>
        ) : players.length === 0 ? (
          <p className="text-sm text-muted">{t("players.empty")}</p>
        ) : sortedPlayers.length === 0 ? (
          <p className="text-sm text-muted">{t("players.filteredEmpty")}</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {sortedPlayers.map((player) => (
              <li
                key={player.id}
                className="flex items-center justify-between rounded-xl border border-border bg-surface px-4 py-3"
              >
                <div>
                  <p className="flex items-center gap-1.5 font-medium">
                    {player.name}
                    <InjuryBadge status={player.injuryStatus} />
                    {player.membershipStatus === "guest" && (
                      <span className="rounded-full border border-amber-500/40 px-1.5 py-0.5 text-[10px] font-medium text-amber-400">
                        {getMembershipStatusLabel("guest", locale)}
                      </span>
                    )}
                  </p>
                  <p className="text-sm text-muted">
                    {player.primaryPositions.length > 0 ? (
                      <PositionBadgeList positions={player.primaryPositions} locale={locale} />
                    ) : (
                      <span className="italic text-amber-400">{t("players.noPositionSet")}</span>
                    )}
                    {player.secondaryPositions.length > 0 && (
                      <>
                        {t("players.alsoLabel")}
                        <PositionBadgeList positions={player.secondaryPositions} locale={locale} />
                      </>
                    )}
                    {player.preferredFoot && ` · ${getPreferredFootLabel(player.preferredFoot, locale)}`}
                  </p>
                </div>
                <div className="flex gap-3 text-sm">
                  <button
                    onClick={() => {
                      setShowForm(false);
                      setEditing(player);
                    }}
                    className="text-muted transition hover:text-foreground"
                  >
                    {t("players.edit")}
                  </button>
                  <button
                    onClick={() => handleDelete(player)}
                    className="text-danger transition hover:text-red-400"
                  >
                    {t("players.remove")}
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
