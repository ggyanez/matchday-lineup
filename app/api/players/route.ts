import { NextRequest, NextResponse } from "next/server";
import { createPlayer, listPlayers } from "@/lib/data/players-repository";
import { isValidPlayerInput } from "@/lib/domain/player";

export async function GET() {
  const players = await listPlayers();
  return NextResponse.json({ players });
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);

  if (!body || !isValidPlayerInput(body)) {
    return NextResponse.json({ error: "Invalid player data." }, { status: 400 });
  }

  const player = await createPlayer({
    name: body.name,
    primaryPosition: body.primaryPosition,
    secondaryPositions: body.secondaryPositions ?? [],
    notes: body.notes,
  });

  return NextResponse.json({ player }, { status: 201 });
}
