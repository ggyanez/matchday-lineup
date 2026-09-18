import Anthropic from "@anthropic-ai/sdk";
import type { FormationRecommendation } from "../lineup/matching";
import { DEFAULT_LOCALE, type Locale } from "../i18n/locale";

const DEFAULT_MODEL = "claude-sonnet-5";

/**
 * Asks Claude for a short, coach-style analysis of a lineup — whatever
 * is currently on the pitch board at the moment the user asks, which may
 * be the algorithm's own recommendation, a hand-edited version of it, or
 * something built entirely by dragging players around. This step is
 * purely cosmetic — the lineup itself is decided deterministically by
 * the app (algorithmically and/or by the user's own edits), so the app
 * keeps working (minus this analysis) if no API key is configured or the
 * request fails.
 */
export async function explainRecommendation(
  recommendation: FormationRecommendation,
  locale: Locale = DEFAULT_LOCALE
): Promise<string | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;

  const client = new Anthropic({ apiKey });
  const model = process.env.ANTHROPIC_MODEL ?? DEFAULT_MODEL;

  const prompt = buildPrompt(recommendation, locale);

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

function buildPrompt(recommendation: FormationRecommendation, locale: Locale): string {
  const lineup = recommendation.slots
    .map((s) => `- ${s.position} (${s.slotId}): ${s.player ? s.player.name : "unfilled"} [${s.fit}]`)
    .join("\n");

  const bench =
    recommendation.bench.length > 0 ? recommendation.bench.map((p) => p.name).join(", ") : "none";

  return [
    "You are a concise assistant helping an amateur football coach understand a lineup",
    "for their next match, exactly as it stands right now (it may be the algorithm's own",
    "recommendation, or the coach's own hand-edited version of it — you are analyzing the",
    "end result, not deciding it). In plain language, point out both what works well AND",
    "any real weaknesses or risks — players out of position, injuries in the lineup, weak",
    "spots — don't just praise it uncritically if there's something worth flagging.",
    "Keep it to 3-4 short sentences, no headings, no bullet points.",
    "",
    `Formation: ${recommendation.formation}`,
    `Lineup:\n${lineup}`,
    `Bench: ${bench}`,
    recommendation.warnings.length > 0 ? `Warnings: ${recommendation.warnings.join(" ")}` : "",
    locale === "es" ? "Respond in Spanish." : "Respond in English.",
  ]
    .filter(Boolean)
    .join("\n");
}
