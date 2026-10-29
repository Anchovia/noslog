import { beforeEach, describe, expect, it, vi } from "vitest";

import { ApiError } from "@/lib/api/response";
import { createTranslator, getMessages } from "@/lib/i18n/messages";

const mocks = vi.hoisted(() => ({
    mutate: vi.fn(),
    fill: vi.fn(),
    translate: vi.fn(),
    session: vi.fn(),
    after: vi.fn(),
    log: vi.fn(),
}));

vi.mock("@/features/music/server/community-mutation", () => ({
    mutateChartCommunity: mocks.mutate,
}));
vi.mock("@/features/music/server/community-translation", () => ({
    fillCommunityTranslations: mocks.fill,
    getCommunityTranslation: mocks.translate,
}));
vi.mock("@/lib/session", () => ({ default: mocks.session }));
vi.mock("next/cache", () => ({ updateTag: vi.fn() }));
vi.mock("next/server", () => ({ after: mocks.after }));
vi.mock("@/lib/observability/server", () => ({ logServerError: mocks.log }));

import {
    saveChartContribution,
    translateChartContribution,
} from "@/app/(site)/music/community-actions";

const t = createTranslator(getMessages("ko"));
const request = { kind: "opinion", id: 1, locale: "en" } as const;

describe("이용자 글 번역 요청", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("passes a guest as null so only stored translations come back", async () => {
        mocks.session.mockResolvedValue({});
        mocks.translate.mockRejectedValue(
            new ApiError("translation_login_required", "login")
        );
        await expect(
            translateChartContribution(request, "ko")
        ).resolves.toEqual({
            success: false,
            message: t("community.action.login"),
        });
        expect(mocks.translate).toHaveBeenCalledWith({
            ...request,
            userId: null,
        });
    });

    it("tells a signed-in person when the hourly translations are used up", async () => {
        mocks.session.mockResolvedValue({ id: 7 });
        mocks.translate.mockRejectedValue(
            new ApiError("translation_limit_reached", "dailyLimit")
        );
        await expect(
            translateChartContribution(request, "ko")
        ).resolves.toEqual({
            success: false,
            message: t("community.dailyLimit"),
        });
        expect(mocks.translate).toHaveBeenCalledWith({ ...request, userId: 7 });
        expect(mocks.log).not.toHaveBeenCalled();
    });
});

describe("답글 쓰기 · 글 저장 뒤 번역의 한도", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mocks.session.mockResolvedValue({ id: 7 });
    });

    it("returns community.dailyLimit when the daily reply limit is reached", async () => {
        mocks.mutate.mockRejectedValue(
            new ApiError("reply_daily_limit", "dailyLimit")
        );
        await expect(
            saveChartContribution({ action: "reply-save" }, "ko")
        ).resolves.toEqual({
            success: false,
            message: t("community.dailyLimit"),
        });
        expect(mocks.log).not.toHaveBeenCalled();
    });

    it("translates after saving with the writer's quota and skips quietly at the limit", async () => {
        mocks.mutate.mockResolvedValue({
            chartId: 5,
            translate: { kind: "reply", id: 31 },
        });
        await saveChartContribution({ action: "reply-save" }, "ko");
        const background = mocks.after.mock.calls[0][0] as () => Promise<void>;

        mocks.fill.mockRejectedValueOnce(
            new ApiError("translation_limit_reached", "dailyLimit")
        );
        await background();
        expect(mocks.fill).toHaveBeenCalledWith("reply", 31, 7);
        expect(mocks.log).not.toHaveBeenCalled();

        const failure = new Error("model unavailable");
        mocks.fill.mockRejectedValueOnce(failure);
        await background();
        expect(mocks.log).toHaveBeenCalledWith(failure, {
            event: "music-community.translate.failed",
        });
    });
});
