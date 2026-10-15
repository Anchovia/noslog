export const CACHE_TAGS = {
    musicCatalog: "music-catalog",
    musicDetails: "music-details",
    chartRankings: "chart-rankings",
    chartEvaluations: "chart-evaluations",
    tierLists: "tier-lists",
    userRankings: "user-rankings",
    exams: "exams",
    bingos: "bingos",
    userProfiles: "user-profiles",
    arcades: "arcades",
    announcements: "announcements",
    events: "events",
} as const;

export function getUserProfileTag(userId: number) {
    return `user-profile-${userId}`;
}

// 채보 하나의 순위 · 점수 분포 — 동기화는 바뀐 채보만 비운다(전체는 CACHE_TAGS.chartRankings)
export function getChartRankingTag(chartId: number) {
    return `chart-ranking-${chartId}`;
}
