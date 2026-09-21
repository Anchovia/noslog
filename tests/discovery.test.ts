import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { QueryClient } from "@tanstack/react-query";
import { discoveryPreviewOptions } from "@/features/music/api/discovery";
import { createApiSuccess } from "@/lib/api/response";

import {
    discoveryQuerySchema,
    discoverySearchParams,
    getDiscoverySort,
    parseDiscoverySearchParams,
} from "@/features/music/schemas/discoverySchema";

const { queryRaw } = vi.hoisted(() => ({ queryRaw: vi.fn() }));
vi.mock("server-only", () => ({}));
vi.mock("@/lib/db", () => ({ default: { $queryRaw: queryRaw } }));
import {
    getDiscoveryCounts,
    getDiscoveryPage,
    publicDiscoveryQuery,
} from "@/features/music/server/discoveryService";

describe("Discovery URL and filter contract", () => {
    it("browses the complete catalog without an implicit Expert restriction", () => {
        const music = parseDiscoverySearchParams({});
        expect(music.difficulties).toEqual([]);
        expect(getDiscoverySort(music)).toBe("name");
        expect(getDiscoverySort({ ...music, scope: "chart" })).toBe(
            "published"
        );
        expect(getDiscoverySort({ ...music, q: "STULTI" })).toBe("relevance");
        expect(getDiscoverySort({ ...music, q: "STULTI", sort: "name" })).toBe(
            "name"
        );
    });
    it("round-trips durable criteria while excluding batch state", () => {
        const query = parseDiscoverySearchParams({
            scope: "chart",
            q: " STULTI ",
            categories: "bm,ORG",
            real: "true",
            realMin: "2",
            realMax: "3",
            sort: "level",
            sortDifficulty: "real",
            order: "asc",
            view: "grid",
            records: "fc",
            missMin: "0",
            missMax: "2",
        });
        expect(
            parseDiscoverySearchParams(
                Object.fromEntries(discoverySearchParams(query))
            )
        ).toEqual(query);
        expect(discoverySearchParams(query).has("offset")).toBe(false);
    });
    it("bounds each difficulty and requires an explicit level-sort target", () => {
        expect(
            parseDiscoverySearchParams({
                normal: "true",
                normalMax: "12",
                hard: "true",
                hardMax: "12",
                sort: "level",
            }).difficulties
        ).toEqual([
            { difficulty: "Normal", min: 1, max: 8 },
            { difficulty: "Hard", min: 1, max: 11 },
        ]);
        expect(
            discoveryQuerySchema.safeParse({
                ...parseDiscoverySearchParams({}),
                sort: "level",
            }).success
        ).toBe(false);
    });
    it("normalizes impossible unplayed refinements and strips signed-out personal criteria", () => {
        const query = parseDiscoverySearchParams({
            records: "unplayed,s",
            sort: "recent",
            missMax: "2",
        });
        expect(query.records).toEqual(["unplayed"]);
        expect(query.sort).toBeUndefined();
        expect(query.missMax).toBeUndefined();
        expect(
            publicDiscoveryQuery(
                {
                    ...parseDiscoverySearchParams({
                        records: "fc",
                        missMin: "2",
                    }),
                    sort: "recent",
                },
                null
            )
        ).toMatchObject({ records: [], sort: undefined, missMin: undefined });
    });
});

describe("Discovery data boundary", () => {
    beforeEach(() => queryRaw.mockReset());
    it.each([
        {},
        { scope: "chart" },
        {
            q: "50%_",
            categories: "bm,ORG",
            expert: "true",
            expertMin: "11",
            real: "true",
        },
        { records: "unplayed" },
        { records: "fc,s", missMin: "0", missMax: "4" },
    ])(
        "counts use the same eligible charts and music filters as the list: %j",
        async (params) => {
            const input = parseDiscoverySearchParams(params);
            queryRaw.mockResolvedValue([
                { total: 0, chartTotal: 0, items: [] },
            ]);
            await getDiscoveryPage(input, 0, 9);
            const page = queryRaw.mock.calls[0][0];
            expect(await getDiscoveryCounts(input, 9)).toEqual({
                total: 0,
                chartTotal: 0,
            });
            const counts = queryRaw.mock.calls[1][0];
            expect(
                counts.sql.match(
                    /WITH eligible AS \(([\s\S]*?)\)\s+SELECT COUNT/
                )?.[1]
            ).toBe(
                page.sql.match(
                    /WITH eligible AS \(([\s\S]*?)\), catalog AS/
                )?.[1]
            );
            const musicFilters = (sql: string) =>
                sql
                    .split(
                        'FROM "Music" AS music JOIN eligible ON eligible."music_idx" = music."index"'
                    )[1]
                    .split("GROUP BY")[0]
                    .trim();
            expect(musicFilters(counts.sql)).toBe(musicFilters(page.sql));
            expect(counts.sql).toContain('COUNT(DISTINCT music."index")');
            expect(counts.sql).toContain('COUNT(eligible."id")');
            expect(counts.sql).not.toMatch(
                /jsonb_agg|ORDER BY|LIMIT|ChartPlayHistory/
            );
            expect(counts.values).toContain(9);
            for (const value of counts.values)
                expect(page.values).toContain(value);
        }
    );
    it("counts strip personal criteria for guests and retain nonempty totals", async () => {
        queryRaw.mockResolvedValue([{ total: 5, chartTotal: 12 }]);
        const input = parseDiscoverySearchParams({
            records: "fc",
            missMax: "4",
            sort: "recent",
        });
        expect(await getDiscoveryCounts(input)).toEqual({
            total: 5,
            chartTotal: 12,
        });
        const statement = queryRaw.mock.calls[0][0];
        expect(statement.sql).not.toMatch(
            /judge_miss|fc_type|ChartPlayHistory/
        );
        expect(statement.values).toContain(null);
    });
    it("requires a published snapshot for chart destinations and retains exact empty counts", async () => {
        queryRaw.mockResolvedValue([{ items: [], total: 0, chartTotal: 0 }]);
        expect(
            await getDiscoveryPage(
                parseDiscoverySearchParams({ scope: "chart" })
            )
        ).toEqual({ items: [], total: 0, chartTotal: 0, nextOffset: null });
        const statement = queryRaw.mock.calls[0][0];
        expect(statement.sql).toContain(
            'pattern."published_content" IS NOT NULL'
        );
        expect(statement.sql).toContain("'null'::jsonb");
        expect(statement.sql).toContain("published DESC NULLS LAST");
    });
    it("uses best-record MISS bounds and parameterized literal text", async () => {
        queryRaw.mockResolvedValue([{ items: [], total: 0, chartTotal: 0 }]);
        await getDiscoveryPage(
            parseDiscoverySearchParams({
                q: "50%_",
                records: "fc",
                missMin: "0",
                missMax: "4",
            }),
            0,
            9
        );
        const statement = queryRaw.mock.calls[0][0];
        expect(statement.sql).toContain('play."judge_miss" >=');
        expect(statement.sql).toContain('play."judge_miss" <=');
        expect(statement.sql).not.toContain("50%_");
        expect(statement.values).toContain("%50\\%\\_%");
        expect(statement.sql).toContain("LIMIT 20 OFFSET");
    });
});

describe("Discovery count preview request", () => {
    afterEach(() => vi.unstubAllGlobals());
    it("requests and caches counts without requiring catalog items", async () => {
        const fetch = vi
            .fn()
            .mockResolvedValue(
                new Response(
                    JSON.stringify(
                        createApiSuccess({ total: 5, chartTotal: 12 })
                    )
                )
            );
        vi.stubGlobal("fetch", fetch);
        const client = new QueryClient();
        const query = parseDiscoverySearchParams({
            scope: "chart",
            expert: "true",
        });
        const options = discoveryPreviewOptions(query, 9);
        try {
            expect(await client.fetchQuery(options)).toEqual({
                total: 5,
                chartTotal: 12,
            });
            await client.fetchQuery(options);
            expect(fetch).toHaveBeenCalledOnce();
            const params = new URL(fetch.mock.calls[0][0], "http://localhost")
                .searchParams;
            expect(params.get("counts")).toBe("1");
            expect(params.has("offset")).toBe(false);
            expect(params.get("scope")).toBe("chart");
            expect(options.queryKey).not.toEqual(
                discoveryPreviewOptions(query, null).queryKey
            );
        } finally {
            client.clear();
        }
    });
});
