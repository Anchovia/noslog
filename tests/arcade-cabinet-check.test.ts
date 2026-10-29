import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
    session: { id: 9 as number | undefined },
    cabinet: vi.fn(),
    recent: vi.fn(),
    create: vi.fn(),
    list: vi.fn(),
    revalidate: vi.fn(),
    tag: vi.fn(),
}));
vi.mock("@/lib/session", () => ({ default: async () => mocks.session }));
vi.mock("@/lib/db", () => ({
    default: {
        arcadeCabinet: { findFirst: mocks.cabinet },
        arcadeCabinetCheck: {
            findFirst: mocks.recent,
            create: mocks.create,
            findMany: mocks.list,
        },
    },
}));
vi.mock("next/cache", () => ({
    revalidatePath: mocks.revalidate,
    updateTag: mocks.tag,
}));
vi.mock("@/lib/observability/server", () => ({ logServerError: vi.fn() }));

import {
    confirmCabinetRunning,
    getRecentCabinetChecks,
} from "@/features/arcades/server/cabinet-check-service";

describe("cabinet running check", () => {
    beforeEach(() => {
        vi.resetAllMocks();
        mocks.session.id = 9;
        mocks.cabinet.mockResolvedValue({
            id: 4,
            arcade: { id: 2, publicDetails: { slug: "round1" } },
        });
        mocks.recent.mockResolvedValue(null);
        mocks.create.mockResolvedValue({
            checkedAt: new Date("2026-09-12T03:00:00Z"),
        });
    });
    it("requires login before touching the database", async () => {
        mocks.session.id = undefined;
        const result = await confirmCabinetRunning(4, "ko");
        expect(result.success).toBe(false);
        expect(mocks.cabinet).not.toHaveBeenCalled();
        expect(mocks.create).not.toHaveBeenCalled();
    });
    it("rejects an inactive or unknown cabinet", async () => {
        mocks.cabinet.mockResolvedValue(null);
        const result = await confirmCabinetRunning(4, "ko");
        expect(result.success).toBe(false);
        expect(mocks.create).not.toHaveBeenCalled();
    });
    it("records one check and refreshes the list and the arcade page", async () => {
        const result = await confirmCabinetRunning(4, "en");
        expect(result).toMatchObject({
            success: true,
            checkedAt: "2026-09-12T03:00:00.000Z",
        });
        expect(mocks.create).toHaveBeenCalledWith({
            data: { cabinetId: 4, userId: 9 },
            select: { checkedAt: true },
        });
        expect(mocks.tag).toHaveBeenCalledWith("arcades");
        const paths = mocks.revalidate.mock.calls.map((call) => call[0]);
        expect(paths).toEqual(
            expect.arrayContaining([
                "/gamecenter",
                "/gamecenter/round1",
                "/en/gamecenter/round1",
            ])
        );
    });
    it("does not write a second check within a day for the same person", async () => {
        mocks.recent.mockResolvedValue({
            checkedAt: new Date("2026-09-12T01:00:00Z"),
        });
        const result = await confirmCabinetRunning(4, "ko");
        expect(result).toMatchObject({
            success: true,
            checkedAt: "2026-09-12T01:00:00.000Z",
        });
        expect(mocks.create).not.toHaveBeenCalled();
    });
});

describe("오락실 최근 확인 목록", () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });
    const row = (
        userId: number,
        checkedAt: string,
        user: { username: string | null; hidePreferredArcade: boolean }
    ) => ({
        userId,
        checkedAt: new Date(checkedAt),
        user,
        cabinet: { position: 0, label: null },
    });
    it("선호 오락실을 숨긴 사람은 이름 · id 없이 날짜 · 기체만 내보낸다", async () => {
        mocks.list.mockResolvedValue([
            row(31, "2026-09-12T03:00:00Z", {
                username: "hidden-player",
                hidePreferredArcade: true,
            }),
            row(32, "2026-09-11T03:00:00Z", {
                username: "public-player",
                hidePreferredArcade: false,
            }),
            row(31, "2026-09-10T03:00:00Z", {
                username: "hidden-player",
                hidePreferredArcade: true,
            }),
        ]);
        const checks = await getRecentCabinetChecks(2);
        expect(mocks.list.mock.calls[0][0].select.user).toEqual({
            select: { username: true, hidePreferredArcade: true },
        });
        expect(checks).toEqual([
            {
                username: null,
                userId: null,
                cabinetPosition: 0,
                cabinetLabel: null,
                checkedAt: "2026-09-12T03:00:00.000Z",
            },
            {
                username: "public-player",
                userId: 32,
                cabinetPosition: 0,
                cabinetLabel: null,
                checkedAt: "2026-09-11T03:00:00.000Z",
            },
        ]);
        const payload = JSON.stringify(checks);
        expect(payload).not.toContain("hidden-player");
        expect(payload).not.toContain("31");
    });
});
