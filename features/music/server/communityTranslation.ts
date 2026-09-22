import "server-only";

import { ApiError as GeminiApiError, GoogleGenAI } from "@google/genai";
import { z } from "zod";

import { OFFICIAL_X_TRANSLATION_MODELS } from "@/features/home/server/officialXPostTranslation";
import { ApiError } from "@/lib/api/response";
import db from "@/lib/db";
import { serverEnv } from "@/lib/env/server";
import { SUPPORTED_LOCALES, type Locale } from "@/lib/i18n/routing";
import { detectTextLanguage } from "@/lib/i18n/textLanguage";

const TRANSLATION_TIMEOUT_MS = 20_000;
const LANGUAGE_NAMES: Record<Locale, string> = {
    ko: "Korean",
    ja: "Japanese",
    en: "English",
};

// 이용자 글 번역(2026-09-22 — 사용자: 공식 X 번역과 같은 키 · 같은 방식). 올릴 때 한 번 번역해 저장하고 그대로 쓴다
export function isCommunityTranslationEnabled() {
    return Boolean(serverEnv.GEMINI_API_KEY);
}

// 저장된 번역 { ko?, ja?, en? } — 모르는 값은 버린다
export const communityTranslationsSchema = z
    .object({
        ko: z.string().optional(),
        ja: z.string().optional(),
        en: z.string().optional(),
    })
    .catch({});
type StoredTranslations = z.infer<typeof communityTranslationsSchema>;

const instruction = (
    targets: Locale[]
) => `You translate short user comments from a fan site for NOSTALGIA, a Konami arcade rhythm game played on a piano-style keyboard. Comments discuss a specific chart (difficulty, patterns, techniques).

Rules:
- Output JSON with exactly these string fields: ${targets.map((target) => `"${target}" (${LANGUAGE_NAMES[target]})`).join(", ")}.
- Keep the meaning, tone and line breaks. Do not add, explain or soften anything.
- Copy verbatim: @mentions (e.g. @name), song titles, difficulty names (Normal, Hard, Expert, Real), scores and numbers, and URLs.
- Rhythm game terms: 譜面 → 채보 / chart. 縦連 → 세로 연타 / jacks. トリル → 트릴 / trill. 餡蜜 stays as is.
- Return only the JSON object.`;

function isRetryable(error: unknown) {
    return (
        error instanceof GeminiApiError &&
        (error.status === 429 || error.status >= 500)
    );
}

/** 글 하나를 targets 언어들로 한 번에. 설정이 없거나 모든 모델이 실패하면 null */
async function translateCommunityText(text: string, targets: Locale[]) {
    const apiKey = serverEnv.GEMINI_API_KEY;
    if (!apiKey || !targets.length) return null;
    const schema = z.object(
        Object.fromEntries(
            targets.map((target) => [target, z.string().trim().min(1)])
        )
    );
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
                    systemInstruction: instruction(targets),
                    responseMimeType: "application/json",
                    responseJsonSchema: {
                        type: "object",
                        properties: Object.fromEntries(
                            targets.map((target) => [
                                target,
                                { type: "string" },
                            ])
                        ),
                        required: targets,
                        additionalProperties: false,
                    },
                },
            });
            const parsed = schema.safeParse(
                JSON.parse(response.text ?? "null")
            );
            return parsed.success
                ? (parsed.data as Partial<Record<Locale, string>>)
                : null;
        } catch (error) {
            console.error(`[community-translation] ${model} failed`, error);
            if (!isRetryable(error)) return null;
        }
    }
    return null;
}

async function loadSource(kind: "opinion" | "reply", id: number) {
    if (kind === "opinion") {
        const row = await db.communityChartEvaluation.findFirst({
            where: {
                id,
                excluded: false,
                opinionHidden: false,
                opinion: { not: null },
            },
            select: { opinion: true, opinionTranslations: true },
        });
        return row
            ? {
                  text: row.opinion!,
                  stored: communityTranslationsSchema.parse(
                      row.opinionTranslations ?? {}
                  ),
              }
            : null;
    }
    const row = await db.communityOpinionReply.findFirst({
        where: {
            id,
            hidden: false,
            evaluation: { excluded: false, opinionHidden: false },
        },
        select: { body: true, translations: true },
    });
    return row
        ? {
              text: row.body,
              stored: communityTranslationsSchema.parse(row.translations ?? {}),
          }
        : null;
}

/**
 * 글 하나의 빠진 번역을 만들어 저장한다 — 글 언어를 뺀 나머지 두 언어를 한 번에.
 * 이미 있으면 부르지 않는다. 만드는 사이 글이 바뀌었으면 저장하지 않는다(본문이 같을 때만 기록)
 */
export async function fillCommunityTranslations(
    kind: "opinion" | "reply",
    id: number
): Promise<StoredTranslations | null> {
    if (!isCommunityTranslationEnabled()) return null;
    const source = await loadSource(kind, id);
    if (!source) return null;
    const language = detectTextLanguage(source.text);
    if (!language) return source.stored;
    const missing = SUPPORTED_LOCALES.filter(
        (locale) => locale !== language && !source.stored[locale]
    );
    if (!missing.length) return source.stored;
    const translated = await translateCommunityText(source.text, missing);
    if (!translated) return source.stored;
    const next = { ...source.stored, ...translated };
    if (kind === "opinion")
        await db.communityChartEvaluation.updateMany({
            where: { id, opinion: source.text },
            data: { opinionTranslations: next },
        });
    else
        await db.communityOpinionReply.updateMany({
            where: { id, body: source.text },
            data: { translations: next },
        });
    return next;
}

/**
 * 「번역 보기」 — 올릴 때 만들어 둔 번역을 그대로. 그때 실패했거나 전부터 있던 글이면 이번에 한 번 만들어 저장한다
 */
export async function getCommunityTranslation(input: {
    kind: "opinion" | "reply";
    id: number;
    locale: Locale;
}) {
    if (!isCommunityTranslationEnabled())
        throw new ApiError("translation_unavailable", "unavailable");
    const source = await loadSource(input.kind, input.id);
    if (!source) throw new ApiError("translation_unavailable", "unavailable");
    const cached = source.stored[input.locale];
    if (cached) return cached;
    const filled = await fillCommunityTranslations(input.kind, input.id);
    const text = filled?.[input.locale];
    if (!text) throw new ApiError("translation_failed", "failed");
    return text;
}
