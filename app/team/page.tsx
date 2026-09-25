"use client";

import { useCallback, useEffect, useState } from "react";
import { addTeamMemberRequest, fetchTeamMembers, type TeamMember } from "@/lib/api-client";
import { useLocale } from "@/lib/i18n/LocaleContext";
import { useRefetchOnFocus } from "@/lib/use-refetch-on-focus";

export default function TeamPage() {
  const { t } = useLocale();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { members } = await fetchTeamMembers();
    setMembers(members);
    setLoading(false);
  }, []);

  /* eslint-disable react-hooks/set-state-in-effect -- intentional: fetching on mount */
  useEffect(() => {
    load();
  }, [load]);
  /* eslint-enable react-hooks/set-state-in-effect */

  useRefetchOnFocus(load);

  async function handleAddMember(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await addTeamMemberRequest(username, password);
      setUsername("");
      setPassword("");
      setShowForm(false);
      await load();
    } catch {
      setError(t("team.addMemberError"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="text-2xl font-semibold tracking-tight">{t("team.heading")}</h1>
      <p className="mt-2 text-sm text-muted">{t("team.subtitle")}</p>

      <div className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium">{t("team.membersHeading")}</h2>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="rounded-lg bg-accent px-3 py-1.5 text-xs font-semibold text-accent-foreground transition hover:bg-accent-hover"
            >
              {t("team.addMember")}
            </button>
          )}
        </div>

        {loading ? (
          <p className="mt-3 text-sm text-muted">{t("team.loading")}</p>
        ) : (
          <ul className="mt-3 flex flex-col gap-2">
            {members.map((member) => (
              <li
                key={member.username}
                className="rounded-xl border border-border bg-surface px-4 py-2.5 text-sm"
              >
                {member.username}
              </li>
            ))}
          </ul>
        )}

        {showForm && (
          <form
            onSubmit={handleAddMember}
            className="mt-4 flex flex-col gap-3 rounded-2xl border border-border bg-surface p-4"
          >
            <label className="flex flex-col gap-1.5 text-sm">
              <span className="font-medium">{t("team.addMemberUsernameLabel")}</span>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="rounded-lg border border-border-strong bg-background px-3 py-2 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/30"
                autoCapitalize="none"
              />
            </label>
            <label className="flex flex-col gap-1.5 text-sm">
              <span className="font-medium">{t("team.addMemberPasswordLabel")}</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-lg border border-border-strong bg-background px-3 py-2 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/30"
              />
            </label>

            {error && (
              <p className="rounded-lg border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">
                {error}
              </p>
            )}

            <div className="mt-1 flex gap-3">
              <button
                type="submit"
                disabled={submitting || !username.trim() || !password}
                className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-40"
              >
                {submitting ? t("team.addMemberSubmitting") : t("team.addMemberSubmit")}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setError(null);
                }}
                className="rounded-lg border border-border-strong px-4 py-2 text-sm transition hover:bg-surface-hover"
              >
                {t("team.addMemberCancel")}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
