import { NextRequest, NextResponse } from "next/server";
import { listPlayers } from "@/lib/data/players-repository";
import { listFavoriteFormations } from "@/lib/data/favorites-repository";
import { recommendFormations } from "@/lib/lineup/matching";
import { explainRecommendation } from "@/lib/ai/lineup-explainer";
import { FORMATION_NAMES, type FormationName } from "@/lib/domain/formation";
import { DEFAULT_LOCALE, isLocale, type Locale } from "@/lib/i18n/locale";
import { requireSession } from "@/lib/auth/session";

interface LineupRequestBody {
  playerIds: string[];
  formations?: FormationName[];
  explain?: boolean;
  locale?: Locale;
}

export async function POST(request: NextRequest) {
  const session = await requireSession();
  if (session instanceof NextResponse) return session;

  const body = (await request.json().catch(() => null)) as LineupRequestBody | null;

  if (!body || !Array.isArray(body.playerIds) || body.playerIds.length === 0) {
    return NextResponse.json(
      { error: "Provide at least one confirmed player id." },
      { status: 400 }
    );
  }

  const locale = isLocale(body.locale ?? "") ? (body.locale as Locale) : DEFAULT_LOCALE;

  const candidateFormations =
    body.formations?.filter((f) => (FORMATION_NAMES as string[]).includes(f)) ??
    FORMATION_NAMES;

  const [allPlayers, favoriteFormations] = await Promise.all([
    listPlayers(session.teamId),
    listFavoriteFormations(session.teamId),
  ]);
  const confirmedIds = new Set(body.playerIds);
  const confirmedPlayers = allPlayers.filter((p) => confirmedIds.has(p.id));

  if (confirmedPlayers.length === 0) {
    return NextResponse.json({ error: "No matching confirmed players found." }, { status: 400 });
  }

  const recommendations = recommendFormations(
    confirmedPlayers,
    candidateFormations,
    locale,
    new Set(favoriteFormations)
  );
  const [best, ...rest] = recommendations;

  const explanation = body.explain ? await explainRecommendation(best, rest, locale) : null;

  return NextResponse.json({ best, alternatives: rest, explanation });
}
