import "server-only";
import { ApiError, GoogleGenAI } from "@google/genai";
import { z } from "zod";
import { serverEnv } from "@/lib/env/server";
import {
    maskOfficialXPostLinks,
    type OfficialXPostLink,
    type OfficialXPostTranslations,
} from "@/features/home/officialXPostContent";

// Free-tier Gemini Flash, most reliable first (measured). The free lane sheds load with 503s,
// so the next model in the list is tried before giving up.
export const OFFICIAL_X_TRANSLATION_MODELS = [
    // 앞에서부터 시도. 3.6 을 맨 앞에 — 2026-09-22 실측(같은 지시문 4회)에서 3.6 4/4 · 3.8 1/4 · 3.5 0/4 성공.
    // 2.5 는 새 사용자에게 더는 제공되지 않는다(404)
    "gemini-3.6-flash",
    "gemini-3.8-flash",
    "gemini-3.5-flash",
] as const;
export const OFFICIAL_X_TRANSLATION_MODEL = OFFICIAL_X_TRANSLATION_MODELS[0];
const TRANSLATION_TIMEOUT_MS = 20_000;
// 리듬게임 공지 특유의 용어를 고정하고 링크·해시태그·고유명사는 손대지 않게 한다.
export const OFFICIAL_X_TRANSLATION_INSTRUCTION = `You translate short Japanese posts from the official X account of NOSTALGIA, a Konami arcade rhythm game played on a piano-style keyboard, into Korean and English for a fan site.

Rules:
- Output JSON with exactly two string fields: "ko" (Korean) and "en" (English).
- Keep the meaning and line breaks of the original. Do not add or drop information.
- Copy these verbatim: placeholders like [[LINK_1]], hashtags (e.g. #ノスタルジア), URLs, song titles inside 『』 or quotes, difficulty names (Normal, Hard, Expert, Real), version names (Op.3), and proper nouns written in Latin letters.
- Terminology: 譜面 → 채보 / chart. 高難度 → 고난도 / high-difficulty. 楽曲 → 악곡 / song. 稼働 → 가동 / in operation. 筐体 → 기체 / cabinet. NOSTALGIA / ノスタルジア → NOSTALGIA in English and 노스탤지어 is NOT used; keep NOSTALGIA in Korean too.
- Keep dates and times as written (e.g. 9月10日(木)10:00 → 9월 10일(목) 10:00 / Sep 10 (Thu) 10:00).
- Korean uses polite formal style (합니다체). English is concise and natural.
- Return only the JSON object.`;

const translationSchema = z.object({
    ko: z.string().trim().min(1),
    en: z.string().trim().min(1),
});

const responseJsonSchema = {
    type: "object",
    properties: { ko: { type: "string" }, en: { type: "string" } },
    required: ["ko", "en"],
    additionalProperties: false,
};

export function parseOfficialXPostTranslations(
    raw: string | undefined
): OfficialXPostTranslations | null {
    if (!raw) return null;
    try {
        const parsed = translationSchema.safeParse(JSON.parse(raw));
        return parsed.success ? parsed.data : null;
    } catch {
        return null;
    }
}

// 429(쿼터)·5xx(과부하)는 다른 모델로 넘어갈 가치가 있고, 그 외(키 오류·잘못된 요청)는 즉시 포기
function isRetryable(error: unknown) {
    return (
        error instanceof ApiError &&
        (error.status === 429 || error.status >= 500)
    );
}

/**
 * Translates one post into ko/en. Returns null whenever translation is not
 * configured or every model fails, so the card falls back to the original.
 */
export async function translateOfficialXPost(
    text: string,
    links: OfficialXPostLink[]
): Promise<OfficialXPostTranslations | null> {
    const apiKey = serverEnv.GEMINI_API_KEY;
    if (!apiKey) return null;
    const { masked, restore } = maskOfficialXPostLinks(text, links);
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
                contents: masked,
                config: {
                    abortSignal: AbortSignal.timeout(TRANSLATION_TIMEOUT_MS),
                    systemInstruction: OFFICIAL_X_TRANSLATION_INSTRUCTION,
                    responseMimeType: "application/json",
                    responseJsonSchema,
                },
            });
            const parsed = parseOfficialXPostTranslations(response.text);
            if (!parsed) {
                console.error(
                    `[official-x] ${model} returned no usable translation JSON`
                );
                return null;
            }
            return { ko: restore(parsed.ko), en: restore(parsed.en) };
        } catch (error) {
            console.error(
                `[official-x] ${model} failed to translate the latest post`,
                error
            );
            if (!isRetryable(error)) return null;
        }
    }
    return null;
}
