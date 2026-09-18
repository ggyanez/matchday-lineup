"use client";

import Link from "next/link";
import { useLocale } from "@/lib/i18n/LocaleContext";
import { logoutRequest } from "@/lib/api-client";

interface NavBarProps {
  /** `null` when there's no signed-in session (e.g. on /login). */
  user: { username: string; teamName: string } | null;
}

export default function NavBar({ user }: NavBarProps) {
  const { locale, setLocale, t } = useLocale();

  // The Lineup section comes first and stands out — it's the app's core
  // feature; Players, Formations, and Team are just the supporting
  // record-keeping.
  const links = [
    { href: "/players", label: t("nav.players") },
    { href: "/formations", label: t("nav.formations") },
    { href: "/team", label: t("nav.team") },
  ];

  async function handleLogout() {
    await logoutRequest();
    // Hard navigation, same reasoning as the login page: the root layout's
    // getSession() needs to actually re-run against the now-cleared cookie.
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination -- intentional, see above
    window.location.href = "/login";
  }

  return (
    <header className="border-b border-black/10 dark:border-white/10">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
        <Link href={user ? "/" : "/login"} className="font-semibold tracking-tight">
          Matchday Lineup
        </Link>
        <div className="flex items-center gap-6">
          {user && (
            <nav className="flex gap-6 text-sm">
              <Link
                href="/lineup"
                className="font-semibold text-black hover:opacity-70 dark:text-white"
              >
                {t("nav.matchday")}
              </Link>
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
          )}
          {user && (
            <div className="hidden text-xs text-black/50 sm:block dark:text-white/50">
              {user.teamName} · {t("nav.loggedInAs")} {user.username}
            </div>
          )}
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
          {user && (
            <button
              type="button"
              onClick={handleLogout}
              className="text-sm text-black/50 hover:text-red-600 dark:text-white/50 dark:hover:text-red-400"
            >
              {t("nav.logout")}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
