import { z } from "zod";

/** 레벨별 달성 한 막대의 칸(2026-09-26 L1) — 채보마다 가장 높은 한 칸: Pianist(= P) → FC → S → A+ → A → B 이하.
 * 「실패」 는 따로 세지 않고(그 판의 랭크 칸), 「안 함」 은 수록 채보 수에서 뺀 나머지 */
export const PROFILE_TIER_KEYS = [
    "pianist",
    "fc",
    "S",
    "A+",
    "A",
    "B",
] as const;
export type ProfileTierKey = (typeof PROFILE_TIER_KEYS)[number];

const count = z.number().int().min(0);
const levelRowSchema = z.object({
    difficulty: z.string(),
    level: z.number().int(),
    total: count,
    tiers: z.record(z.enum(PROFILE_TIER_KEYS), count),
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
