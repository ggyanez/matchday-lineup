import { NextRequest, NextResponse } from "next/server";
import { findTeamByName } from "@/lib/data/teams-repository";
import { findUserByUsername, verifyPassword } from "@/lib/data/users-repository";
import { createSession } from "@/lib/auth/session";

interface LoginRequestBody {
  team?: string;
  username?: string;
  password?: string;
}

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as LoginRequestBody | null;

  if (!body || !body.team?.trim() || !body.username?.trim() || !body.password) {
    return NextResponse.json({ error: "Team, username, and password are all required." }, { status: 400 });
  }

  const team = await findTeamByName(body.team);
  if (!team) {
    return NextResponse.json({ error: "Invalid team, username, or password." }, { status: 401 });
  }

  const user = await findUserByUsername(team.id, body.username);
  if (!user || !(await verifyPassword(user, body.password))) {
    return NextResponse.json({ error: "Invalid team, username, or password." }, { status: 401 });
  }

  await createSession({
    userId: user.id,
    teamId: team.id,
    teamName: team.name,
    username: user.username,
  });

  return NextResponse.json({ user: { username: user.username, teamName: team.name } });
}
