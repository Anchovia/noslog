import { describe, expect, it, vi } from "vitest";
const mocks = vi.hoisted(() => ({
    scores: vi.fn().mockResolvedValue([]),
    evaluation: vi.fn(),
}));
vi.mock("next/cache", () => ({ unstable_cache: (fn: unknown) => fn }));
vi.mock("@/lib/db", () => ({
    default: {
        playData: { findMany: mocks.scores },
        chartEvaluation: { aggregate: mocks.evaluation },
    },
}));
import { getCachedChartDetailStats } from "@/features/music/server/musicDetailData";
describe("detail score stats", () => {
    it.each([0, 7])(
        "only reads positive visible scores, including self %s",
        async (id) => {
            expect(await getCachedChartDetailStats(12, id)).toEqual({
                scores: [],
            });
            expect(mocks.scores).toHaveBeenCalledWith({
                where: {
                    chart_id: 12,
                    score: { gt: 0 },
                    user: { OR: [{ hide_play_scores: false }, { id }] },
                },
                select: { score: true, fc_type: true },
            });
            expect(mocks.evaluation).not.toHaveBeenCalled();
        }
    );
});
