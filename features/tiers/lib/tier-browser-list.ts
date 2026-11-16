import type {
    TierBrowserBand,
    TierBrowserBandSummary,
    TierBrowserEntry,
} from "@/features/tiers/schemas/tier-browser-schema";
import type { TierGoal } from "@/lib/tiers/tier-scope";
import { isTierGoalAchieved } from "@/lib/tiers/tier-scope";

/** 곡 검색 — 서버 검색과 같은 칸(곡 코드 · 제목 · 가나 · 아티스트 · 승인된 번역 제목)의 대소문자 무시 부분 일치 */
export function matchesTierBrowserSearch(
    music: TierBrowserEntry["chart"]["music"],
    q: string
) {
    const needle = q.toLowerCase();
    return [
        music.index,
        music.title,
        music.reading,
        music.artist,
        ...music.translations,
    ].some((value) => value?.toLowerCase().includes(needle));
}

/** 받아 둔 서열표에 내 기록을 붙이고 검색어로 좁힌다(구간 id → 구간). records 가 null 이면 기록을 그대로 둔다 */
export function selectTierBrowserBands(
    bands: readonly TierBrowserBand[],
    records: Record<string, NonNullable<TierBrowserEntry["record"]>> | null,
    q: string
) {
    return new Map(
        bands.map((band) => [
            band.id,
            {
                ...band,
                entries: band.entries
                    .filter(
                        (entry) =>
                            !q || matchesTierBrowserSearch(entry.chart.music, q)
                    )
                    .map((entry) =>
                        records
                            ? {
                                  ...entry,
                                  record: records[entry.chartId] ?? null,
                              }
                            : entry
                    ),
            },
        ])
    );
}

/** 좁힌 구간으로 구간별 곡 수 · 달성 수를 다시 센다 — 검색 중에는 서버 개요 대신 이 값을 쓴다 */
export function summarizeTierBrowserBands(
    summaries: readonly TierBrowserBandSummary[],
    bands: ReadonlyMap<number, TierBrowserBand>,
    goal: TierGoal,
    signedIn: boolean
): TierBrowserBandSummary[] {
    return summaries.map((summary) => {
        const entries = bands.get(summary.id)?.entries ?? [];
        return {
            ...summary,
            totalCount: entries.length,
            achievedCount: signedIn
                ? entries.filter((entry) =>
                      isTierGoalAchieved(entry.record, goal)
                  ).length
                : null,
        };
    });
}
