import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
const mocks = vi.hoisted(() => ({
    plays: vi.fn(),
    find: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
    user: vi.fn(),
}));
vi.mock("@/lib/db", () => ({
    default: {
        playData: { findMany: mocks.plays },
        $transaction: (operation: (tx: unknown) => unknown) =>
            operation({
                user: { update: mocks.user },
                userBestGrade: {
                    findMany: mocks.find,
                    create: mocks.create,
                    update: mocks.update,
                    deleteMany: mocks.remove,
                },
            }),
    },
}));
import { updateGrade } from "@/lib/services/user/updateGrade";

describe("profile Grd history retention", () => {
    beforeEach(() => {
        vi.resetAllMocks();
        vi.useFakeTimers();
        vi.setSystemTime(new Date("2026-09-07T12:00:00Z"));
        vi.spyOn(console, "info").mockImplementation(() => {});
        mocks.plays.mockResolvedValue([]);
    });
    afterEach(() => {
        vi.useRealTimers();
        vi.restoreAllMocks();
    });
    const older = Array.from({ length: 40 }, (_, id) => ({
        id: id + 1,
        besttime: new Date(Date.UTC(2026, 6, id + 1))
            .toISOString()
            .slice(0, 10),
    }));
    it("keeps older meaningful history beyond thirty records", async () => {
        mocks.find.mockResolvedValue(older);
        await updateGrade(7);
        expect(mocks.create).toHaveBeenCalledWith({
            data: {
                user_id: 7,
                besttime: "2026-09-07",
                grade_basic: 0,
                grade_recital: 0,
            },
        });
        expect(mocks.remove).not.toHaveBeenCalled();
    });
    it("removes only duplicate observations on the current Korean calendar day", async () => {
        mocks.find.mockResolvedValue([
            ...older,
            { id: 100, besttime: "2026-09-07 01:00" },
            { id: 101, besttime: "2026-09-07 09:00" },
        ]);
        await updateGrade(7);
        expect(mocks.remove).toHaveBeenCalledTimes(1);
        expect(mocks.remove).toHaveBeenCalledWith({
            where: { id: { in: [100] } },
        });
        expect(mocks.create).not.toHaveBeenCalled();
    });
});
