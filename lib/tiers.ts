export { getJacketUrl } from "@/lib/musicJackets";

export type TierRecord = {
    score: number;
    rank: string;
    fc_type: number;
};

export interface PublicTierBandEntry {
    id: number;
    chartId: number;
    position: number;
    chart: {
        difficulty: string;
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

const MIN_TIER_VALUE = 1;
export const MAX_TIER_VALUE = 14.5;

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
