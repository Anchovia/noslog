import "server-only";

import { ApiError as GeminiApiError, GoogleGenAI } from "@google/genai";
import { z } from "zod";

import { OFFICIAL_X_TRANSLATION_MODELS } from "@/features/home/server/officialXPostTranslation";
import { ApiError } from "@/lib/api/response";
import db from "@/lib/db";
import { serverEnv } from "@/lib/env/server";
import type { Locale } from "@/lib/i18n/routing";

const TRANSLATION_TIMEOUT_MS = 20_000;
const LANGUAGE_NAMES: Record<Locale, string> = {
    ko: "Korean",
    ja: "Japanese",
    en: "English",
};

// 이용자 글 번역(2026-09-22 T1 · P1) — 결제를 켠 전용 키로만. 키가 없으면 기능 자체를 끈다
export function isCommunityTranslationEnabled() {
    return Boolean(serverEnv.GEMINI_COMMUNITY_API_KEY);
}

// 저장된 번역 { ko?, ja?, en? } — 모르는 값은 버린다
export const communityTranslationsSchema = z
    .object({
        ko: z.string().optional(),
        ja: z.string().optional(),
        en: z.string().optional(),
    })
    .catch({});

const instruction = (
    target: Locale
) => `You translate short user comments from a fan site for NOSTALGIA, a Konami arcade rhythm game played on a piano-style keyboard. Comments discuss a specific chart (difficulty, patterns, techniques).

Rules:
- Translate into ${LANGUAGE_NAMES[target]}. Output JSON with exactly one string field "text".
- Keep the meaning, tone and line breaks. Do not add, explain or soften anything.
- Copy verbatim: @mentions (e.g. @name), song titles, difficulty names (Normal, Hard, Expert, Real), scores and numbers, URLs, and words already in ${LANGUAGE_NAMES[target]}.
- Rhythm game terms: 譜面/보면 → chart / 譜面 / 채보. 縦連 → jacks / 縦連 / 세로 연타. 餡蜜 → 餡蜜 (keep). トリル → trill / トリル / 트릴. 
- If the text is already in ${LANGUAGE_NAMES[target]}, return it unchanged.
- Return only the JSON object.`;

const responseSchema = z.object({ text: z.string().trim().min(1) });
const responseJsonSchema = {
    type: "object",
    properties: { text: { type: "string" } },
    required: ["text"],
    additionalProperties: false,
};

function isRetryable(error: unknown) {
    return (
        error instanceof GeminiApiError &&
        (error.status === 429 || error.status >= 500)
    );
}

/** 글 하나를 target 으로. 설정이 없거나 모든 모델이 실패하면 null */
async function translateCommunityText(text: string, target: Locale) {
    const apiKey = serverEnv.GEMINI_COMMUNITY_API_KEY;
    if (!apiKey) return null;
    const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
            timeout: TRANSLATION_TIMEOUT_MS,
            retryOptions: { attempts: 1 },
        },
    });
    for (const model of OFFICIAL_X_TRANSLATION_MODELS) {
        try {
            const response = await ai.models.generateContent({
                model,
                contents: text,
                config: {
                    abortSignal: AbortSignal.timeout(TRANSLATION_TIMEOUT_MS),
                    systemInstruction: instruction(target),
                    responseMimeType: "application/json",
                    responseJsonSchema,
                },
            });
            const parsed = responseSchema.safeParse(
                JSON.parse(response.text ?? "null")
            );
            return parsed.success ? parsed.data.text : null;
        } catch (error) {
            console.error(`[community-translation] ${model} failed`, error);
            if (!isRetryable(error)) return null;
        }
    }
    return null;
}

/**
 * 의견 · 답글 하나의 번역 — 저장돼 있으면 그대로, 없으면 이번에 만들어 저장한다(처음 누른 사람 때만 외부 호출).
 * 만드는 사이 글이 바뀌었으면 저장하지 않는다(본문이 같을 때만 기록)
 */
export async function getCommunityTranslation(input: {
    kind: "opinion" | "reply";
    id: number;
    locale: Locale;
}) {
    if (!isCommunityTranslationEnabled())
        throw new ApiError("translation_unavailable", "unavailable");
    const source =
        input.kind === "opinion"
            ? await db.communityChartEvaluation
                  .findFirst({
                      where: {
                          id: input.id,
                          excluded: false,
                          opinionHidden: false,
                          opinion: { not: null },
                      },
                      select: { opinion: true, opinionTranslations: true },
                  })
                  .then((row) =>
                      row
                          ? {
                                text: row.opinion!,
                                stored: row.opinionTranslations,
                            }
                          : null
                  )
            : await db.communityOpinionReply
                  .findFirst({
                      where: {
                          id: input.id,
                          hidden: false,
                          evaluation: { excluded: false, opinionHidden: false },
                      },
                      select: { body: true, translations: true },
                  })
                  .then((row) =>
                      row ? { text: row.body, stored: row.translations } : null
                  );
    if (!source) throw new ApiError("translation_unavailable", "unavailable");
    const stored = communityTranslationsSchema.parse(source.stored ?? {});
    const cached = stored[input.locale];
    if (cached) return cached;
    const text = await translateCommunityText(source.text, input.locale);
    if (!text) throw new ApiError("translation_failed", "failed");
    const next = { ...stored, [input.locale]: text };
    if (input.kind === "opinion")
        await db.communityChartEvaluation.updateMany({
            where: { id: input.id, opinion: source.text },
            data: { opinionTranslations: next },
        });
    else
        await db.communityOpinionReply.updateMany({
            where: { id: input.id, body: source.text },
            data: { translations: next },
        });
    return text;
}
