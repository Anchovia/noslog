import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
    env: { GEMINI_API_KEY: "key" as string | undefined },
    generate: vi.fn(),
    opinionFind: vi.fn(),
    opinionUpdate: vi.fn(),
    replyFind: vi.fn(),
    replyUpdate: vi.fn(),
    claim: vi.fn(),
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
vi.mock("@/lib/upload-rate-limit", () => ({
    claimUploadTokenQuota: mocks.claim,
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

import { detectTextLanguage } from "@/lib/i18n/text-language";
import {
    fillCommunityTranslations,
    getCommunityTranslation,
} from "@/features/music/server/community-translation";

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
        mocks.claim.mockResolvedValue({ allowed: true, grantId: 1 });
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
        await expect(
            fillCommunityTranslations("opinion", 1, 7)
        ).resolves.toEqual({
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
            getCommunityTranslation({
                kind: "opinion",
                id: 1,
                locale: "ko",
                userId: 7,
            })
        ).resolves.toBe("저장된 번역");
        await fillCommunityTranslations("opinion", 1, 7);
        expect(mocks.generate).not.toHaveBeenCalled();
        expect(mocks.claim).not.toHaveBeenCalled();
    });

    it("번역이 없던 글은 「번역 보기」 때 한 번 만들어 쓴다", async () => {
        await expect(
            getCommunityTranslation({
                kind: "opinion",
                id: 1,
                locale: "en",
                userId: 7,
            })
        ).resolves.toBe("The late trills are heavy");
        expect(mocks.generate).toHaveBeenCalledTimes(1);
    });

    it("키가 없으면 번역하지 않는다", async () => {
        mocks.env.GEMINI_API_KEY = undefined;
        await expect(
            fillCommunityTranslations("reply", 2, 7)
        ).resolves.toBeNull();
        await expect(
            getCommunityTranslation({
                kind: "reply",
                id: 2,
                locale: "en",
                userId: 7,
            })
        ).rejects.toMatchObject({ code: "unavailable" });
        expect(mocks.generate).not.toHaveBeenCalled();
    });
});

describe("번역 생성 — 손님은 저장된 번역만, 로그인 사용자는 시간당 한도", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mocks.env.GEMINI_API_KEY = "key";
        mocks.claim.mockResolvedValue({ allowed: true, grantId: 1 });
        mocks.opinionFind.mockResolvedValue({
            opinion: "後半のトリルが重い",
            opinionTranslations: { ko: "저장된 번역" },
        });
        mocks.generate.mockResolvedValue({
            text: JSON.stringify({
                ko: "후반 트릴이 무겁다",
                en: "The late trills are heavy",
            }),
        });
    });

    it("gives a guest the stored translation without calling the model", async () => {
        await expect(
            getCommunityTranslation({
                kind: "opinion",
                id: 1,
                locale: "ko",
                userId: null,
            })
        ).resolves.toBe("저장된 번역");
        expect(mocks.claim).not.toHaveBeenCalled();
        expect(mocks.generate).not.toHaveBeenCalled();
    });

    it("refuses to create a missing translation for a guest", async () => {
        await expect(
            getCommunityTranslation({
                kind: "opinion",
                id: 1,
                locale: "en",
                userId: null,
            })
        ).rejects.toMatchObject({ code: "login" });
        expect(mocks.claim).not.toHaveBeenCalled();
        expect(mocks.generate).not.toHaveBeenCalled();
        expect(mocks.opinionUpdate).not.toHaveBeenCalled();
    });

    it("spends one of the signed-in person's hourly translations per model call", async () => {
        await expect(
            getCommunityTranslation({
                kind: "opinion",
                id: 1,
                locale: "en",
                userId: 7,
            })
        ).resolves.toBe("The late trills are heavy");
        expect(mocks.claim).toHaveBeenCalledTimes(1);
        expect(mocks.claim).toHaveBeenCalledWith(7, "community-translation");
    });

    it("stops before the model when the hourly limit is used up", async () => {
        mocks.claim.mockResolvedValue({ allowed: false, grantId: null });
        await expect(
            getCommunityTranslation({
                kind: "opinion",
                id: 1,
                locale: "en",
                userId: 7,
            })
        ).rejects.toMatchObject({ code: "dailyLimit" });
        await expect(
            fillCommunityTranslations("opinion", 1, 7)
        ).rejects.toMatchObject({ code: "dailyLimit" });
        expect(mocks.generate).not.toHaveBeenCalled();
        expect(mocks.opinionUpdate).not.toHaveBeenCalled();
    });
});
