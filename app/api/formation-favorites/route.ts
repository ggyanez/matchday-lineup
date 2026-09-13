import { NextRequest, NextResponse } from "next/server";
import { listFavoriteFormations, setFavoriteFormations } from "@/lib/data/favorites-repository";
import { FORMATION_NAMES } from "@/lib/domain/formation";

export async function GET() {
  const formations = await listFavoriteFormations();
  return NextResponse.json({ formations });
}

export async function PUT(request: NextRequest) {
  const body = await request.json().catch(() => null);

  if (!body || !Array.isArray(body.formations)) {
    return NextResponse.json({ error: "Invalid favorites payload." }, { status: 400 });
  }

  const known = new Set<string>(FORMATION_NAMES);
  const formations = (body.formations as unknown[]).filter(
    (f): f is string => typeof f === "string" && known.has(f)
  ) as (typeof FORMATION_NAMES)[number][];

  const saved = await setFavoriteFormations(formations);
  return NextResponse.json({ formations: saved });
}
