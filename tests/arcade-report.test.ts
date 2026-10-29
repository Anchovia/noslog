import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
    session: { id: 9 as number | undefined },
    existing: vi.fn(),
    arcade: vi.fn(),
    save: vi.fn(),
    count: vi.fn(),
    lock: vi.fn(),
    image: vi.fn(),
    invalidate: vi.fn(),
    tag: vi.fn(),
}));
vi.mock("@/lib/session", () => ({ default: async () => mocks.session }));
vi.mock("@/lib/db", () => {
    const tx = {
        $executeRaw: mocks.lock,
        feedbackReport: { count: mocks.count, upsert: mocks.save },
    };
    return {
        default: {
            feedbackReport: { findUnique: mocks.existing },
            arcade: { findFirst: mocks.arcade },
            $transaction: (run: (client: typeof tx) => unknown) => run(tx),
        },
    };
});
vi.mock("@/lib/blob", () => ({ isValidPrivateImageBlob: mocks.image }));
vi.mock("next/cache", () => ({
    revalidatePath: mocks.invalidate,
    updateTag: mocks.tag,
}));
vi.mock("@/lib/observability/server", () => ({ logServerError: vi.fn() }));

import { submitArcadeReport } from "@/features/arcades/server/arcade-report-service";

const submissionId = "12a66f29-6f4e-41b1-a8e1-e4f4c52b6c46";
function report(overrides: Record<string, string> = {}) {
    const data = new FormData();
    for (const [key, value] of Object.entries({
        arcadeId: "3",
        cabinetId: "",
        reportType: "other",
        content: "Please verify the listed opening hours.",
        imageUrl: "",
        submissionId,
        locale: "en",
        ...overrides,
    }))
        data.set(key, value);
    return data;
}

describe("P12 arcade report authorization and retries", () => {
    beforeEach(() => {
        vi.resetAllMocks();
        mocks.session.id = 9;
        mocks.existing.mockResolvedValue(null);
        mocks.arcade.mockResolvedValue({ name: "Test arcade", cabinets: [] });
        mocks.save.mockResolvedValue({ id: 1 });
        mocks.count.mockResolvedValue(0);
        mocks.image.mockResolvedValue(true);
    });
    it("rejects guests before reading or writing reports", async () => {
        mocks.session.id = undefined;
        expect((await submitArcadeReport(report())).success).toBe(false);
        expect(mocks.existing).not.toHaveBeenCalled();
        expect(mocks.save).not.toHaveBeenCalled();
    });
    it.each<Record<string, string>>([
        { content: "short" },
        { content: "x".repeat(1001) },
        { arcadeId: "0" },
        { reportType: "invented" },
        { submissionId: "invalid" },
        { cabinetId: "4", reportType: "hours" },
    ])(
        "rejects invalid report input %j before accessing data",
        async (values) => {
            expect((await submitArcadeReport(report(values))).success).toBe(
                false
            );
            expect(mocks.arcade).not.toHaveBeenCalled();
            expect(mocks.save).not.toHaveBeenCalled();
        }
    );
    it("requires an active venue and a cabinet belonging to that venue", async () => {
        mocks.arcade.mockResolvedValueOnce(null);
        expect((await submitArcadeReport(report())).success).toBe(false);
        expect(
            (
                await submitArcadeReport(
                    report({ cabinetId: "4", reportType: "condition" })
                )
            ).success
        ).toBe(false);
        expect(mocks.arcade).toHaveBeenLastCalledWith({
            where: { id: 3, isActive: true },
            select: {
                name: true,
                cabinets: {
                    where: { id: 4, isActive: true },
                    select: { id: true, label: true, position: true },
                },
            },
        });
        expect(mocks.save).not.toHaveBeenCalled();
    });
    it("rejects an attachment outside the authenticated user's private report prefix", async () => {
        const imageUrl = "https://example.com/another-user.webp";
        mocks.image.mockResolvedValue(false);
        expect((await submitArcadeReport(report({ imageUrl }))).success).toBe(
            false
        );
        expect(mocks.image).toHaveBeenCalledWith(imageUrl, "feedback/9/report");
        expect(mocks.save).not.toHaveBeenCalled();
    });
    it("records context for moderation without changing public arcade facts", async () => {
        expect(
            (await submitArcadeReport(report({ userId: "999" }))).success
        ).toBe(true);
        expect(mocks.save).toHaveBeenCalledWith(
            expect.objectContaining({
                where: { userId_submissionId: { userId: 9, submissionId } },
                create: expect.objectContaining({
                    userId: 9,
                    arcadeId: 3,
                    cabinetId: null,
                    arcadeReportType: "other",
                    imageUrl: null,
                }),
                update: {},
            })
        );
        expect(mocks.save.mock.calls[0][0].create.content).toContain(
            "Test arcade"
        );
        // 공개 오락실 화면의 열린 신고 수(캐시)도 비운다
        expect(mocks.tag).toHaveBeenCalledWith("arcades");
    });
    it("acknowledges the same user's completed submission without another write", async () => {
        mocks.existing.mockResolvedValue({ id: 1 });
        expect((await submitArcadeReport(report())).success).toBe(true);
        expect(mocks.existing).toHaveBeenCalledWith({
            where: { userId_submissionId: { userId: 9, submissionId } },
            select: { id: true },
        });
        expect(mocks.save).not.toHaveBeenCalled();
        expect(mocks.arcade).not.toHaveBeenCalled();
    });
    it("returns a retryable failure when storage fails", async () => {
        mocks.save.mockRejectedValue(new Error("database unavailable"));
        expect((await submitArcadeReport(report())).success).toBe(false);
        expect(mocks.invalidate).not.toHaveBeenCalled();
    });
});

describe("오락실 제보 하루 한도", () => {
    beforeEach(() => {
        vi.resetAllMocks();
        mocks.session.id = 9;
        mocks.existing.mockResolvedValue(null);
        mocks.arcade.mockResolvedValue({ name: "Test arcade", cabinets: [] });
        mocks.save.mockResolvedValue({ id: 1 });
        mocks.image.mockResolvedValue(true);
    });
    afterEach(() => {
        vi.useRealTimers();
    });

    it("counts this person's arcade reports of the last 24 hours under a per-person lock", async () => {
        vi.useFakeTimers({ now: new Date("2026-10-29T12:00:00.000Z") });
        mocks.count.mockResolvedValue(29);
        expect((await submitArcadeReport(report())).success).toBe(true);
        expect(mocks.lock.mock.calls[0].slice(1)).toEqual([
            "feedback-report:9",
        ]);
        expect(mocks.count).toHaveBeenCalledWith({
            where: {
                userId: 9,
                arcadeReportType: { not: null },
                createdAt: { gte: new Date("2026-10-28T12:00:00.000Z") },
            },
        });
        expect(mocks.save).toHaveBeenCalledTimes(1);
    });

    it("refuses the 31st report of the day without writing", async () => {
        mocks.count.mockResolvedValue(30);
        expect(await submitArcadeReport(report())).toEqual({
            success: false,
            message:
                "You've reached today's report limit. Send it again tomorrow.",
        });
        expect(mocks.save).not.toHaveBeenCalled();
        expect(mocks.tag).not.toHaveBeenCalled();
    });

    it("still acknowledges a retry of a report already saved at the limit", async () => {
        mocks.existing.mockResolvedValue({ id: 1 });
        mocks.count.mockResolvedValue(30);
        expect((await submitArcadeReport(report())).success).toBe(true);
        expect(mocks.count).not.toHaveBeenCalled();
    });
});
