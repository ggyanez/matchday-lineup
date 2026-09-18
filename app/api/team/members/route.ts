import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/auth/session";
import { createUser, listTeamUsers } from "@/lib/data/users-repository";
import { isValidPassword, isValidUsername } from "@/lib/domain/user";

export async function GET() {
  const session = await requireSession();
  if (session instanceof NextResponse) return session;

  const users = await listTeamUsers(session.teamId);
  return NextResponse.json({
    members: users.map((u) => ({ username: u.username, createdAt: u.createdAt })),
  });
}

interface AddMemberBody {
  username?: string;
  password?: string;
}

export async function POST(request: NextRequest) {
  const session = await requireSession();
  if (session instanceof NextResponse) return session;

  const body = (await request.json().catch(() => null)) as AddMemberBody | null;
  if (!body || !body.username || !body.password) {
    return NextResponse.json({ error: "Username and password are required." }, { status: 400 });
  }
  if (!isValidUsername(body.username)) {
    return NextResponse.json({ error: "Username must be 2-32 characters." }, { status: 400 });
  }
  if (!isValidPassword(body.password)) {
    return NextResponse.json({ error: "Password must be at least 6 characters." }, { status: 400 });
  }

  try {
    const user = await createUser(session.teamId, body.username, body.password);
    return NextResponse.json(
      { member: { username: user.username, createdAt: user.createdAt } },
      { status: 201 }
    );
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Could not create the user." },
      { status: 409 }
    );
  }
}
