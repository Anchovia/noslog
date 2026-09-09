import { beforeEach, describe, expect, it, vi } from "vitest";

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
