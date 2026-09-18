import { NextRequest, NextResponse } from "next/server";
import { listFavoriteFormations, setFavoriteFormations } from "@/lib/data/favorites-repository";
import { FORMATION_NAMES } from "@/lib/domain/formation";
import { requireSession } from "@/lib/auth/session";

export async function GET() {
  const session = await requireSession();
  if (session instanceof NextResponse) return session;

  const formations = await listFavoriteFormations(session.teamId);
  return NextResponse.json({ formations });
}

export async function PUT(request: NextRequest) {
  const session = await requireSession();
  if (session instanceof NextResponse) return session;

  const body = await request.json().catch(() => null);

  if (!body || !Array.isArray(body.formations)) {
    return NextResponse.json({ error: "Invalid favorites payload." }, { status: 400 });
  }

  const known = new Set<string>(FORMATION_NAMES);
  const formations = (body.formations as unknown[]).filter(
    (f): f is string => typeof f === "string" && known.has(f)
  ) as (typeof FORMATION_NAMES)[number][];

  const saved = await setFavoriteFormations(session.teamId, formations);
  return NextResponse.json({ formations: saved });
}
