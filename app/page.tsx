"use client";

import Link from "next/link";
import { useLocale } from "@/lib/i18n/LocaleContext";

export default function HomePage() {
  const { t } = useLocale();
  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">Matchday Lineup</h1>
      <p className="mt-4 max-w-2xl text-black/70 dark:text-white/70">{t("home.subtitle")}</p>

      {/* The Lineup is the app's core feature — Players and Formations are
          just the supporting record-keeping — so it gets a bigger, more
          prominent card of its own, ahead of the other two. */}
      <div className="mt-10 flex flex-col gap-4">
        <Link
          href="/lineup"
          className="rounded-lg border-2 border-black bg-black p-8 text-white transition hover:opacity-90 dark:border-white dark:bg-white dark:text-black"
        >
          <h2 className="text-xl font-semibold">{t("home.cardMatchday.title")}</h2>
          <p className="mt-2 max-w-2xl text-sm text-white/70 dark:text-black/70">
            {t("home.cardMatchday.description")}
          </p>
        </Link>

        <div className="grid gap-4 sm:grid-cols-2">
          <Link
            href="/players"
            className="rounded-lg border border-black/10 p-6 transition hover:border-black/30 dark:border-white/10 dark:hover:border-white/30"
          >
            <h2 className="font-medium">{t("home.cardPlayers.title")}</h2>
            <p className="mt-2 text-sm text-black/60 dark:text-white/60">
              {t("home.cardPlayers.description")}
            </p>
          </Link>

          <Link
            href="/formations"
            className="rounded-lg border border-black/10 p-6 transition hover:border-black/30 dark:border-white/10 dark:hover:border-white/30"
          >
            <h2 className="font-medium">{t("home.cardFormations.title")}</h2>
            <p className="mt-2 text-sm text-black/60 dark:text-white/60">
              {t("home.cardFormations.description")}
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
