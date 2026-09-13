"use client";

import { isLocale, type Locale } from "./locale";

const STORAGE_KEY = "matchday-lineup:locale";

/**
 * Where the language preference is read from and written to.
 *
 * Today this is a per-device localStorage value — there's no login yet,
 * so "per-user" and "per-device" happen to be the same thing. Once
 * accounts exist, this is meant to become a per-user setting: swap only
 * this module's implementation (e.g. to an API call scoped to the
 * logged-in user) — nothing else in the app talks to storage directly,
 * every component reads/writes the locale through `useLocale()`.
 */
export function loadStoredLocale(): Locale | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw && isLocale(raw) ? raw : null;
  } catch {
    return null;
  }
}

export function saveStoredLocale(locale: Locale): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, locale);
  } catch {
    // Best-effort only — a full or disabled localStorage shouldn't break the page.
  }
}
