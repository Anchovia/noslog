import { z } from "zod";

const shortText = z.string().min(1).max(256);
const nullableShortText = z.string().max(256).nullable();
const difficultySchema = z.enum(["Normal", "Hard", "Expert", "Real"]);
const sourceStatusSchema = z.object({
    status: z.number().int().optional(),
    fail_code: z.number().int().optional(),
});
const recentHistorySchema = z.object({
    artist: z.string().max(256),
    best_score: z.number().int().min(0).max(1_000_000),
    class_basic: z.string().max(32),
    difficulty: difficultySchema,
    fast_count: z.number().int().min(0).max(1_000_000),
    is_onehand: z.boolean(),
    judge_count: z.tuple([
        z.number().int().min(0).max(1_000_000),
        z.number().int().min(0).max(1_000_000),
        z.number().int().min(0).max(1_000_000),
        z.number().int().min(0).max(1_000_000),
        z.number().int().min(0).max(1_000_000),
    ]),
    level: z.number().int().min(1).max(14),
    license: z.string().max(5_000),
    score: z.number().int().min(0).max(1_000_000),
    slow_count: z.number().int().min(0).max(1_000_000),
    max_combo: z.number().int().min(0).max(1_000_000),
    rank: z.string().min(1).max(32),
    play_time: z.string().min(1).max(64),
    music: shortText,
    title: shortText,
    grade_basic: z.number().int().min(0).max(100_000_000),
});
const musicSheetSchema = z.object({
    difficulty: difficultySchema,
    level: z.number().int().min(1).max(14),
    score: z.number().int().min(0).max(1_000_000),
    rank: z.string().min(1).max(32),
    fc_type: z.number().int().min(0).max(10),
    play_count: z.number().int().min(0).max(10_000_000),
    clear_count: z.number().int().min(0).max(10_000_000),
    clear_flag: z.tuple([z.number().int().min(0).max(1_000_000)]),
    fullcombo_count: z.number().int().min(0).max(10_000_000),
    pianistic_count: z.number().int().min(0).max(10_000_000),
    max_combo: z.number().int().min(0).max(1_000_000),
    grade_basic: z.number().int().min(0).max(100_000_000),
    grade_recital: z.number().int().min(0).max(100_000_000),
    judge: z.tuple([
        z.number().int().min(0).max(1_000_000),
        z.number().int().min(0).max(1_000_000),
        z.number().int().min(0).max(1_000_000),
        z.number().int().min(0).max(1_000_000),
        z.number().int().min(0).max(1_000_000),
    ]),
    note_success_rate: z.tuple([
        z.number().int().min(-1).max(10_000),
        z.number().int().min(-1).max(10_000),
        z.number().int().min(-1).max(10_000),
        z.number().int().min(-1).max(10_000),
    ]),
    besttime: z.string().max(64),
});
const musicSchema = z.object({
    "@index": z.string().min(1).max(128),
    artist: nullableShortText,
    category: z.string().min(1).max(128),
    category_short: z.string().min(1).max(32),
    description: z.string().max(5_000).nullable(),
    license: z.string().max(5_000),
    title: shortText,
    title_kana: z.string().max(256),
    unlock_type: z.number().int().min(0).max(100),
    sheet: z.array(musicSheetSchema).min(3).max(4),
});
const unwrapSingleton = (value: unknown) =>
    Array.isArray(value) && value.length === 1 ? value[0] : value;
const normalizeCollection = (value: unknown) =>
    value === undefined || Array.isArray(value) ? value : [value];
export const syncRequestSchema = z.object({
    token: z.string().min(1).max(512),
    playerData: z.object({
        status: z.number().int(),
        data: sourceStatusSchema.extend({
            player: z.preprocess(
                unwrapSingleton,
                z.object({
                    name: z.string().min(1).max(64),
                    play_count: z.number().int().min(0).max(10_000_000),
                    // 북마클릿이 함께 보내는 NOS(travel_info) · 브로치는 읽는 곳이 없어 받지 않는다(2026-10-16 K5)
                    last: z.object({
                        playtime: z.string().max(64),
                    }),
                })
            ),
        }),
    }),
    recentData: z.object({
        status: z.number().int(),
        data: sourceStatusSchema.extend({
            player: z.preprocess(
                unwrapSingleton,
                z.object({
                    name: z.string().max(64),
                    history_list: z.object({
                        history: z.array(recentHistorySchema).max(100),
                    }),
                })
            ),
        }),
    }),
    totalData: z
        .object({
            status: z.number().int(),
            data: sourceStatusSchema.extend({
                music: z.preprocess(
                    normalizeCollection,
                    z.array(musicSchema).max(2_000)
                ),
            }),
        })
        .nullable(),
});

export type SyncRecentHistoryItem = z.infer<typeof recentHistorySchema>;
export type SyncMusicInput = z.infer<typeof musicSchema>;
export type BemaniMusicCatalogInput = Omit<SyncMusicInput, "sheet"> & {
    sheet: Pick<SyncMusicInput["sheet"][number], "difficulty" | "level">[];
};
export type SyncPlayerProfile = z.infer<
    typeof syncRequestSchema
>["playerData"]["data"]["player"];
