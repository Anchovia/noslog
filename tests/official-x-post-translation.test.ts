import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { maskOfficialXPostLinks } from "@/features/home/officialXPostContent";

const { env, generateContent } = vi.hoisted(() => ({
    env: { GEMINI_API_KEY: undefined as string | undefined },
    generateContent: vi.fn(),
}));
vi.mock("server-only", () => ({}));
vi.mock("@/lib/env/server", () => ({ serverEnv: env }));
vi.mock("@google/genai", () => ({
    ApiError: class extends Error {
        status: number;
        constructor({ status, message }: { status: number; message: string }) {
            super(message);
            this.status = status;
        }
    },
    GoogleGenAI: class {
        models = { generateContent };
    },
}));

const links = [
    {
        url: "https://t.co/98Ze9MjIOV",
        expandedUrl: "https://p.eagate.573.jp/game/nostalgia/op3/news/",
        displayUrl: "p.eagate.573.jp/game/nostalgia…",
        isMedia: false,
    },
    {
        url: "https://t.co/4I9QNGPXxb",
        expandedUrl: "https://x.com/NOSTALGIA_573/status/1/photo/1",
        displayUrl: "pic.x.com/4I9QNGPXxb",
        isMedia: true,
    },
];
const text =
    "【 Real譜面追加 】\n『Just Be Friends』に“Real”譜面が追加。 #ノスタルジア\n\nhttps://t.co/98Ze9MjIOV https://t.co/4I9QNGPXxb";

async function load() {
    vi.resetModules();
    return import("@/features/home/server/officialXPostTranslation");
}

describe("official X post link masking", () => {
    it("replaces every t.co URL with a placeholder and restores it", () => {
        const { masked, restore } = maskOfficialXPostLinks(text, links);
        expect(masked).not.toContain("t.co");
        expect(masked).toContain("[[LINK_1]] [[LINK_2]]");
        expect(restore(masked)).toBe(text);
        expect(restore("번역 [[LINK_1]] 끝")).toBe(
            "번역 https://t.co/98Ze9MjIOV 끝"
        );
    });
});

describe("official X post translation", () => {
    beforeEach(() => {
        vi.spyOn(console, "error").mockImplementation(() => {});
        env.GEMINI_API_KEY = "key";
    });
    afterEach(() => {
        generateContent.mockReset();
    });

    it("skips the API when no key is configured", async () => {
        env.GEMINI_API_KEY = undefined;
        const { translateOfficialXPost } = await load();
        await expect(translateOfficialXPost(text, links)).resolves.toBeNull();
        expect(generateContent).not.toHaveBeenCalled();
    });

    it("sends masked text with the glossary instruction and restores links in both languages", async () => {
        generateContent.mockResolvedValueOnce({
            text: JSON.stringify({
                ko: "【 Real 채보 추가 】\n『Just Be Friends』에 “Real” 채보가 추가. #ノスタルジア\n\n[[LINK_1]] [[LINK_2]]",
                en: "[[LINK_1]] [[LINK_2]]",
            }),
        });
        const { translateOfficialXPost, OFFICIAL_X_TRANSLATION_MODEL } =
            await load();
        const result = await translateOfficialXPost(text, links);
        expect(result).toEqual({
            ko: "【 Real 채보 추가 】\n『Just Be Friends』에 “Real” 채보가 추가. #ノスタルジア\n\nhttps://t.co/98Ze9MjIOV https://t.co/4I9QNGPXxb",
            en: "https://t.co/98Ze9MjIOV https://t.co/4I9QNGPXxb",
        });
        const params = generateContent.mock.calls[0]![0];
        expect(params.model).toBe(OFFICIAL_X_TRANSLATION_MODEL);
        expect(params.contents).not.toContain("t.co");
        expect(params.config.responseMimeType).toBe("application/json");
        expect(params.config.systemInstruction).toContain("譜面 → 채보");
    });

    it.each([
        ["malformed JSON", "not json"],
        ["missing field", JSON.stringify({ ko: "만" })],
        ["blank field", JSON.stringify({ ko: " ", en: "x" })],
        ["no text", undefined],
    ])(
        "returns null on %s so the card falls back to the original",
        async (_, raw) => {
            generateContent.mockResolvedValueOnce({ text: raw });
            const { translateOfficialXPost } = await load();
            await expect(
                translateOfficialXPost(text, links)
            ).resolves.toBeNull();
        }
    );

    // 2026-09-23 — 첫 모델이 그 키에서 404 로 막히자 나머지를 시도조차 안 해 번역이 멈췄다
    it("falls through to the next model when a model is unavailable for the key", async () => {
        const { ApiError } = await import("@google/genai");
        generateContent
            .mockRejectedValueOnce(
                new ApiError({ status: 404, message: "model not found" })
            )
            .mockRejectedValueOnce(
                new ApiError({ status: 403, message: "forbidden" })
            )
            .mockResolvedValueOnce({
                text: JSON.stringify({ ko: "한", en: "en" }),
            });
        const { translateOfficialXPost, OFFICIAL_X_TRANSLATION_MODELS } =
            await load();
        await expect(translateOfficialXPost(text, links)).resolves.toEqual({
            ko: "한",
            en: "en",
        });
        expect(generateContent.mock.calls.map((call) => call[0].model)).toEqual(
            [...OFFICIAL_X_TRANSLATION_MODELS]
        );
    });

    // 시간 초과 · 네트워크 오류는 ApiError 가 아니다 — 그래도 다음 모델로 넘어가야 한다(2026-09-24)
    it("falls through to the next model on a timeout", async () => {
        generateContent
            .mockRejectedValueOnce(
                Object.assign(
                    new Error("The operation was aborted due to timeout"),
                    {
                        name: "TimeoutError",
                    }
                )
            )
            .mockResolvedValueOnce({
                text: JSON.stringify({ ko: "한", en: "en" }),
            });
        const { translateOfficialXPost, OFFICIAL_X_TRANSLATION_MODELS } =
            await load();
        await expect(translateOfficialXPost(text, links)).resolves.toEqual({
            ko: "한",
            en: "en",
        });
        expect(generateContent.mock.calls.map((call) => call[0].model)).toEqual(
            OFFICIAL_X_TRANSLATION_MODELS.slice(0, 2)
        );
    });

    it("falls through to the next model on 503/429 and stops on other errors", async () => {
        const { ApiError } = await import("@google/genai");
        generateContent
            .mockRejectedValueOnce(
                new ApiError({ status: 503, message: "busy" })
            )
            .mockRejectedValueOnce(
                new ApiError({ status: 429, message: "quota" })
            )
            .mockResolvedValueOnce({
                text: JSON.stringify({ ko: "한", en: "en" }),
            });
        const { translateOfficialXPost, OFFICIAL_X_TRANSLATION_MODELS } =
            await load();
        await expect(translateOfficialXPost(text, links)).resolves.toEqual({
            ko: "한",
            en: "en",
        });
        expect(generateContent.mock.calls.map((call) => call[0].model)).toEqual(
            [...OFFICIAL_X_TRANSLATION_MODELS]
        );

        generateContent.mockReset();
        generateContent.mockRejectedValueOnce(
            new ApiError({ status: 400, message: "bad key" })
        );
        await expect(translateOfficialXPost(text, links)).resolves.toBeNull();
        expect(generateContent).toHaveBeenCalledTimes(1);
    });

    it("returns null when every model fails", async () => {
        generateContent.mockRejectedValue(new Error("network"));
        const { translateOfficialXPost } = await load();
        await expect(translateOfficialXPost(text, links)).resolves.toBeNull();
    });
});
