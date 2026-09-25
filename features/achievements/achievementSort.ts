import {
    ACHIEVEMENT_DEFINITIONS,
    achievementProgress,
    highestAchievementTiers,
    recipientKey,
    type AchievementDefinition,
    type AchievementMetrics,
    type AchievementRecords,
} from "@/features/achievements/achievementDefinitions";

/**
 * 업적 페이지 정렬(2026-09-25, 악곡 · 서열표와 같은 결과 줄의 SortMenu) — 분류 순(기본) · 높은 등급 순 ·
 * 최근 달성 순 · 희귀한 순(얻은 등급의 달성 인원 적은 순) · 다음 단계에 가까운 순(본인만, 진행 비율 높은 순).
 * 못 얻은 업적은 등급 · 최근 · 희귀 정렬에서 뒤로, 같은 값끼리는 분류 순.
 */
export const ACHIEVEMENT_SORTS = [
    "category",
    "tier",
    "recent",
    "rare",
    "closest",
] as const;
export type AchievementSort = (typeof ACHIEVEMENT_SORTS)[number];

export function sortAchievementDefinitions(
    definitions: readonly AchievementDefinition[],
    sort: AchievementSort,
    records: AchievementRecords,
    metrics: AchievementMetrics | null
): AchievementDefinition[] {
    const order = new Map(
        ACHIEVEMENT_DEFINITIONS.map((definition, index) => [
            definition.key,
            index,
        ])
    );
    const byCategory = (a: AchievementDefinition, b: AchievementDefinition) =>
        (order.get(a.key) ?? 0) - (order.get(b.key) ?? 0);
    if (sort === "category") return [...definitions].sort(byCategory);
    const highest = highestAchievementTiers(records.earned);
    const latest = new Map<string, string>();
    for (const item of records.earned) {
        const current = latest.get(item.key);
        if (!current || item.achievedAt > current)
            latest.set(item.key, item.achievedAt);
    }
    const score = (definition: AchievementDefinition): number | null => {
        const tier = highest.get(definition.key) ?? 0;
        if (sort === "tier") return tier || null;
        if (sort === "recent") {
            const at = latest.get(definition.key);
            return at ? Date.parse(at) : null;
        }
        if (sort === "rare") {
            if (!tier) return null;
            // 적을수록 앞 — 음수로 뒤집어 「큰 값이 앞」 에 맞춘다
            return -(
                records.recipients[recipientKey(definition.key, tier)] ??
                Number.MAX_SAFE_INTEGER
            );
        }
        // closest — 다음 단계가 남아 있는 것만, 진행 비율 높은 순(본인에게만 값이 있다)
        if (!metrics) return null;
        const progress = achievementProgress(
            definition,
            metrics[definition.metric],
            tier
        );
        return progress.nextTier === null ? null : progress.ratio;
    };
    return [...definitions].sort((a, b) => {
        const left = score(a);
        const right = score(b);
        if (left === null && right === null) return byCategory(a, b);
        if (left === null) return 1;
        if (right === null) return -1;
        return right - left || byCategory(a, b);
    });
}
