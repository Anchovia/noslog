import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
    count: vi.fn(),
    findFirst: vi.fn(),
    groupBy: vi.fn(),
    session: vi.fn(),
}));

vi.mock("@/lib/db", () => ({
    default: {
        chartFieldProposal: {
            count: mocks.count,
            findFirst: mocks.findFirst,
            groupBy: mocks.groupBy,
        },
    },
}));
vi.mock("@/lib/session", () => ({ default: mocks.session }));
vi.mock("@/lib/admin", () => ({ requireAdmin: vi.fn() }));
vi.mock("next/cache", () => ({
    revalidatePath: vi.fn(),
    updateTag: vi.fn(),
}));

import {
    countMyChartFieldProposals,
    getChartFieldQueueStatus,
} from "@/features/contributions/server/chartFieldProposalService";

const NOW = new Date("2026-10-01T03:00:00Z"); // 서울 10/1 12:00

describe("기여 대기 현황 · 내 제안 수", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mocks.session.mockResolvedValue({ id: 7 });
    });

    it("대기 수와 가장 오래 기다린 날수를 준다", async () => {
        mocks.count.mockResolvedValue(4);
        mocks.findFirst.mockResolvedValue({
            createdAt: new Date("2026-09-25T03:00:00Z"),
        });
        expect(await getChartFieldQueueStatus(NOW)).toEqual({
            pending: 4,
            oldestDays: 6,
        });
    });

    it("오늘 들어온 제안만 있으면 날수는 0", async () => {
        mocks.count.mockResolvedValue(1);
        mocks.findFirst.mockResolvedValue({
            createdAt: new Date("2026-10-01T01:00:00Z"),
        });
        expect((await getChartFieldQueueStatus(NOW)).oldestDays).toBe(0);
    });

    it("대기가 없으면 날수를 두지 않는다", async () => {
        mocks.count.mockResolvedValue(0);
        mocks.findFirst.mockResolvedValue(null);
        expect(await getChartFieldQueueStatus(NOW)).toEqual({
            pending: 0,
            oldestDays: null,
        });
    });

    it("내 제안은 상태별로 세고, 없는 상태는 0 으로 남긴다", async () => {
        mocks.groupBy.mockResolvedValue([
            { status: "pending", _count: { _all: 2 } },
            { status: "applied", _count: { _all: 7 } },
            // 모르는 상태는 버린다
            { status: "withdrawn", _count: { _all: 3 } },
        ]);
        expect(await countMyChartFieldProposals()).toEqual({
            pending: 2,
            applied: 7,
            rejected: 0,
        });
    });

    it("로그인하지 않았으면 조회 없이 0", async () => {
        mocks.session.mockResolvedValue({});
        expect(await countMyChartFieldProposals()).toEqual({
            pending: 0,
            applied: 0,
            rejected: 0,
        });
        expect(mocks.groupBy).not.toHaveBeenCalled();
    });
});
