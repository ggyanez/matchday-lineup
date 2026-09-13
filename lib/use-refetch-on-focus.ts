"use client";

import { useEffect } from "react";

/**
 * Re-runs `refetch` whenever this page becomes visible again — covers a
 * few different ways stale data could otherwise linger:
 *  - Next's client-side Router Cache reusing a previously-visited static
 *    page instead of remounting it (so the "fetch on mount" effect never
 *    fires again).
 *  - The browser's back/forward cache (bfcache) restoring an old snapshot
 *    verbatim when navigating with the back/forward button — a case
 *    Next's own cache settings explicitly don't cover.
 *  - Coming back to an already-open tab after editing the same data in
 *    another one.
 */
export function useRefetchOnFocus(refetch: () => void) {
  useEffect(() => {
    function handleVisibilityChange() {
      if (document.visibilityState === "visible") refetch();
    }
    function handlePageShow(event: PageTransitionEvent) {
      if (event.persisted) refetch();
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("pageshow", handlePageShow);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("pageshow", handlePageShow);
    };
  }, [refetch]);
}
