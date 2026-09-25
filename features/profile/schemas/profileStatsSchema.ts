import { z } from "zod";

/** 레벨별 달성의 램프 · 랭크 칸(2026-09-26 R2) — 「안 함」 은 수록 채보 수에서 뺀 나머지 */
export const PROFILE_LAMP_KEYS = ["pianist", "fc", "clear", "fail"] as const;
export const PROFILE_RANK_KEYS = ["P", "S", "A+", "A", "B"] as const;
export type ProfileLampKey = (typeof PROFILE_LAMP_KEYS)[number];
export type ProfileRankKey = (typeof PROFILE_RANK_KEYS)[number];

const count = z.number().int().min(0);
const levelRowSchema = z.object({
    difficulty: z.string(),
    level: z.number().int(),
    total: count,
    lamp: z.record(z.enum(PROFILE_LAMP_KEYS), count),
    rank: z.record(z.enum(PROFILE_RANK_KEYS), count),
});
export type ProfileLevelRow = z.infer<typeof levelRowSchema>;

export const profileStatsSchema = z.object({
    levels: z.array(levelRowSchema),
    judgement: z.object({
        counts: z.object({
            sjust: count,
            just: count,
            good: count,
            near: count,
            miss: count,
        }),
        chartCount: count,
    }),
    notes: z.array(
        z.object({
            key: z.enum(["standard", "tenuto", "glissando", "trill"]),
            rate: z.number().min(0).max(100).nullable(),
            charts: count,
        })
    ),
    played: count,
});
export type ProfileStats = z.infer<typeof profileStatsSchema>;

/** 「활동」 탭(2026-09-26) — 최근 1년 날짜별 플레이 수(한국 날짜) + 요약 */
export const profileActivitySchema = z.object({
    /** 달력 첫날(일요일) ~ 오늘, 「YYYY-MM-DD」 */
    start: z.string(),
    end: z.string(),
    days: z.array(z.object({ date: z.string(), count: count })),
    summary: z.object({
        year: count,
        month: count,
        activeDays: count,
        longestStreak: count,
    }),
});
export type ProfileActivity = z.infer<typeof profileActivitySchema>;
