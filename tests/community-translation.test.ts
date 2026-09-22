import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
    env: { GEMINI_API_KEY: "key" as string | undefined },
    generate: vi.fn(),
    opinionFind: vi.fn(),
    opinionUpdate: vi.fn(),
    replyFind: vi.fn(),
    replyUpdate: vi.fn(),
}));

vi.mock("@/lib/env/server", () => ({ serverEnv: mocks.env }));
vi.mock("@google/genai", () => ({
    ApiError: class extends Error {
        status = 500;
    },
    GoogleGenAI: class {
        models = { generateContent: mocks.generate };
    },
}));
vi.mock("@/lib/db", () => ({
    default: {
        communityChartEvaluation: {
            findFirst: mocks.opinionFind,
            updateMany: mocks.opinionUpdate,
        },
        communityOpinionReply: {
            findFirst: mocks.replyFind,
            updateMany: mocks.replyUpdate,
        },
    },
}));

import { detectTextLanguage } from "@/lib/i18n/textLanguage";
import {
    fillCommunityTranslations,
    getCommunityTranslation,
} from "@/features/music/server/communityTranslation";

describe("의견 글 언어 판별", () => {
    it("글자 종류로 가린다", () => {
        expect(detectTextLanguage("후반 트릴이 어려워요")).toBe("ko");
        expect(detectTextLanguage("後半のトリルが重い")).toBe("ja");
        expect(detectTextLanguage("縦連注意")).toBe("ja");
        expect(detectTextLanguage("Nice chart!")).toBe("en");
        // 한국어 글에 곡 제목(가나)이 섞여도 한국어
        expect(detectTextLanguage("アクアリウム 후반이 제일 어렵네요")).toBe(
            "ko"
        );
        expect(detectTextLanguage("990k 🎹")).toBeNull();
        expect(detectTextLanguage("12345 !!")).toBeNull();
    });
});

describe("의견 번역 — 올릴 때 한 번 번역해 저장(2026-09-22)", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mocks.env.GEMINI_API_KEY = "key";
        mocks.opinionFind.mockResolvedValue({
            opinion: "後半のトリルが重い",
            opinionTranslations: null,
        });
        mocks.generate.mockResolvedValue({
            text: JSON.stringify({
                ko: "후반 트릴이 무겁다",
                en: "The late trills are heavy",
            }),
        });
    });

    it("글 언어를 뺀 두 언어를 한 번에 만들고, 본문이 그대로일 때만 저장한다", async () => {
        await expect(fillCommunityTranslations("opinion", 1)).resolves.toEqual({
            ko: "후반 트릴이 무겁다",
            en: "The late trills are heavy",
        });
        expect(mocks.generate).toHaveBeenCalledTimes(1);
        expect(mocks.opinionUpdate).toHaveBeenCalledWith({
            where: { id: 1, opinion: "後半のトリルが重い" },
            data: {
                opinionTranslations: {
                    ko: "후반 트릴이 무겁다",
                    en: "The late trills are heavy",
                },
            },
        });
    });

    it("저장된 번역이 있으면 외부를 부르지 않는다", async () => {
        mocks.opinionFind.mockResolvedValue({
            opinion: "後半のトリルが重い",
            opinionTranslations: { ko: "저장된 번역", en: "Stored" },
        });
        await expect(
            getCommunityTranslation({ kind: "opinion", id: 1, locale: "ko" })
        ).resolves.toBe("저장된 번역");
        await fillCommunityTranslations("opinion", 1);
        expect(mocks.generate).not.toHaveBeenCalled();
    });

    it("번역이 없던 글은 「번역 보기」 때 한 번 만들어 쓴다", async () => {
        await expect(
            getCommunityTranslation({ kind: "opinion", id: 1, locale: "en" })
        ).resolves.toBe("The late trills are heavy");
        expect(mocks.generate).toHaveBeenCalledTimes(1);
    });

    it("키가 없으면 번역하지 않는다", async () => {
        mocks.env.GEMINI_API_KEY = undefined;
        await expect(fillCommunityTranslations("reply", 2)).resolves.toBeNull();
        await expect(
            getCommunityTranslation({ kind: "reply", id: 2, locale: "en" })
        ).rejects.toMatchObject({ code: "unavailable" });
        expect(mocks.generate).not.toHaveBeenCalled();
    });
});
