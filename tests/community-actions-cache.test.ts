import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
    mutate: vi.fn(),
    updateTag: vi.fn(),
    session: vi.fn(),
}));

vi.mock("@/features/music/server/community-mutation", () => ({
    mutateChartCommunity: mocks.mutate,
}));
vi.mock("@/features/music/server/community-translation", () => ({
    fillCommunityTranslations: vi.fn(),
    getCommunityTranslation: vi.fn(),
}));
vi.mock("@/lib/session", () => ({ default: mocks.session }));
vi.mock("next/cache", () => ({ updateTag: mocks.updateTag }));
vi.mock("next/server", () => ({ after: vi.fn() }));
vi.mock("@/lib/observability/server", () => ({ logServerError: vi.fn() }));

import { saveChartContribution } from "@/app/(site)/music/community-actions";

describe("커뮤니티 쓰기의 캐시 무효화", () => {
    beforeEach(() => {
        mocks.session.mockResolvedValue({ id: 1 });
        mocks.mutate.mockResolvedValue({ chartId: 5 });
    });

    it.each([
        "save-evaluation",
        "delete-evaluation",
        "save-vote",
        "delete-vote",
    ])("%s clears only that chart's shared cache", async (action) => {
        const result = await saveChartContribution({ action }, "ko");

        expect(result.success).toBe(true);
        expect(mocks.updateTag).toHaveBeenCalledTimes(1);
        expect(mocks.updateTag).toHaveBeenCalledWith("chart-evaluations-5");
    });

    it.each([
        "helpful",
        "report",
        "reply-save",
        "reply-like",
        "delete-opinion",
    ])("%s leaves the shared caches alone", async (action) => {
        await saveChartContribution({ action }, "ko");

        expect(mocks.updateTag).not.toHaveBeenCalled();
    });
});
