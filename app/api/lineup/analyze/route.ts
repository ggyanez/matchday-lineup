import { NextRequest, NextResponse } from "next/server";
import { explainRecommendation } from "@/lib/ai/lineup-explainer";
import { DEFAULT_LOCALE, isLocale, type Locale } from "@/lib/i18n/locale";
import { requireSession } from "@/lib/auth/session";
import type { FormationRecommendation } from "@/lib/lineup/matching";

interface AnalyzeRequestBody {
  recommendation?: FormationRecommendation;
  locale?: Locale;
}

function isRecommendationShaped(value: unknown): value is FormationRecommendation {
  if (!value || typeof value !== "object") return false;
  const r = value as Record<string, unknown>;
  return (
    typeof r.formation === "string" &&
    Array.isArray(r.slots) &&
    Array.isArray(r.bench) &&
    Array.isArray(r.warnings)
  );
}

/**
 * Analyzes whatever lineup the client currently has on screen — the
 * exact `FormationRecommendation`-shaped object it already computed
 * (algorithmically, then possibly hand-edited via drag-and-drop or a
 * slot's position override) — rather than re-running the matching
 * algorithm. This is a deliberate choice: the point of this endpoint is
 * to analyze whatever the coach actually put together, including any
 * manual changes the algorithm never saw.
 */
export async function POST(request: NextRequest) {
  const session = await requireSession();
  if (session instanceof NextResponse) return session;

  const body = (await request.json().catch(() => null)) as AnalyzeRequestBody | null;

  if (!body || !isRecommendationShaped(body.recommendation)) {
    return NextResponse.json({ error: "Invalid lineup data." }, { status: 400 });
  }

  const locale = isLocale(body.locale ?? "") ? (body.locale as Locale) : DEFAULT_LOCALE;

  const explanation = await explainRecommendation(body.recommendation, locale);
  return NextResponse.json({ explanation });
}
