import Anthropic from "@anthropic-ai/sdk";
import type { FormationRecommendation } from "../lineup/matching";
import { DEFAULT_LOCALE, type Locale } from "../i18n/locale";

const DEFAULT_MODEL = "claude-sonnet-5";

/**
 * Asks Claude for a short, coach-style explanation of the recommended
 * lineup. This step is purely cosmetic — the recommendation itself is
 * produced deterministically by the matching algorithm, so the app keeps
 * working (minus this explanation) if no API key is configured or the
 * request fails.
 */
export async function explainRecommendation(
  best: FormationRecommendation,
  alternatives: FormationRecommendation[],
  locale: Locale = DEFAULT_LOCALE
): Promise<string | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;

  const client = new Anthropic({ apiKey });
  const model = process.env.ANTHROPIC_MODEL ?? DEFAULT_MODEL;

  const prompt = buildPrompt(best, alternatives, locale);

  try {
    const response = await client.messages.create({
      model,
      max_tokens: 300,
      messages: [{ role: "user", content: prompt }],
    });

    const textBlock = response.content.find((block) => block.type === "text");
    return textBlock && textBlock.type === "text" ? textBlock.text.trim() : null;
  } catch {
    // Explanations are a nice-to-have; never let this break lineup generation.
    return null;
  }
}

function buildPrompt(
  best: FormationRecommendation,
  alternatives: FormationRecommendation[],
  locale: Locale
): string {
  const lineup = best.slots
    .map((s) => `- ${s.position} (${s.slotId}): ${s.player ? s.player.name : "unfilled"} [${s.fit}]`)
    .join("\n");

  const bench = best.bench.length > 0 ? best.bench.map((p) => p.name).join(", ") : "none";

  const alternativesSummary = alternatives
    .filter((a) => a.formation !== best.formation)
    .slice(0, 2)
    .map((a) => `${a.formation} (avg fit ${a.averageScore.toFixed(2)})`)
    .join(", ");

  return [
    "You are a concise assistant helping an amateur football coach understand a lineup",
    "recommendation that was generated algorithmically (not by you). Explain briefly, in",
    "plain language, why this formation and player assignment make sense given the squad",
    "available for this match. Mention any notable trade-offs or players out of position.",
    "Keep it to 3-4 short sentences, no headings, no bullet points.",
    "",
    `Recommended formation: ${best.formation}`,
    `Lineup:\n${lineup}`,
    `Bench: ${bench}`,
    best.warnings.length > 0 ? `Warnings: ${best.warnings.join(" ")}` : "",
    alternativesSummary ? `Other formations considered: ${alternativesSummary}` : "",
    locale === "es" ? "Respond in Spanish." : "Respond in English.",
  ]
    .filter(Boolean)
    .join("\n");
}
