import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
    session: { id: 9 as number | undefined },
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    count: vi.fn(),
    findChart: vi.fn(),
}));

vi.mock("server-only", () => ({}));
vi.mock("next/cache", () => ({
    revalidatePath: vi.fn(),
    revalidateTag: vi.fn(),
    unstable_cache: (fn: unknown) => fn,
}));
vi.mock("@/lib/session", () => ({ default: async () => mocks.session }));
vi.mock("@/lib/db", () => ({
    default: {
        chartDraft: {
            findUnique: mocks.findUnique,
            create: mocks.create,
            update: mocks.update,
        },
        musicChart: { findUnique: mocks.findChart },
        $transaction: (run: (tx: unknown) => unknown) =>
            run({
                $executeRaw: vi.fn(),
                chartDraft: {
                    count: mocks.count,
                    create: mocks.create,
                    update: mocks.update,
                },
            }),
    },
}));

import {
    findMyOpenChartDraft,
    openMyChartDraft,
} from "@/features/contributions/server/chart-draft-service";
import { createDefaultChartDocument } from "@/lib/chart-pattern/schema";

function row(status: string) {
    return {
        id: 3,
        chartId: 5,
        status,
        version: 2,
        content: createDefaultChartDocument({ bpm: 120, durationMs: 0 }),
        baseRevision: null,
        submittedAt: null,
        updatedAt: new Date("2026-11-02T00:00:00Z"),
    };
}

describe("초안 화면 GET 은 DB 에 쓰지 않는다", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mocks.session.id = 9;
    });

    it("초안이 없으면 만들지 않고 null", async () => {
        mocks.findUnique.mockResolvedValue(null);
        await expect(findMyOpenChartDraft(5)).resolves.toBeNull();
        expect(mocks.create).not.toHaveBeenCalled();
    });

    it("공개까지 끝난 초안은 되돌리지 않고 null", async () => {
        mocks.findUnique.mockResolvedValue(row("approved"));
        await expect(findMyOpenChartDraft(5)).resolves.toBeNull();
        expect(mocks.update).not.toHaveBeenCalled();
    });

    it("고칠 수 있는 초안은 그대로 돌려준다", async () => {
        mocks.findUnique.mockResolvedValue(row("changes_requested"));
        await expect(findMyOpenChartDraft(5)).resolves.toMatchObject({
            id: 3,
            status: "changes_requested",
            version: 2,
        });
        expect(mocks.create).not.toHaveBeenCalled();
        expect(mocks.update).not.toHaveBeenCalled();
    });

    it("비로그인은 조회하지 않는다", async () => {
        mocks.session.id = undefined;
        await expect(findMyOpenChartDraft(5)).resolves.toBeNull();
        expect(mocks.findUnique).not.toHaveBeenCalled();
    });
});

describe("공개 전 초안 수 한도", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mocks.session.id = 9;
        mocks.findChart.mockResolvedValue({
            id: 5,
            bpmMin: 120,
            durationSeconds: 0,
            pattern: null,
        });
    });

    it("50개가 차면 새 초안을 만들지 않는다", async () => {
        mocks.findUnique.mockResolvedValue(null);
        mocks.count.mockResolvedValue(50);
        await expect(openMyChartDraft(5)).resolves.toBe("limit");
        expect(mocks.create).not.toHaveBeenCalled();
    });

    it("공개까지 끝난 초안을 다시 여는 것도 센다", async () => {
        mocks.findUnique.mockResolvedValue(row("approved"));
        mocks.count.mockResolvedValue(50);
        await expect(openMyChartDraft(5)).resolves.toBe("limit");
        expect(mocks.update).not.toHaveBeenCalled();
    });

    it("이미 있는 초안은 한도가 차도 열린다", async () => {
        mocks.findUnique.mockResolvedValue(row("draft"));
        mocks.count.mockResolvedValue(50);
        await expect(openMyChartDraft(5)).resolves.toMatchObject({ id: 3 });
    });

    it("한도 안이면 만든다", async () => {
        mocks.findUnique.mockResolvedValue(null);
        mocks.count.mockResolvedValue(49);
        mocks.create.mockResolvedValue(row("draft"));
        await expect(openMyChartDraft(5)).resolves.toMatchObject({ id: 3 });
    });
});
