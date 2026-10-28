export const CACHE_TAGS = {
    musicCatalog: "music-catalog",
    musicDetails: "music-details",
    chartRankings: "chart-rankings",
    chartEvaluations: "chart-evaluations",
    patternMetrics: "pattern-metrics",
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

// 채보 하나의 커뮤니티 공용 캐시(패턴 요약 · 목표 투표) — 평가 · 투표 쓰기는 그 채보만 비운다(2026-10-16).
// 계정 삭제처럼 여러 채보에 걸친 쓰기는 CACHE_TAGS.chartEvaluations 로 전부 비운다
export function getChartEvaluationTag(chartId: number) {
    return `chart-evaluations-${chartId}`;
}

// 채보 하나의 순위 · 점수 분포 — 동기화는 바뀐 채보만 비운다(전체는 CACHE_TAGS.chartRankings)
export function getChartRankingTag(chartId: number) {
    return `chart-ranking-${chartId}`;
}
