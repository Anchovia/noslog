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
} as const;

export function getUserProfileTag(userId: number) {
    return `user-profile-${userId}`;
}
