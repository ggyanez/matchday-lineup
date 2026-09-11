import { NextRequest, NextResponse } from "next/server";
import { listPlayers } from "@/lib/data/players-repository";
import { recommendFormations } from "@/lib/lineup/matching";
import { explainRecommendation } from "@/lib/ai/lineup-explainer";
import { FORMATION_NAMES, type FormationName } from "@/lib/domain/formation";

interface LineupRequestBody {
  playerIds: string[];
  formations?: FormationName[];
  explain?: boolean;
}

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as LineupRequestBody | null;

  if (!body || !Array.isArray(body.playerIds) || body.playerIds.length === 0) {
    return NextResponse.json(
      { error: "Provide at least one confirmed player id." },
      { status: 400 }
    );
  }

  const candidateFormations =
    body.formations?.filter((f) => (FORMATION_NAMES as string[]).includes(f)) ??
    FORMATION_NAMES;

  const allPlayers = await listPlayers();
  const confirmedIds = new Set(body.playerIds);
  const confirmedPlayers = allPlayers.filter((p) => confirmedIds.has(p.id));

  if (confirmedPlayers.length === 0) {
    return NextResponse.json({ error: "No matching confirmed players found." }, { status: 400 });
  }

  const recommendations = recommendFormations(confirmedPlayers, candidateFormations);
  const [best, ...rest] = recommendations;

  const explanation = body.explain ? await explainRecommendation(best, rest) : null;

  return NextResponse.json({ best, alternatives: rest, explanation });
}
