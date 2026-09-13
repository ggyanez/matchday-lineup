"use client";

import Link from "next/link";
import { useLocale } from "@/lib/i18n/LocaleContext";

export default function HomePage() {
  const { t } = useLocale();
  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">Matchday Lineup</h1>
      <p className="mt-4 max-w-2xl text-black/70 dark:text-white/70">{t("home.subtitle")}</p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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

        <Link
          href="/matchday"
          className="rounded-lg border border-black/10 p-6 transition hover:border-black/30 dark:border-white/10 dark:hover:border-white/30"
        >
          <h2 className="font-medium">{t("home.cardMatchday.title")}</h2>
          <p className="mt-2 text-sm text-black/60 dark:text-white/60">
            {t("home.cardMatchday.description")}
          </p>
        </Link>
      </div>
    </div>
  );
}
