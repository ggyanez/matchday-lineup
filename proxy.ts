import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decryptSession, SESSION_COOKIE_NAME } from "@/lib/auth/session";

const PUBLIC_ROUTES = ["/login"];

/**
 * Optimistic, page-level auth check — redirects an unauthenticated
 * visitor to /login, and a logged-in one away from /login. This is
 * NOT the real security boundary: every API route independently
 * re-verifies the session and derives the team from it (never from the
 * client), per Next.js's own guidance that Proxy shouldn't be the only
 * line of defense. API routes are excluded from this file's matcher —
 * they return a JSON 401 on their own instead of being redirected,
 * which would break `fetch()`-based callers.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = token ? await decryptSession(token) : null;

  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

  if (!isPublicRoute && !session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isPublicRoute && session) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Everything except API routes (which handle their own auth and
  // return JSON, not redirects) and static/image assets.
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
