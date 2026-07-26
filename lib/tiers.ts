export { getJacketUrl } from "@/lib/musicJackets";

export type TierRecord = {
    score: number;
    rank: string;
    fc_type: number;
    max_combo?: number;
    play_count?: number;
    clear_count?: number | null;
    fullcombo_count?: number;
    pianistic_count?: number;
    judge_sjust?: number | null;
    judge_just?: number | null;
    judge_good?: number | null;
    judge_miss?: number | null;
    judge_near?: number | null;
    note_rate_standard?: number | null;
    note_rate_tenuto?: number | null;
    note_rate_glissando?: number | null;
    note_rate_trill?: number | null;
    besttime?: string;
    latestPlay?: {
        fast_count: number | null;
        slow_count: number | null;
        source_play_time: string;
    } | null;
};

export const TIER_MODES = ["basic", "recital"] as const;
export const TIER_GOALS = ["s", "fc", "pianist"] as const;
export const TIER_DIFFICULTIES = ["Normal", "Hard", "Expert", "Real"] as const;
export const TIER_REGULAR_LEVELS = Array.from({ length: 12 }, (_, index) =>
    String(index + 1)
);
export const TIER_REAL_LEVELS = ["real-1", "real-2", "real-3"] as const;

export type TierMode = (typeof TIER_MODES)[number];
export type TierGoal = (typeof TIER_GOALS)[number];
export type TierDifficulty = (typeof TIER_DIFFICULTIES)[number];

export const tierGoalLabels: Record<TierGoal, string> = {
    s: "S",
    fc: "Full Combo",
    pianist: "Pianist",
};

export function isTierMode(value: string): value is TierMode {
    return TIER_MODES.includes(value as TierMode);
}

export function isTierGoal(value: string): value is TierGoal {
    return TIER_GOALS.includes(value as TierGoal);
}

export function isTierDifficulty(value: string): value is TierDifficulty {
    return TIER_DIFFICULTIES.includes(value as TierDifficulty);
}

export function isTierLevelFilter(value: string) {
    return (
        TIER_REGULAR_LEVELS.includes(value) ||
        TIER_REAL_LEVELS.includes(value as (typeof TIER_REAL_LEVELS)[number])
    );
}

export function isTierGoalAchieved(
    record: TierRecord | null | undefined,
    goal: TierGoal
) {
    if (!record || record.score <= 0) return false;
    if (goal === "s") return record.score >= 950_000;
    if (goal === "fc") return record.fc_type >= 2 || record.score >= 1_000_000;
    return record.fc_type === 3 || record.score >= 1_000_000;
}

export function formatOfficialChartLevel(difficulty: string, level: number) {
    return difficulty.toLowerCase() === "real"
        ? `Real ${level}`
        : `Lv.${level}`;
}

export interface PublicTierBandEntry {
    id: number;
    chartId: number;
    position: number;
    chart: {
        difficulty: string;
        level: number;
        music: {
            index: string;
            title: string;
            background: string | null;
        };
    };
    record: TierRecord | null;
}

export interface PublicTierBandPayload {
    id: number;
    value: number;
    position: number;
    entries: PublicTierBandEntry[];
}

export type TierRecordStatus =
    "pianist" | "fc" | "s" | "a_plus" | "played" | "unplayed";

export const tierModeStyles: Record<string, string> = {
    basic: "bg-chart/15 text-chart",
    recital: "bg-recital/15 text-recital",
};

export const MIN_TIER_VALUE = 1;
export const MAX_TIER_VALUE = 14.5;
export const TIER_BAND_VALUES = Array.from(
    { length: Math.round((MAX_TIER_VALUE - MIN_TIER_VALUE) * 10) + 1 },
    (_, index) => Math.round((MAX_TIER_VALUE - index * 0.1) * 10) / 10
);

// 서열표 상수를 소수점 한 자리로 통일함
export function formatTierValue(value: number) {
    return value.toFixed(1);
}

// 게임의 Grd 원본 값을 서열표 추천 중심과 범위로 변환함
export function getTierRecommendation(rawGrade: number | null | undefined) {
    if (!rawGrade || rawGrade <= 0) return null;

    const displayGrade = Math.round(rawGrade / 100);
    const unclampedTarget = displayGrade / 1000 + 6.5;
    const target = Math.min(
        MAX_TIER_VALUE,
        Math.max(MIN_TIER_VALUE, Math.round(unclampedTarget * 10) / 10)
    );

    return {
        displayGrade,
        target,
        min: Math.max(MIN_TIER_VALUE, Math.round((target - 0.2) * 10) / 10),
        max: Math.min(MAX_TIER_VALUE, Math.round((target + 0.2) * 10) / 10),
    };
}

export function getTierRecordStatus(
    record: TierRecord | null | undefined
): TierRecordStatus {
    if (!record || record.score <= 0) return "unplayed";
    if (record.fc_type === 3 || record.score >= 1_000_000) return "pianist";
    if (record.fc_type >= 2) return "fc";
    if (record.score >= 950_000) return "s";
    if (record.score >= 900_000) return "a_plus";
    return "played";
}

export function formatTierDate(date: Date | string) {
    return new Intl.DateTimeFormat("ko-KR", {
        month: "2-digit",
        day: "2-digit",
        timeZone: "Asia/Seoul",
    })
        .format(typeof date === "string" ? new Date(date) : date)
        .replaceAll(". ", ".")
        .replace(/\.$/, "");
}
