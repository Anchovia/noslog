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
    music: vi.fn(),
}));
vi.mock("next/cache", () => ({
    unstable_cache: (callback: unknown) => callback,
}));
vi.mock("@/lib/db", () => ({
    default: {
        tierList: { findFirst: mocks.list },
        playData: { findMany: mocks.records },
        music: { findMany: mocks.music },
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
import {
    nextTierBrowserVisibleCount,
    sortTierBrowserEntries,
    tierBrowserSkeletonCount,
    TIER_BROWSER_BATCH_SIZE,
} from "@/features/tiers/components/tierBrowserBands";

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
                        music_idx: index === 0 ? "stulti" : `other-${index}`,
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
    it("bounds offscreen placeholders and appends one card batch at a time", () => {
        expect(tierBrowserSkeletonCount(434, false)).toBe(6);
        expect(tierBrowserSkeletonCount(434, true)).toBe(
            TIER_BROWSER_BATCH_SIZE
        );
        expect(nextTierBrowserVisibleCount(20, 434)).toBe(40);
        expect(nextTierBrowserVisibleCount(420, 434)).toBe(434);
    });

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
            // 예전 주소의 view=detailed 는 목록 보기로 읽는다(2026-09-22)
            view: "list",
            q: "",
            sort: "position",
        });
        expect(serializeTierBrowserQuery(parsed).get("view")).toBe("list");
        expect(
            parseTierBrowserQuery(serializeTierBrowserQuery(parsed))
        ).toEqual(parsed);
        expect(
            parseTierBrowserQuery(new URLSearchParams("view=other")).view
        ).toBe("grid");
        // 곡 검색어는 앞뒤 공백을 걷고 100자까지, 비면 주소에 남기지 않는다(2026-09-22)
        const searched = parseTierBrowserQuery(
            new URLSearchParams(`q=${encodeURIComponent("  Ave  ")}`)
        );
        expect(searched.q).toBe("Ave");
        expect(serializeTierBrowserQuery(searched).get("q")).toBe("Ave");
        expect(serializeTierBrowserQuery(query()).has("q")).toBe(false);
        expect(
            parseTierBrowserQuery(new URLSearchParams(`q=${"a".repeat(150)}`)).q
        ).toHaveLength(100);
        expect(serializeTierBrowserQuery(query()).has("bands")).toBe(false);
        // 정렬은 기본(서열표 순)이면 주소에 남기지 않고, 모르는 값은 서열표 순으로 읽는다(2026-09-22)
        expect(serializeTierBrowserQuery(query()).has("sort")).toBe(false);
        const sorted = parseTierBrowserQuery(new URLSearchParams("sort=score"));
        expect(sorted.sort).toBe("score");
        expect(serializeTierBrowserQuery(sorted).get("sort")).toBe("score");
        expect(
            parseTierBrowserQuery(new URLSearchParams("sort=other")).sort
        ).toBe("position");
    });
    it("sorts within a band and breaks ties by tier list order", () => {
        const entry = (
            position: number,
            level: number,
            reading: string,
            score: number | null
        ) => ({
            id: position,
            chartId: position,
            position,
            chart: {
                difficulty: "Expert",
                level,
                music: {
                    index: `m${position}`,
                    title: reading,
                    reading,
                    localizedTitle: null,
                    background: null,
                },
            },
            record:
                score === null
                    ? null
                    : {
                          score,
                          rank: "S",
                          fc_type: 0,
                          grade: null,
                          rating: null,
                      },
        });
        const entries = [
            entry(2, 11, "か", 990_000),
            entry(0, 12, "う", null),
            entry(1, 12, "あ", 950_000),
            entry(3, 11, "い", 950_000),
        ];
        const order = (sort: Parameters<typeof sortTierBrowserEntries>[1]) =>
            sortTierBrowserEntries(entries, sort).map((item) => item.position);
        expect(order("position")).toEqual([0, 1, 2, 3]);
        expect(order("level")).toEqual([0, 1, 2, 3]);
        expect(order("name")).toEqual([1, 3, 0, 2]);
        // 기록 없는 곡이 먼저, 그다음 낮은 점수 · 같은 점수는 서열표 순
        expect(order("score")).toEqual([0, 1, 3, 2]);
        expect(entries.map((item) => item.position)).toEqual([2, 0, 1, 3]);
    });
    it("narrows band counts and band entries to songs matching the search", async () => {
        mocks.music.mockResolvedValue([{ index: "stulti" }]);
        const searched = parseTierBrowserQuery(new URLSearchParams("q=STU"));
        const overview = await getTierBrowserOverview(searched, null);
        expect(mocks.music).toHaveBeenCalledWith(
            expect.objectContaining({
                where: {
                    OR: expect.arrayContaining([
                        { title: { contains: "STU", mode: "insensitive" } },
                        {
                            translations: {
                                some: {
                                    status: "approved",
                                    title: {
                                        contains: "STU",
                                        mode: "insensitive",
                                    },
                                },
                            },
                        },
                    ]),
                },
            })
        );
        expect(overview.list?.bands[0].totalCount).toBe(1);
        mocks.band.mockResolvedValue({
            id: 11,
            value: 1,
            position: 0,
            entries: [
                { id: 1, chartId: 1, position: 0, chart },
                {
                    id: 2,
                    chartId: 80,
                    position: 1,
                    chart: { ...chart, music: { ...chart.music, index: "x" } },
                },
            ],
        });
        const band = await getTierBrowserBand(searched, 11, null, "ko");
        expect(band?.entries.map((entry) => entry.chartId)).toEqual([1]);
        // 검색어가 없으면 악곡을 찾지 않는다
        mocks.music.mockClear();
        await getTierBrowserOverview(query(), null);
        expect(mocks.music).not.toHaveBeenCalled();
    });
    it("sends the Japanese reading, falling back to the original title", async () => {
        mocks.band.mockResolvedValue({
            id: 11,
            value: 1,
            position: 0,
            entries: [
                {
                    id: 1,
                    chartId: 1,
                    position: 0,
                    chart: {
                        ...chart,
                        music: { ...chart.music, title_kana: " すとぅるてぃ " },
                    },
                },
                {
                    id: 2,
                    chartId: 80,
                    position: 1,
                    chart: {
                        ...chart,
                        music: { ...chart.music, title_kana: "" },
                    },
                },
            ],
        });
        const band = await getTierBrowserBand(query(), 11, null, "ko");
        expect(band?.entries.map((entry) => entry.chart.music.reading)).toEqual(
            ["すとぅるてぃ", "STULTI"]
        );
    });
    it("keeps Basic goals and maps every Recital goal to its single table", () => {
        const parse = (value: string) =>
            parseTierBrowserQuery(new URLSearchParams(value));
        expect(parse("mode=basic&goal=990k").goal).toBe("990k");
        expect(parse("mode=basic&goal=fc").goal).toBe("s");
        expect(parse("mode=recital&goal=s").goal).toBe("pianist");
        expect(parse("mode=recital&goal=990k").goal).toBe("pianist");
        expect(parse("mode=recital").goal).toBe("pianist");
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
                    { ...query(), mode: "recital", goal: "pianist" },
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
