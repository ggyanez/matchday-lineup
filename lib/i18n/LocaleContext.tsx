"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { DEFAULT_LOCALE, type Locale } from "./locale";
import { loadStoredLocale, saveStoredLocale } from "./locale-storage";
import { translate, type TranslationKey } from "./translations";

interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey) => string;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

/**
 * Provides the current display language app-wide. Today this is a
 * per-device preference (localStorage) since there's no login yet; it's
 * deliberately kept behind this one hook (`useLocale`) so that once
 * accounts exist, only `lib/i18n/locale-storage.ts` needs to change (to
 * read/write against the logged-in user instead) — no consumer of
 * `useLocale()` has to.
 */
export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);

  // The server-rendered shell always uses the default locale (no access to
  // localStorage there) — restoring a different stored preference has to
  // happen post-mount, in an effect, to avoid a hydration mismatch.
  /* eslint-disable react-hooks/set-state-in-effect -- intentional: syncing
     one-time from localStorage after mount, not deriving from props/state */
  useEffect(() => {
    const stored = loadStoredLocale();
    if (stored) setLocaleState(stored);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    saveStoredLocale(next);
  }, []);

  // Keep <html lang> in sync — covers both the initial post-mount restore
  // from storage and later manual switches.
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const t = useCallback((key: TranslationKey) => translate(locale, key), [locale]);

  const value = useMemo(() => ({ locale, setLocale, t }), [locale, setLocale, t]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within a LocaleProvider");
  return ctx;
}
