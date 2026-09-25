"use client";

import Link from "next/link";
import { useLocale } from "@/lib/i18n/LocaleContext";

export default function HomePage() {
  const { t } = useLocale();
  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">Matchday Lineup</h1>
      <p className="mt-4 max-w-2xl text-muted">{t("home.subtitle")}</p>

      {/* The Lineup is the app's core feature — Players and Formations are
          just the supporting record-keeping — so it gets a bigger, more
          prominent card of its own, ahead of the other two. */}
      <div className="mt-10 flex flex-col gap-4">
        <Link
          href="/lineup"
          className="rounded-2xl border-2 border-accent bg-accent/10 p-8 transition hover:bg-accent/15"
        >
          <h2 className="text-xl font-semibold text-accent">{t("home.cardMatchday.title")}</h2>
          <p className="mt-2 max-w-2xl text-sm text-foreground/80">
            {t("home.cardMatchday.description")}
          </p>
        </Link>

        <div className="grid gap-4 sm:grid-cols-2">
          <Link
            href="/players"
            className="rounded-2xl border border-border bg-surface p-6 transition hover:border-border-strong hover:bg-surface-hover"
          >
            <h2 className="font-medium">{t("home.cardPlayers.title")}</h2>
            <p className="mt-2 text-sm text-muted">{t("home.cardPlayers.description")}</p>
          </Link>

          <Link
            href="/formations"
            className="rounded-2xl border border-border bg-surface p-6 transition hover:border-border-strong hover:bg-surface-hover"
          >
            <h2 className="font-medium">{t("home.cardFormations.title")}</h2>
            <p className="mt-2 text-sm text-muted">{t("home.cardFormations.description")}</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
