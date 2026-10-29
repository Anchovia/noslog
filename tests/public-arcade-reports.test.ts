import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ findMany: vi.fn() }));

vi.mock("@/lib/db", () => ({
    default: { arcade: { findMany: mocks.findMany } },
}));
vi.mock("next/cache", () => ({ unstable_cache: (run: unknown) => run }));

import { getPublicArcades } from "@/features/arcades/server/public-arcade-service";

const reportedAt = (iso: string, userId: number) => ({
    createdAt: new Date(iso),
    userId,
});

function arcadeRecord(reports: ReturnType<typeof reportedAt>[]) {
    return {
        id: 3,
        name: "Test arcade",
        latitude: null,
        longitude: null,
        playPrice: null,
        coinCount: null,
        notes: null,
        businessHours: null,
        publicDetails: null,
        publicPhotos: [],
        _count: { users: 0 },
        cabinets: [
            {
                id: 4,
                label: null,
                position: 0,
                availability: "unknown",
                condition: "unknown",
                note: null,
                conditionNote: null,
                tags: [],
                keyWeight: null,
                screenLag: null,
                soundVolume: null,
                featureNote: null,
                verifiedAt: null,
                validUntil: null,
                checks: [],
                reports,
            },
        ],
    };
}

describe("공개 오락실 화면의 열린 신고 수", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("counts one report per person for the same cabinet", async () => {
        mocks.findMany.mockResolvedValue([
            arcadeRecord([
                reportedAt("2026-10-20T00:00:00.000Z", 1),
                reportedAt("2026-10-21T00:00:00.000Z", 1),
                reportedAt("2026-10-22T00:00:00.000Z", 1),
                reportedAt("2026-10-23T00:00:00.000Z", 2),
            ]),
        ]);

        const [arcade] = await getPublicArcades();

        expect(arcade.cabinets[0]).toMatchObject({
            openReports: 2,
            latestReportAt: "2026-10-23T00:00:00.000Z",
        });
        expect(
            mocks.findMany.mock.calls[0][0].include.cabinets.include.reports
                .select
        ).toEqual({ createdAt: true, userId: true });
    });
});
