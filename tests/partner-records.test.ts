import { describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ profile: vi.fn() }));

vi.mock("@/features/profile/server/public-profile-data", () => ({
    getCachedProfileData: mocks.profile,
}));
vi.mock("@/lib/db", () => ({
    default: {
        playerRating: { findMany: async () => [] },
        dataSync: { findFirst: async () => null },
        chartPlayHistory: { findMany: async () => [], count: async () => 0 },
    },
}));

import { musecatRecordsSchema } from "@/features/partner/schemas/musecat-records-schema";
import {
    buildNostalgiaRecords,
    type NostalgiaRecentPlay,
    type NostalgiaRecordsInput,
} from "@/features/partner/server/nostalgia-records";
import { loadNostalgiaRecords } from "@/features/partner/server/nostalgia-records-data";

function play(index: number, overrides: Partial<NostalgiaRecentPlay> = {}) {
    return {
        musicIndex: `song-${index}`,
        title: `Song ${index}`,
        artist: "Artist",
        difficulty: "Real",
        level: 12,
        playedAt: new Date(Date.UTC(2026, 9, 1, 0, index)),
        score: 990_000 + index,
        grdBasic: 150.256,
        grdRecital: null,
        ...overrides,
    } satisfies NostalgiaRecentPlay;
}

function input(
    overrides: Partial<NostalgiaRecordsInput> = {}
): NostalgiaRecordsInput {
    return {
        subject: "nl_subject",
        playerName: "carol",
        profileUrl: "https://noslog.app/ko/profile/1",
        updatedAt: new Date("2026-10-19T14:39:20.000Z"),
        scoresPublic: true,
        activityPublic: true,
        share: {
            summary: true,
            ranks: true,
            songRecords: false,
            recentPlays: true,
        },
        summary: {
            basic: { grade: 5723.054, rating: 15.321 },
            recital: { grade: null, rating: 14.5 },
        },
        ranks: [
            { mode: "basic", scope: "domestic", rank: 12 },
            { mode: "basic", scope: "global", rank: 40 },
        ],
        recentPlays: { total: 2, items: [play(1), play(2)] },
        ...overrides,
    };
}

describe("NOSTALGIA records for Musecat", () => {
    it("builds a valid public envelope with namespaced ids and decimals", () => {
        const records = buildNostalgiaRecords(input());
        expect(() => musecatRecordsSchema.parse(records)).not.toThrow();
        expect(records).toMatchObject({
            spec: "musecat-records/v1",
            service: "nostalgia",
            sub: "nl_subject",
            visibility: "public",
            updated_at: "2026-10-19T14:39:20.000Z",
            source: { name: "NosLog", url: "https://noslog.app/ko/profile/1" },
            game_schema: "musecat-game/nostalgia/v1",
            player: { name: "carol" },
            sections: [],
            selection: [{ key: "sections", status: "denied" }],
        });
        expect(records.fields.map(({ key, value }) => [key, value])).toEqual([
            ["grade", 5723.05],
            ["rating", 15.32],
            ["noslog.rating_recital", 14.5],
            ["noslog.rank_basic_domestic", 12],
            ["noslog.rank_basic_global", 40],
        ]);
        const [latest] = records.recent_plays?.plays ?? [];
        expect(latest).toMatchObject({
            id: "noslog:play:song-2:Real:2026-10-01T00:02:00.000Z",
            played_at: "2026-10-01T00:02:00.000Z",
            song: { id: "noslog:song:song-2", title: "Song 2" },
            chart: {
                id: "noslog:chart:song-2:Real",
                difficulty: "Real",
                level: "12",
            },
        });
        expect(latest?.fields).toEqual([
            expect.objectContaining({ key: "score", value: 990_002 }),
            expect.objectContaining({ key: "grd", value: 150.26 }),
        ]);
        expect(records.recent_plays?.total).toBe(2);
    });

    it("omits unchosen groups and records them as denied", () => {
        const records = buildNostalgiaRecords(
            input({
                share: {
                    summary: false,
                    ranks: false,
                    songRecords: true,
                    recentPlays: false,
                },
            })
        );
        expect(records.fields).toEqual([]);
        expect(records.recent_plays).toBeUndefined();
        expect(records.selection).toEqual([
            { key: "fields", status: "denied" },
            { key: "sections", status: "unsupported" },
            { key: "recent_plays", status: "denied" },
        ]);
    });

    it("denies summary keys individually when only ranks are shared", () => {
        const records = buildNostalgiaRecords(
            input({
                share: {
                    summary: false,
                    ranks: true,
                    songRecords: false,
                    recentPlays: true,
                },
            })
        );
        expect(records.fields.map(({ key }) => key)).toEqual([
            "noslog.rank_basic_domestic",
            "noslog.rank_basic_global",
        ]);
        expect(records.selection).toContainEqual({
            key: "fields.grade",
            status: "denied",
        });
    });

    it("follows NosLog visibility settings", () => {
        const hiddenActivity = buildNostalgiaRecords(
            input({ activityPublic: false })
        );
        expect(hiddenActivity.recent_plays).toBeUndefined();
        expect(hiddenActivity.selection).toContainEqual({
            key: "recent_plays",
            status: "denied",
        });
        expect(
            buildNostalgiaRecords(input({ scoresPublic: false })).visibility
        ).toBe("private");
    });

    it("keeps only the newest 50 plays and the authorized window total", () => {
        const items = Array.from({ length: 60 }, (_, index) => play(index));
        const records = buildNostalgiaRecords(
            input({ recentPlays: { total: 60, items } })
        );
        expect(records.recent_plays?.plays).toHaveLength(50);
        expect(records.recent_plays?.plays[0]?.song.title).toBe("Song 59");
        expect(records.recent_plays?.total).toBe(60);
    });

    it("rejects envelopes that carry data for a withheld group", () => {
        const records = buildNostalgiaRecords(input());
        expect(() =>
            musecatRecordsSchema.parse({
                ...records,
                selection: [{ key: "recent_plays", status: "denied" }],
            })
        ).toThrow();
        expect(() =>
            musecatRecordsSchema.parse({
                ...records,
                source: { name: "NosLog", url: "http://noslog.app" },
            })
        ).toThrow();
    });
});

describe("NOSTALGIA records source link", () => {
    function profileUser(hidePlayScores: boolean) {
        return {
            user: {
                username: "carol",
                created_at: "2026-10-01T00:00:00.000Z",
                hide_play_scores: hidePlayScores,
                hide_play_activity: false,
                rank_basic: null,
                rank_basic_country: null,
                rank_recital: null,
                rank_recital_country: null,
                grade_basic: null,
                grade_recital: null,
            },
        };
    }
    async function sourceUrl(
        hidePlayScores: boolean,
        sharedItems: ("summary" | "ranks")[]
    ) {
        mocks.profile.mockResolvedValue(profileUser(hidePlayScores));
        const records = await loadNostalgiaRecords({
            userId: 42,
            subject: "nl_subject",
            sharedItems,
            origin: "https://noslog.app",
        });
        expect(() => musecatRecordsSchema.parse(records)).not.toThrow();
        return records?.source.url;
    }

    it("links the public profile only when items are shared and scores are public", async () => {
        expect(await sourceUrl(false, ["summary"])).toBe(
            "https://noslog.app/profile/42"
        );
        expect(await sourceUrl(false, [])).toBe("https://noslog.app");
        expect(await sourceUrl(true, ["summary", "ranks"])).toBe(
            "https://noslog.app"
        );
    });
});
