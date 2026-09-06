import { beforeEach, describe, expect, it, vi } from "vitest";
import {
    parseTierBrowserQuery,
    serializeTierBrowserQuery,
} from "@/features/tiers/schemas/tierBrowserSchema";

const mocks = vi.hoisted(() => ({
    list: vi.fn(),
    band: vi.fn(),
    records: vi.fn(),
    preference: vi.fn(),
}));
vi.mock("next/cache", () => ({
    unstable_cache: (callback: unknown) => callback,
}));
vi.mock("@/lib/db", () => ({
    default: {
        tierList: { findFirst: mocks.list },
        playData: { findMany: mocks.records },
    },
}));
vi.mock("@/features/tiers/server/publicTierData", () => ({
    getCachedTierBand: mocks.band,
}));
vi.mock("@/lib/i18n/musicTitle", () => ({
    getMusicTitleDisplayPreference: mocks.preference,
    getLocalizedMusicTitle: () => null,
}));
import {
    getTierBrowserBand,
    getTierBrowserOverview,
} from "@/features/tiers/server/tierBrowserData";

const query = () => parseTierBrowserQuery(new URLSearchParams());
const chart = {
    difficulty: "Expert",
    level: 12,
    music: { index: "stulti", title: "STULTI", background: null },
};
function inventory(goal: string, mode: string) {
    return {
        id: 1,
        slug: `${mode}-${goal}`,
        description: null,
        updatedAt: new Date("2026-09-01"),
        bands: [
            {
                id: 11,
                position: 0,
                value: goal === "pianist" ? (mode === "basic" ? 10 : 14) : 1,
                entries: Array.from({ length: 70 }, (_, index) => ({
                    chartId: index + 1,
                    chart: {
                        ...chart,
                        difficulty: index === 1 ? "Real" : "Expert",
                        level: index === 1 ? 3 : 12,
                    },
                })),
            },
        ],
    };
}
beforeEach(() => {
    vi.resetAllMocks();
    mocks.preference.mockResolvedValue(true);
    mocks.list.mockImplementation(
        ({ where }: { where: { goal: string; mode: string } }) =>
            Promise.resolve(inventory(where.goal, where.mode))
    );
    mocks.records.mockResolvedValue([
        {
            chart_id: 1,
            score: 970_000,
            rank: "S",
            fc_type: 2,
            grade_basic: 42,
            grade_recital: 0,
        },
    ]);
    mocks.band.mockResolvedValue({
        id: 11,
        value: 1,
        position: 0,
        entries: [
            { id: 1, chartId: 1, position: 0, chart },
            { id: 2, chartId: 80, position: 1, chart },
        ],
    });
});

describe("Tier browser request and data contract", () => {
    it("canonicalizes malformed, duplicate and discontinuous filter values", () => {
        const parsed = parseTierBrowserQuery(
            new URLSearchParams(
                "mode=other&goal=other&difficulty=Expert,Real,wrong,Expert&level=12,real-3,13,real-12&bands=14.5,14.5,1,14.6,NaN&view=detailed"
            )
        );
        expect(parsed).toEqual({
            mode: "basic",
            goal: "s",
            difficulties: ["Expert", "Real"],
            levels: ["12", "real-3"],
            bands: [14.5, 1],
            detailed: true,
        });
        expect(
            parseTierBrowserQuery(serializeTierBrowserQuery(parsed))
        ).toEqual(parsed);
        expect(serializeTierBrowserQuery(query()).has("bands")).toBe(false);
    });
    it("uses the current mode's Pianist constants while viewing S or FC", async () => {
        const band = await getTierBrowserBand(query(), 11, 9, "ko");
        expect(band?.entries[0].record?.grade).toBe(0.42);
        expect(band?.entries[0].record?.rating).toBeCloseTo(
            (10_000 / 70) * 0.34
        );
        expect(band?.entries[1].record).toBeNull();
        expect(mocks.list).toHaveBeenCalledWith(
            expect.objectContaining({
                where: { mode: "basic", goal: "pianist", status: "published" },
            })
        );
        expect(mocks.records).toHaveBeenCalledWith(
            expect.objectContaining({
                where: { user_id: 9, chart_id: { in: [1, 80] } },
            })
        );
    });
    it("omits personal rows for guests and unplayed Recital charts", async () => {
        expect(
            (await getTierBrowserBand(query(), 11, null, "en"))?.entries[0]
                .record
        ).toBeNull();
        expect(mocks.records).not.toHaveBeenCalled();
        expect(
            (
                await getTierBrowserBand(
                    { ...query(), mode: "recital" },
                    11,
                    9,
                    "ja"
                )
            )?.entries[0].record
        ).toBeNull();
        mocks.records.mockResolvedValue([
            {
                chart_id: 1,
                score: 970_000,
                rank: "S",
                fc_type: 2,
                grade_basic: 42,
                grade_recital: 58,
            },
        ]);
        expect(
            (
                await getTierBrowserBand(
                    { ...query(), mode: "recital", goal: "fc" },
                    11,
                    9,
                    "ja"
                )
            )?.entries[0].record?.grade
        ).toBe(0.58);
        expect(mocks.list).toHaveBeenCalledWith(
            expect.objectContaining({
                where: {
                    mode: "recital",
                    goal: "pianist",
                    status: "published",
                },
            })
        );
    });
    it("omits rating without a complete Pianist basis instead of using S constants", async () => {
        mocks.list.mockImplementation(
            ({ where }: { where: { goal: string; mode: string } }) =>
                Promise.resolve(
                    where.goal === "pianist"
                        ? null
                        : inventory(where.goal, where.mode)
                )
        );
        expect(
            (await getTierBrowserBand(query(), 11, 9, "ko"))?.entries[0].record
                ?.rating
        ).toBeNull();
    });
    it("intersects difficulty and discontinuous official levels and retains empty published bands", async () => {
        const result = await getTierBrowserOverview(
            { ...query(), difficulties: ["Real"], levels: ["12"] },
            9
        );
        expect(result.list?.bands[0]).toMatchObject({
            totalCount: 0,
            achievedCount: 0,
        });
        expect(mocks.records).not.toHaveBeenCalled();
        expect(
            (
                await getTierBrowserOverview(
                    { ...query(), levels: ["12", "real-3"] },
                    9
                )
            ).list?.bands[0]
        ).toMatchObject({ totalCount: 70, achievedCount: 1 });
    });
    it("keeps guest progress absent and requires Recital participation for achievements", async () => {
        expect(
            (await getTierBrowserOverview(query(), null)).list?.bands[0]
                .achievedCount
        ).toBeNull();
        expect(
            (await getTierBrowserOverview({ ...query(), mode: "recital" }, 9))
                .list?.bands[0].achievedCount
        ).toBe(0);
    });
    it("rejects a band outside the selected mode and goal before loading its data", async () => {
        expect(await getTierBrowserBand(query(), 22, 9, "ko")).toBeNull();
        expect(mocks.band).not.toHaveBeenCalled();
    });
});
