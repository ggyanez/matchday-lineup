import { NextRequest, NextResponse } from "next/server";
import { deletePlayer, updatePlayer } from "@/lib/data/players-repository";
import { isValidPlayerInput } from "@/lib/domain/player";
import { requireSession } from "@/lib/auth/session";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const session = await requireSession();
  if (session instanceof NextResponse) return session;

  const { id } = await params;
  const body = await request.json().catch(() => null);

  if (!body || !isValidPlayerInput(body)) {
    return NextResponse.json({ error: "Invalid player data." }, { status: 400 });
  }

  try {
    const player = await updatePlayer(session.teamId, id, {
      name: body.name,
      primaryPositions: body.primaryPositions ?? [],
      secondaryPositions: body.secondaryPositions ?? [],
      preferredFoot: body.preferredFoot ?? null,
      injuryStatus: body.injuryStatus ?? "healthy",
      membershipStatus: body.membershipStatus ?? "regular",
      notes: body.notes,
    });
    return NextResponse.json({ player });
  } catch {
    return NextResponse.json({ error: "Player not found." }, { status: 404 });
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const session = await requireSession();
  if (session instanceof NextResponse) return session;

  const { id } = await params;
  await deletePlayer(session.teamId, id);
  return NextResponse.json({ ok: true });
}
