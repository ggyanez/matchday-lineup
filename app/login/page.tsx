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
    <div className="flex flex-1 items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/15 text-2xl">
            ⚽
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">{t("login.heading")}</h1>
          <p className="mt-1.5 text-sm text-muted">{t("login.subtitle")}</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-6 shadow-lg shadow-black/20"
        >
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-foreground/90">{t("login.teamLabel")}</span>
            <input
              value={team}
              onChange={(e) => setTeam(e.target.value)}
              className="rounded-lg border border-border-strong bg-background px-3.5 py-2.5 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/30"
              autoCapitalize="none"
              autoComplete="organization"
            />
          </label>

          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-foreground/90">{t("login.usernameLabel")}</span>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="rounded-lg border border-border-strong bg-background px-3.5 py-2.5 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/30"
              autoCapitalize="none"
              autoComplete="username"
            />
          </label>

          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-foreground/90">{t("login.passwordLabel")}</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-lg border border-border-strong bg-background px-3.5 py-2.5 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/30"
              autoComplete="current-password"
            />
          </label>

          {error && (
            <p className="rounded-lg border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting || !team.trim() || !username.trim() || !password}
            className="mt-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-accent-foreground transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-40"
          >
            {submitting ? t("login.submitting") : t("login.submit")}
          </button>
        </form>
      </div>
    </div>
  );
}
