import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
    session: { id: 9 as number | undefined },
    existing: vi.fn(),
    arcade: vi.fn(),
    save: vi.fn(),
    image: vi.fn(),
    invalidate: vi.fn(),
}));
vi.mock("@/lib/session", () => ({ default: async () => mocks.session }));
vi.mock("@/lib/db", () => ({
    default: {
        feedbackReport: { findUnique: mocks.existing, upsert: mocks.save },
        arcade: { findFirst: mocks.arcade },
    },
}));
vi.mock("@/lib/blob", () => ({ isValidPrivateImageBlob: mocks.image }));
vi.mock("next/cache", () => ({ revalidatePath: mocks.invalidate }));
vi.mock("@/lib/observability/server", () => ({ logServerError: vi.fn() }));

import { submitArcadeReport } from "@/features/arcades/server/arcadeReportService";

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
            where: { id: 3, is_active: true },
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
