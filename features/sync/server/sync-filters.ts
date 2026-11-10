import "server-only";

import type { SyncMusicInput } from "@/features/sync/schemas/sync-request-schema";
import type { ChartIdMap } from "@/features/sync/server/chart-ids";
import {
    type ChartLimitMap,
    isWithinChartLimits,
} from "@/features/sync/server/chart-limits";

type SkippedChart = {
    musicIndex: string;
    difficulty: string;
};

export function filterKnownMusic(
    music: SyncMusicInput[],
    knownCharts: ChartIdMap
) {
    const skippedCharts: SkippedChart[] = [];
    const knownMusic = music.flatMap((item) => {
        const sheet = item.sheet.filter((chart) => {
            const known = knownCharts.has(
                `${item["@index"]}:${chart.difficulty}`
            );
            if (!known) {
                skippedCharts.push({
                    musicIndex: item["@index"],
                    difficulty: chart.difficulty,
                });
            }
            return known;
        });

        return sheet.length > 0 ? [{ ...item, sheet }] : [];
    });

    return { knownMusic, skippedCharts };
}

export function formatSkippedCharts(skippedCharts: SkippedChart[]) {
    skippedCharts = [
        ...new Map(
            skippedCharts.map((chart) => [
                `${chart.musicIndex}:${chart.difficulty}`,
                chart,
            ])
        ).values(),
    ];
    if (skippedCharts.length === 0) return null;

    const preview = skippedCharts
        .slice(0, 20)
        .map((chart) => `${chart.musicIndex} (${chart.difficulty})`)
        .join(", ");
    const remainder = skippedCharts.length - 20;

    return `DB에 등록되지 않은 채보 ${skippedCharts.length}개를 건너뛰었습니다: ${preview}${remainder > 0 ? ` 외 ${remainder}개` : ""}`;
}

export function dropOutOfRangeSheets(
    music: SyncMusicInput[],
    limits: ChartLimitMap,
    chartIds: ChartIdMap
) {
    const rejectedChartIds: number[] = [];
    const kept = music.flatMap((item) => {
        const sheet = item.sheet.filter((chart) => {
            const key = `${item["@index"]}:${chart.difficulty}`;
            const within = isWithinChartLimits(limits.get(key), {
                difficulty: chart.difficulty,
                judge: chart.judge,
                maxCombo: chart.max_combo,
                gradeBasic: chart.grade_basic,
                gradeRecital: chart.grade_recital,
            });
            const chartId = chartIds.get(key);
            if (!within && chartId) rejectedChartIds.push(chartId);
            return within;
        });
        return sheet.length > 0 ? [{ ...item, sheet }] : [];
    });
    return { kept, rejectedChartIds };
}

// 공식 응답에는 같은 채보가 두 번 오지 않는다. 받으면 클리어 랭크 수가 부푼다
export function hasDuplicateCharts(music: SyncMusicInput[]) {
    const seen = new Set<string>();
    for (const item of music) {
        for (const chart of item.sheet) {
            const key = `${item["@index"]}:${chart.difficulty}`;
            if (seen.has(key)) return true;
            seen.add(key);
        }
    }
    return false;
}

export function joinNotices(...notices: (string | null)[]) {
    const text = notices.filter(Boolean).join(" ");
    return text || null;
}

export function formatOutOfRange(rejected: number) {
    return rejected > 0
        ? `채보 노트 수 · 최대 Grd 를 벗어난 기록 ${rejected}개를 저장하지 않았습니다.`
        : null;
}
