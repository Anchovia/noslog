import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ queryRaw: vi.fn(), findMany: vi.fn() }));
vi.mock("@/lib/db", () => ({
    default: {
        $queryRaw: mocks.queryRaw,
        musicChart: { findMany: mocks.findMany },
    },
}));

import { searchPreviewQuerySchema } from "@/features/music/schemas/searchPreviewSchema";
import { getSearchPreview } from "@/features/music/server/searchPreviewService";

describe("Home search preview", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mocks.queryRaw.mockResolvedValue([]);
        mocks.findMany.mockResolvedValue([]);
    });

    it("normalizes queries and rejects invalid scopes and oversized input", () => {
        expect(searchPreviewQuerySchema.parse({ q: "  STULTI  " })).toEqual({
            q: "STULTI",
            scope: "music",
            locale: "ko",
        });
        expect(searchPreviewQuerySchema.safeParse({ q: "   " }).success).toBe(
            false
        );
        expect(
            searchPreviewQuerySchema.safeParse({ q: "a".repeat(101) }).success
        ).toBe(false);
        expect(
            searchPreviewQuerySchema.safeParse({ q: "song", scope: "draft" })
                .success
        ).toBe(false);
    });

    it("returns an empty public-chart result without manufacturing rows", async () => {
        expect(
            await getSearchPreview({
                q: "STULTI",
                scope: "chart",
                locale: "ko",
            })
        ).toEqual({ total: 0, items: [] });
        expect(mocks.findMany).not.toHaveBeenCalled();
        expect(mocks.queryRaw.mock.calls[0][0].sql).toContain(
            'pattern."published_content" IS NOT NULL'
        );
        expect(mocks.queryRaw.mock.calls[0][0].sql).not.toContain(
            "draft_content"
        );
    });

    it("preserves the total beyond the five preview rows and returns official levels", async () => {
        mocks.queryRaw.mockResolvedValue([
            {
                index: "song",
                title: "STULTI",
                artist: "Artist",
                background: null,
                category_short: "BM",
                difficulty: null,
                level: null,
                total: 18,
            },
        ]);
        mocks.findMany.mockResolvedValue([
            { music_idx: "song", difficulty: "Normal", level: 4 },
            { music_idx: "song", difficulty: "Expert", level: 12 },
        ]);
        const result = await getSearchPreview({
            q: "STULTI",
            scope: "music",
            locale: "en",
        });
        expect(result.total).toBe(18);
        expect(result.items[0]).toMatchObject({
            title: "STULTI",
            normal: 4,
            hard: 0,
            expert: 12,
            real: null,
        });
        expect(mocks.queryRaw.mock.calls[0][0].sql).toContain("LIMIT 5");
    });

    it("keeps punctuation and SQL-looking input in parameters and escapes wildcard matching", async () => {
        const q = "_%' OR 1=1 --";
        await getSearchPreview({ q, scope: "music", locale: "ja" });
        const sql = mocks.queryRaw.mock.calls[0][0];
        expect(sql.sql).not.toContain(q);
        expect(sql.values).toContain("%\\_\\%' OR 1=1 --%");
    });
});
