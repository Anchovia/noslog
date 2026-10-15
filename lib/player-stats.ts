import type { Prisma } from "@prisma/client";

/*
 * 동기화가 계산한 사람별 값은 player_stats 에서 읽는다(2026-10-16 DB 재설계 P4 전환).
 * User 의 같은 이름 열(grade_* · score_* · play_count …)은 P5 에서 지운다 — 새 코드는 User 에서 읽지 않는다
 */
export type StatsMode = "basic" | "recital";

export const STATS_GRADE_SELECT = {
    gradeBasic: true,
    gradeRecital: true,
} satisfies Prisma.PlayerStatsSelect;

export const STATS_RANK_COUNT_SELECT = {
    scoreP: true,
    scoreF: true,
    scoreS: true,
    scoreA2: true,
    scoreA: true,
    scoreB2: true,
    scoreB: true,
    scoreC: true,
    scoreD: true,
} satisfies Prisma.PlayerStatsSelect;

export function statsGradeField(mode: StatsMode) {
    return mode === "basic"
        ? ("gradeBasic" as const)
        : ("gradeRecital" as const);
}

type GradeStats = {
    gradeBasic: number | null;
    gradeRecital: number | null;
} | null;

export function statsGrade(stats: GradeStats, mode: StatsMode) {
    return stats?.[statsGradeField(mode)] ?? null;
}

/** User 행의 stats 를 예전 이름(grade_basic · grade_recital)으로 펼친다 — 그 이름을 받는 함수 · 화면은 그대로 둔다 */
export function withStatsGrades<T extends { stats: GradeStats }>(row: T) {
    const { stats, ...rest } = row;
    return {
        ...rest,
        grade_basic: stats?.gradeBasic ?? null,
        grade_recital: stats?.gradeRecital ?? null,
    };
}

/** 공식 사이트 표기와 같은 「YYYY-MM-DD HH:MM」(KST) — timestamptz 로 옮긴 시각을 예전 글자 그대로 보일 때 */
export function formatKstMinute(value: Date | null | undefined) {
    if (!value) return null;
    return new Date(value.getTime() + 9 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 16)
        .replace("T", " ");
}
