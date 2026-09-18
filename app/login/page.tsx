"use client";

import { useState } from "react";
import { loginRequest } from "@/lib/api-client";
import { useLocale } from "@/lib/i18n/LocaleContext";

export default function LoginPage() {
  const { t } = useLocale();
  const [team, setTeam] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await loginRequest(team, username, password);
      // A hard navigation (not router.push) so the root layout's
      // server-side getSession() actually re-runs against the freshly-set
      // cookie — a client-side push reuses the already-rendered layout
      // instead of re-fetching it.
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination -- intentional, see above
      window.location.href = "/";
    } catch {
      setError(t("login.error"));
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto flex max-w-sm flex-col px-6 py-16">
      <h1 className="text-2xl font-semibold tracking-tight">{t("login.heading")}</h1>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm">
          {t("login.teamLabel")}
          <input
            value={team}
            onChange={(e) => setTeam(e.target.value)}
            className="rounded border border-black/20 bg-transparent px-3 py-2 dark:border-white/20"
            autoCapitalize="none"
            autoComplete="organization"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          {t("login.usernameLabel")}
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="rounded border border-black/20 bg-transparent px-3 py-2 dark:border-white/20"
            autoCapitalize="none"
            autoComplete="username"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          {t("login.passwordLabel")}
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded border border-black/20 bg-transparent px-3 py-2 dark:border-white/20"
            autoComplete="current-password"
          />
        </label>

        {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={submitting || !team.trim() || !username.trim() || !password}
          className="mt-2 rounded bg-black px-4 py-2 text-sm text-white disabled:opacity-50 dark:bg-white dark:text-black"
        >
          {submitting ? t("login.submitting") : t("login.submit")}
        </button>
      </form>
    </div>
  );
}
