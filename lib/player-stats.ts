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
export function formatKstMinute(value: Date): string;
export function formatKstMinute(value: Date | null | undefined): string | null;
export function formatKstMinute(value: Date | null | undefined) {
    if (!value) return null;
    return new Date(value.getTime() + 9 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 16)
        .replace("T", " ");
}

// 예전 문자열 besttime 의 「시각 없음」 자리표시 — bestAt 이 NULL 인 기록을 응답에서 예전 값 그대로 보일 때(2026-10-16 P5-1)
const LEGACY_EMPTY_BESTTIME = "1970-01-01 09:00";

/** 응답의 besttime 글자 — 화면 · API 가 받던 값과 같게(bestAt 이 없으면 옛 자리표시) */
export function legacyBesttime(bestAt: Date | null | undefined) {
    return formatKstMinute(bestAt) ?? LEGACY_EMPTY_BESTTIME;
}

/** 최근 플레이 시각 글자 — 공식 플레이 이력 표기 그대로 「YYYY/MM/DD HH:MM」(KST, 옛 source_play_time 과 같은 값) */
export function formatKstPlayTime(value: Date): string;
export function formatKstPlayTime(
    value: Date | null | undefined
): string | null;
export function formatKstPlayTime(value: Date | null | undefined) {
    return formatKstMinute(value)?.replaceAll("-", "/") ?? null;
}
