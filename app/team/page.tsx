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
      <p className="mt-2 text-sm text-black/60 dark:text-white/60">{t("team.subtitle")}</p>

      <div className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium">{t("team.membersHeading")}</h2>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="rounded bg-black px-3 py-1.5 text-xs text-white dark:bg-white dark:text-black"
            >
              {t("team.addMember")}
            </button>
          )}
        </div>

        {loading ? (
          <p className="mt-3 text-sm text-black/60 dark:text-white/60">{t("team.loading")}</p>
        ) : (
          <ul className="mt-3 divide-y divide-black/10 dark:divide-white/10">
            {members.map((member) => (
              <li key={member.username} className="py-2 text-sm">
                {member.username}
              </li>
            ))}
          </ul>
        )}

        {showForm && (
          <form
            onSubmit={handleAddMember}
            className="mt-4 flex flex-col gap-3 rounded-lg border border-black/10 p-4 dark:border-white/10"
          >
            <label className="flex flex-col gap-1 text-sm">
              {t("team.addMemberUsernameLabel")}
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="rounded border border-black/20 bg-transparent px-3 py-2 dark:border-white/20"
                autoCapitalize="none"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              {t("team.addMemberPasswordLabel")}
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded border border-black/20 bg-transparent px-3 py-2 dark:border-white/20"
              />
            </label>

            {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

            <div className="mt-1 flex gap-3">
              <button
                type="submit"
                disabled={submitting || !username.trim() || !password}
                className="rounded bg-black px-4 py-2 text-sm text-white disabled:opacity-50 dark:bg-white dark:text-black"
              >
                {submitting ? t("team.addMemberSubmitting") : t("team.addMemberSubmit")}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setError(null);
                }}
                className="rounded border border-black/20 px-4 py-2 text-sm dark:border-white/20"
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
