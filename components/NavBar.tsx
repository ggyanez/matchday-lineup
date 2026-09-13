"use client";

import Link from "next/link";
import { useLocale } from "@/lib/i18n/LocaleContext";

export default function NavBar() {
  const { locale, setLocale, t } = useLocale();

  const links = [
    { href: "/players", label: t("nav.players") },
    { href: "/formations", label: t("nav.formations") },
    { href: "/matchday", label: t("nav.matchday") },
  ];

  return (
    <header className="border-b border-black/10 dark:border-white/10">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-semibold tracking-tight">
          Matchday Lineup
        </Link>
        <div className="flex items-center gap-6">
          <nav className="flex gap-6 text-sm">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-black/70 hover:text-black dark:text-white/70 dark:hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex gap-1.5">
            <button
              type="button"
              onClick={() => setLocale("es")}
              aria-label="Español"
              aria-pressed={locale === "es"}
              title="Español"
              className={`rounded text-lg leading-none transition ${
                locale === "es" ? "opacity-100" : "opacity-40 hover:opacity-70"
              }`}
            >
              🇪🇸
            </button>
            <button
              type="button"
              onClick={() => setLocale("en")}
              aria-label="English"
              aria-pressed={locale === "en"}
              title="English"
              className={`rounded text-lg leading-none transition ${
                locale === "en" ? "opacity-100" : "opacity-40 hover:opacity-70"
              }`}
            >
              🇺🇸
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
