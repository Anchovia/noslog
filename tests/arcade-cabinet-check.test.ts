import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
    session: { id: 9 as number | undefined },
    cabinet: vi.fn(),
    recent: vi.fn(),
    create: vi.fn(),
    revalidate: vi.fn(),
    tag: vi.fn(),
}));
vi.mock("@/lib/session", () => ({ default: async () => mocks.session }));
vi.mock("@/lib/db", () => ({
    default: {
        arcadeCabinet: { findFirst: mocks.cabinet },
        arcadeCabinetCheck: { findFirst: mocks.recent, create: mocks.create },
    },
}));
vi.mock("next/cache", () => ({
    revalidatePath: mocks.revalidate,
    updateTag: mocks.tag,
}));
vi.mock("@/lib/observability/server", () => ({ logServerError: vi.fn() }));

import { confirmCabinetRunning } from "@/features/arcades/server/cabinetCheckService";

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
