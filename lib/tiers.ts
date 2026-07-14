export type TierRecord = {
    score: number;
    rank: string;
    fc_type: number;
};

export type TierRecordStatus = "pianist" | "fc" | "s" | "played" | "unplayed";

export const tierModeStyles: Record<string, string> = {
    basic: "bg-chart/15 text-chart",
    recital: "bg-recital/15 text-recital",
};

const MIN_TIER_VALUE = 1;
const MAX_TIER_VALUE = 14;

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
    if (record.rank.toUpperCase() === "S") return "s";
    return "played";
}

export function formatTierDate(date: Date) {
    return new Intl.DateTimeFormat("ko-KR", {
        month: "2-digit",
        day: "2-digit",
    })
        .format(date)
        .replaceAll(". ", ".")
        .replace(/\.$/, "");
}

export function getJacketUrl(index: string, background: string | null) {
    return (
        background ||
        `https://p.eagate.573.jp/game/nostalgia/op3/img/jacket.html?c=${index}`
    );
}
