/**
 * 업적(2026-09-24 T2 · K1 · R1 · P5 · N1 · D1) — 동기화한 기록 · 활동으로 자동 판정하는 단계형 업적.
 * 한 업적 = 동 I · 은 II · 금 III · 플래티넘 IV · 다이아 V 다섯 단계(2026-09-25). 숨긴 업적 · 플레이 횟수 · 연속 일수 · 운 조건은 두지 않는다
 * (오락실은 한 판이 돈 — 반복을 부르는 조건 금지). 얻은 단계는 기준 아래로 내려가도 지우지 않는다.
 *
 * 기준 수치(2026-09-25 사용자 · 제안표) — 운영 분포를 보고 다시 조정할 수 있다.
 */
export const ACHIEVEMENT_CATEGORIES = [
    "skill",
    "collection",
    "challenge",
    "community",
] as const;
export type AchievementCategory = (typeof ACHIEVEMENT_CATEGORIES)[number];

/** 판정에 쓰는 값 — 서버가 한 번에 모아 온다 */
export const ACHIEVEMENT_METRICS = [
    "sRankCharts",
    "score990kCharts",
    "fullComboCharts",
    "pianistCharts",
    "realSRankCharts",
    "oneHandSRankCharts",
    "basicGrade",
    "examBasic",
    "examRecital",
    "opinions",
    "helpfulReceived",
    "patternEvaluations",
    "categoryBM",
    "categoryOrg",
    "categoryClJz",
    "categoryVar",
] as const;
export type AchievementMetric = (typeof ACHIEVEMENT_METRICS)[number];

/** 값 하나 — total 이 있으면 기준은 비율(0–1)이다(카테고리처럼 곡 수가 바뀌는 것) */
export interface AchievementMetricValue {
    value: number;
    total?: number;
}
export type AchievementMetrics = Record<
    AchievementMetric,
    AchievementMetricValue
>;

/** 등급 — 1 동 · 2 은 · 3 금 · 4 플래티넘 · 5 다이아(2026-09-25). 알약 숫자 I–V 는 등급을 뜻한다 */
export const ACHIEVEMENT_TIERS = [1, 2, 3, 4, 5] as const;
export type AchievementTier = (typeof ACHIEVEMENT_TIERS)[number];

export interface AchievementDefinition {
    key: string;
    category: AchievementCategory;
    metric: AchievementMetric;
    /**
     * 이 업적이 가진 등급과 기준(2026-09-25) — 업적마다 다르다. 다섯 단계 모두 · 동 · 은 · 금 셋만 ·
     * 아주 드문 업적은 다이아 하나만(`{ 5: 1 }`)도 된다. 높은 등급일수록 기준도 높다. 비율 업적은 0–1
     */
    thresholds: Readonly<Partial<Record<AchievementTier, number>>>;
    /** 검정처럼 「급」 으로 읽는 값 — 화면에서 기준을 급수로 보인다 */
    unit?: "count" | "grade" | "ratio" | "exam";
}

/** 검정 급수(10 → 1)를 올라가는 값으로 — 7급 = 4 · 5급 = 6 · 3급 = 8 · 2급 = 9 · 1급 = 10(업적 기준 7 · 5 · 3 · 2 · 1급, 2026-09-25) */
export function examGradeScore(grade: number | null): number {
    return grade === null ? 0 : 11 - grade;
}
export function examGradeFromScore(score: number): number {
    return 11 - score;
}

export const ACHIEVEMENT_DEFINITIONS: readonly AchievementDefinition[] = [
    // 실력
    {
        key: "s-rank",
        category: "skill",
        metric: "sRankCharts",
        thresholds: { 1: 10, 2: 50, 3: 200, 4: 500, 5: 1000 },
    },
    {
        key: "score-990k",
        category: "skill",
        metric: "score990kCharts",
        thresholds: { 1: 10, 2: 50, 3: 200, 4: 500, 5: 1000 },
    },
    {
        key: "full-combo",
        category: "skill",
        metric: "fullComboCharts",
        thresholds: { 1: 10, 2: 50, 3: 200, 4: 500, 5: 1000 },
    },
    {
        key: "pianist",
        category: "skill",
        metric: "pianistCharts",
        thresholds: { 1: 10, 2: 50, 3: 200, 4: 500, 5: 1000 },
    },
    {
        key: "real-s-rank",
        category: "skill",
        metric: "realSRankCharts",
        thresholds: { 1: 1, 2: 10, 3: 50, 4: 150, 5: 300 },
    },
    {
        key: "one-hand",
        category: "skill",
        metric: "oneHandSRankCharts",
        thresholds: { 1: 1, 2: 10, 3: 50, 4: 100, 5: 200 },
    },
    {
        key: "basic-grade",
        category: "skill",
        metric: "basicGrade",
        thresholds: { 1: 6000, 2: 6500, 3: 7000, 4: 7500, 5: 8000 },
    },
    // 수집 — 카테고리 곡 중 S 이상을 받은 곡(난이도 무관)의 비율
    {
        key: "category-bm",
        category: "collection",
        metric: "categoryBM",
        thresholds: { 1: 0.1, 2: 0.25, 3: 0.5, 4: 0.75, 5: 1 },
        unit: "ratio",
    },
    {
        key: "category-org",
        category: "collection",
        metric: "categoryOrg",
        thresholds: { 1: 0.1, 2: 0.25, 3: 0.5, 4: 0.75, 5: 1 },
        unit: "ratio",
    },
    {
        key: "category-cljz",
        category: "collection",
        metric: "categoryClJz",
        thresholds: { 1: 0.1, 2: 0.25, 3: 0.5, 4: 0.75, 5: 1 },
        unit: "ratio",
    },
    {
        key: "category-var",
        category: "collection",
        metric: "categoryVar",
        thresholds: { 1: 0.1, 2: 0.25, 3: 0.5, 4: 0.75, 5: 1 },
        unit: "ratio",
    },
    // 도전
    {
        key: "exam-basic",
        category: "challenge",
        metric: "examBasic",
        thresholds: { 1: 4, 2: 6, 3: 8, 4: 9, 5: 10 },
        unit: "exam",
    },
    {
        key: "exam-recital",
        category: "challenge",
        metric: "examRecital",
        thresholds: { 1: 4, 2: 6, 3: 8, 4: 9, 5: 10 },
        unit: "exam",
    },
    // 커뮤니티
    {
        key: "opinion",
        category: "community",
        metric: "opinions",
        thresholds: { 1: 1, 2: 10, 3: 30, 4: 50, 5: 100 },
    },
    {
        key: "helpful",
        category: "community",
        metric: "helpfulReceived",
        thresholds: { 1: 5, 2: 20, 3: 50, 4: 100, 5: 200 },
    },
    {
        key: "pattern-evaluation",
        category: "community",
        metric: "patternEvaluations",
        thresholds: { 1: 10, 2: 50, 3: 100, 4: 200, 5: 500 },
    },
];

/** 카테고리 업적이 보는 악곡 카테고리(`Music.category_short`) — 곡이 한두 곡뿐인 카테고리는 넣지 않는다 */
export const ACHIEVEMENT_MUSIC_CATEGORIES = {
    categoryBM: "BM",
    categoryOrg: "Org",
    categoryClJz: "Cl/Jz",
    categoryVar: "Var",
} as const satisfies Partial<Record<AchievementMetric, string>>;

const definitionByKey = new Map(
    ACHIEVEMENT_DEFINITIONS.map((definition) => [definition.key, definition])
);

export function getAchievementDefinition(key: string) {
    return definitionByKey.get(key) ?? null;
}

/** 비교할 값 — 비율 업적은 value / total, 곡이 없으면 0 */
export function achievementScore(
    definition: AchievementDefinition,
    metric: AchievementMetricValue
) {
    if (definition.unit !== "ratio") return metric.value;
    return metric.total ? metric.value / metric.total : 0;
}

export interface AchievementStep {
    tier: AchievementTier;
    threshold: number;
}

/** 이 업적의 단계들 — 등급 순(가진 등급만) */
export function achievementSteps(
    definition: AchievementDefinition
): AchievementStep[] {
    return ACHIEVEMENT_TIERS.flatMap((tier) => {
        const threshold = definition.thresholds[tier];
        return threshold === undefined ? [] : [{ tier, threshold }];
    });
}

/** 지금 값으로 닿은 가장 높은 등급 — 0 이면 아직 없음 */
export function achievementTierFor(
    definition: AchievementDefinition,
    metric: AchievementMetricValue
): 0 | AchievementTier {
    const score = achievementScore(definition, metric);
    let tier: 0 | AchievementTier = 0;
    for (const step of achievementSteps(definition))
        if (score >= step.threshold) tier = step.tier;
    return tier;
}

/** 이미 얻은 등급 위로, 이번 값으로 새로 닿은 단계들 */
export function newAchievementTiers(
    definition: AchievementDefinition,
    metric: AchievementMetricValue,
    earnedTier: number
): AchievementTier[] {
    const score = achievementScore(definition, metric);
    return achievementSteps(definition)
        .filter((step) => step.tier > earnedTier && score >= step.threshold)
        .map((step) => step.tier);
}

export interface AchievementProgress {
    /** 다음 단계의 등급 — 가진 단계를 다 얻었으면 null */
    nextTier: AchievementTier | null;
    /** 다음 단계 기준(비율 업적은 곡 수로 바꾼 값) */
    target: number | null;
    /** 지금 값(비율 업적은 곡 수) */
    current: number;
    /** 진행 막대 0–1 — 0 에서 다음 기준까지(osu! · Steam 처럼 단계마다 0 부터가 아니라 누적) */
    ratio: number;
}

/** 목록 · 상세의 진행 줄 — 얻은 단계 기준(값이 내려가도 얻은 단계는 유지) */
export function achievementProgress(
    definition: AchievementDefinition,
    metric: AchievementMetricValue,
    earnedTier: number
): AchievementProgress {
    const next = achievementSteps(definition).find(
        (step) => step.tier > earnedTier
    );
    const current = metric.value;
    if (!next) {
        return { nextTier: null, target: null, current, ratio: 1 };
    }
    const nextTier = next.tier;
    const threshold = next.threshold;
    const target =
        definition.unit === "ratio"
            ? Math.ceil(threshold * (metric.total ?? 0))
            : threshold;
    const ratio =
        definition.unit === "exam"
            ? current >= threshold
                ? 1
                : 0
            : target > 0
              ? Math.min(1, Math.max(0, current / target))
              : 0;
    return { nextTier, target, current, ratio };
}

/** 프로필 머리 자동 진열(P5) — 고른 것이 없을 때 높은 단계 · 달성 인원이 적은 순으로 3개 */
export const ACHIEVEMENT_SHOWCASE_SIZE = 3;

export interface EarnedAchievement {
    key: string;
    tier: number;
    recipients?: number;
}

export function autoShowcase(earned: readonly EarnedAchievement[]) {
    return [...earned]
        .filter((item) => getAchievementDefinition(item.key))
        .sort(
            (a, b) =>
                b.tier - a.tier ||
                (a.recipients ?? Number.MAX_SAFE_INTEGER) -
                    (b.recipients ?? Number.MAX_SAFE_INTEGER) ||
                ACHIEVEMENT_DEFINITIONS.findIndex((d) => d.key === a.key) -
                    ACHIEVEMENT_DEFINITIONS.findIndex((d) => d.key === b.key)
        )
        .slice(0, ACHIEVEMENT_SHOWCASE_SIZE);
}

/** 업적들이 가진 단계 수의 합 — 「업적 42 / 80」 의 분모(업적마다 단계 수가 다르다) */
export function achievementStepTotal(
    definitions: readonly AchievementDefinition[]
) {
    return definitions.reduce(
        (sum, definition) => sum + achievementSteps(definition).length,
        0
    );
}
export const ACHIEVEMENT_TIER_TOTAL = achievementStepTotal(
    ACHIEVEMENT_DEFINITIONS
);

/**
 * 점수 비공개(2026-09-18 S3) 프로필을 남이 볼 때는 점수에서 나온 업적(실력 · 수집)을 보이지 않는다 —
 * 단계만으로도 기록 범위가 드러나서. 도전 · 커뮤니티는 기여처럼 그대로 보인다.
 */
export const SCORE_BASED_ACHIEVEMENT_CATEGORIES: readonly AchievementCategory[] =
    ["skill", "collection"];

export function visibleAchievementDefinitions(scoresHidden: boolean) {
    return scoresHidden
        ? ACHIEVEMENT_DEFINITIONS.filter(
              (definition) =>
                  !SCORE_BASED_ACHIEVEMENT_CATEGORIES.includes(
                      definition.category
                  )
          )
        : ACHIEVEMENT_DEFINITIONS;
}

/** 얻은 단계 한 줄 — 날짜는 NosLog 가 확인한 때(2026-09-24 D-a) */
export interface AchievementRecord {
    key: string;
    tier: number;
    achievedAt: string;
}

/** 한 사람의 업적 원자료 — 프로필 캐시에 싣고, 요약 · 목록은 여기서 계산한다 */
export interface AchievementRecords {
    earned: AchievementRecord[];
    /** 프로필 머리에 건 업적 키(칸 순서) */
    pins: string[];
    /** `${key}:${tier}` → 그 단계를 얻은 사람 수(R1) */
    recipients: Record<string, number>;
}

export function recipientKey(key: string, tier: number) {
    return `${key}:${tier}`;
}

/** 보는 사람에게 넘길 자료만 — 점수 비공개면 실력 · 수집 줄을 뺀다 */
export function achievementRecordsForViewer(
    records: AchievementRecords,
    scoresHidden: boolean
): AchievementRecords {
    if (!scoresHidden) return records;
    const visible = new Set(
        visibleAchievementDefinitions(true).map((definition) => definition.key)
    );
    return {
        earned: records.earned.filter((item) => visible.has(item.key)),
        pins: records.pins.filter((key) => visible.has(key)),
        recipients: Object.fromEntries(
            Object.entries(records.recipients).filter(([key]) =>
                visible.has(key.split(":")[0])
            )
        ),
    };
}

/** 업적 키별 얻은 가장 높은 단계 */
export function highestAchievementTiers(earned: readonly AchievementRecord[]) {
    const tiers = new Map<string, number>();
    for (const item of earned)
        if (getAchievementDefinition(item.key))
            tiers.set(item.key, Math.max(tiers.get(item.key) ?? 0, item.tier));
    return tiers;
}

export interface AchievementSummary {
    /** 얻은 단계 수 · 전체 단계 수 — 「업적 23 / 51」 */
    earned: number;
    total: number;
    /** 머리 진열(P5) — 고른 것이 있으면 그것, 없으면 자동. 배지 도움말용 달성일 · 달성 인원 포함 */
    showcase: AchievementShowcaseItem[];
    /** 최근 얻은 단계(프로필 구역) */
    recent: AchievementRecord[];
    /** 세는 단계 줄 전부(보이는 업적 · 가진 등급만) — 분류 칩 수 */
    earnedRecords: AchievementRecord[];
}

export interface AchievementShowcaseItem {
    key: string;
    tier: number;
    achievedAt?: string;
    recipients?: number;
}

export const ACHIEVEMENT_RECENT_COUNT = 3;

export function summarizeAchievements(
    records: AchievementRecords,
    scoresHidden = false
): AchievementSummary {
    const definitions = visibleAchievementDefinitions(scoresHidden);
    const visible = new Set(definitions.map((definition) => definition.key));
    // 정의에 없는 업적 · 그 업적이 갖지 않은 등급의 줄은 세지 않는다(단계 구성을 바꿔도 분모와 맞게)
    const earned = records.earned.filter(
        (item) =>
            visible.has(item.key) &&
            getAchievementDefinition(item.key)?.thresholds[
                item.tier as AchievementTier
            ] !== undefined
    );
    const highest = highestAchievementTiers(earned);
    const pinned = records.pins
        .filter((key) => highest.has(key))
        .map((key) => ({ key, tier: highest.get(key) ?? 0 }));
    const chosen = pinned.length
        ? pinned
        : autoShowcase(
              [...highest].map(([key, tier]) => ({
                  key,
                  tier,
                  recipients: records.recipients[recipientKey(key, tier)],
              }))
          ).map(({ key, tier }) => ({ key, tier }));
    const showcase: AchievementShowcaseItem[] = chosen.map(({ key, tier }) => ({
        key,
        tier,
        achievedAt: earned.find(
            (item) => item.key === key && item.tier === tier
        )?.achievedAt,
        recipients: records.recipients[recipientKey(key, tier)],
    }));
    return {
        earned: earned.length,
        earnedRecords: earned,
        total: achievementStepTotal(definitions),
        showcase,
        recent: [...earned]
            .sort(
                (a, b) =>
                    b.achievedAt.localeCompare(a.achievedAt) || b.tier - a.tier
            )
            .slice(0, ACHIEVEMENT_RECENT_COUNT),
    };
}

/**
 * 「기준에 못 미치는 단계도 빼기」(2026-09-25 R1)에서 뺄 줄 — 없어진 업적(예: 빙고) · 그 업적이 갖지 않은 등급 ·
 * 지금 값이 그 등급 기준에 못 미치는 단계. 관리자가 켤 때만 쓴다(평소 판정은 빼지 않는다).
 */
export function staleAchievementRows<T extends { key: string; tier: number }>(
    rows: readonly T[],
    metrics: AchievementMetrics
): T[] {
    return rows.filter((row) => {
        const definition = getAchievementDefinition(row.key);
        if (!definition) return true;
        const threshold = definition.thresholds[row.tier as AchievementTier];
        if (threshold === undefined) return true;
        return (
            achievementScore(definition, metrics[definition.metric]) < threshold
        );
    });
}
