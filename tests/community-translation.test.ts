import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
    env: { GEMINI_COMMUNITY_API_KEY: "paid-key" as string | undefined },
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
import { getCommunityTranslation } from "@/features/music/server/communityTranslation";

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

describe("의견 번역", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mocks.env.GEMINI_COMMUNITY_API_KEY = "paid-key";
        mocks.opinionFind.mockResolvedValue({
            opinion: "後半のトリルが重い",
            opinionTranslations: null,
        });
        mocks.generate.mockResolvedValue({
            text: JSON.stringify({ text: "후반 트릴이 무겁다" }),
        });
    });

    it("저장된 번역이 있으면 외부를 부르지 않는다", async () => {
        mocks.opinionFind.mockResolvedValue({
            opinion: "後半のトリルが重い",
            opinionTranslations: { ko: "저장된 번역" },
        });
        await expect(
            getCommunityTranslation({ kind: "opinion", id: 1, locale: "ko" })
        ).resolves.toBe("저장된 번역");
        expect(mocks.generate).not.toHaveBeenCalled();
    });

    it("처음이면 만들고, 본문이 그대로일 때만 저장한다", async () => {
        await expect(
            getCommunityTranslation({ kind: "opinion", id: 1, locale: "ko" })
        ).resolves.toBe("후반 트릴이 무겁다");
        expect(mocks.opinionUpdate).toHaveBeenCalledWith({
            where: { id: 1, opinion: "後半のトリルが重い" },
            data: { opinionTranslations: { ko: "후반 트릴이 무겁다" } },
        });
    });

    it("전용(결제) 키가 없으면 번역하지 않는다 — 무료 키로 이용자 글을 보내지 않는다", async () => {
        mocks.env.GEMINI_COMMUNITY_API_KEY = undefined;
        await expect(
            getCommunityTranslation({ kind: "reply", id: 2, locale: "en" })
        ).rejects.toMatchObject({ code: "unavailable" });
        expect(mocks.replyFind).not.toHaveBeenCalled();
        expect(mocks.generate).not.toHaveBeenCalled();
    });
});
