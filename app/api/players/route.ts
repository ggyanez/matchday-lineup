import { NextRequest, NextResponse } from "next/server";
import { createPlayer, listPlayers } from "@/lib/data/players-repository";
import { isValidPlayerInput } from "@/lib/domain/player";
import { requireSession } from "@/lib/auth/session";

export async function GET() {
  const session = await requireSession();
  if (session instanceof NextResponse) return session;

  const players = await listPlayers(session.teamId);
  return NextResponse.json({ players });
}

export async function POST(request: NextRequest) {
  const session = await requireSession();
  if (session instanceof NextResponse) return session;

  const body = await request.json().catch(() => null);

  if (!body || !isValidPlayerInput(body)) {
    return NextResponse.json({ error: "Invalid player data." }, { status: 400 });
  }

  const player = await createPlayer(session.teamId, {
    name: body.name,
    primaryPositions: body.primaryPositions ?? [],
    secondaryPositions: body.secondaryPositions ?? [],
    preferredFoot: body.preferredFoot ?? null,
    injuryStatus: body.injuryStatus ?? "healthy",
    membershipStatus: body.membershipStatus ?? "regular",
    notes: body.notes,
  });

  return NextResponse.json({ player }, { status: 201 });
}
