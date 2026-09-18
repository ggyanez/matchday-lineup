import "server-only";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { SignJWT, jwtVerify } from "jose";

/**
 * What's stashed in the signed session cookie — deliberately minimal
 * (the tips from Next.js's own auth guide): just enough to scope every
 * request to a team, without carrying anything sensitive. The
 * password hash never appears here.
 */
export interface SessionPayload {
  userId: string;
  teamId: string;
  teamName: string;
  username: string;
}

const COOKIE_NAME = "session";
const SESSION_DURATION_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

function secretKey(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error("Missing required environment variable: AUTH_SECRET");
  return new TextEncoder().encode(secret);
}

async function encrypt(payload: SessionPayload, expiresAt: Date): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(Math.floor(expiresAt.getTime() / 1000))
    .sign(secretKey());
}

async function decrypt(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey(), { algorithms: ["HS256"] });
    const { userId, teamId, teamName, username } = payload as Record<string, unknown>;
    if (
      typeof userId !== "string" ||
      typeof teamId !== "string" ||
      typeof teamName !== "string" ||
      typeof username !== "string"
    ) {
      return null;
    }
    return { userId, teamId, teamName, username };
  } catch {
    return null; // expired, tampered, or signed with an old secret — treat as logged out
  }
}

/** Signs `payload` and sets it as an httpOnly session cookie. Called after a successful login. */
export async function createSession(payload: SessionPayload): Promise<void> {
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);
  const token = await encrypt(payload, expiresAt);
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
}

/** Reads and verifies the session cookie for the current request. `null` if absent, expired, or invalid. */
export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return decrypt(token);
}

/** Clears the session cookie. Called on logout. */
export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

/**
 * The real security boundary for API routes (Proxy's check is only
 * optimistic — see proxy.ts). Every data-touching route calls this
 * first:
 *
 *   const session = await requireSession();
 *   if (session instanceof NextResponse) return session;
 *
 * and uses `session.teamId` for every read/write, never a client-
 * supplied one.
 */
export async function requireSession(): Promise<SessionPayload | NextResponse> {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return session;
}

// Exported for proxy.ts, which runs outside the request-scoped `cookies()`
// API and reads the raw cookie value off the incoming request instead.
export { COOKIE_NAME as SESSION_COOKIE_NAME, decrypt as decryptSession };
