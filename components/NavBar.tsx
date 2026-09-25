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
    <header className="border-b border-border bg-surface/60 backdrop-blur">
      <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-6 py-4">
        <Link
          href={user ? "/" : "/login"}
          className="flex shrink-0 items-center gap-2 font-semibold tracking-tight"
        >
          <span className="text-lg">⚽</span>
          Matchday Lineup
        </Link>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          {user && (
            <nav className="flex flex-wrap items-center gap-x-5 gap-y-1 text-sm">
              <Link href="/lineup" className="font-semibold text-accent hover:text-accent-hover">
                {t("nav.matchday")}
              </Link>
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-muted transition hover:text-foreground"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          )}
          {user && (
            <div className="hidden text-xs text-muted sm:block">
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
              className="text-sm text-muted transition hover:text-danger"
            >
              {t("nav.logout")}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
