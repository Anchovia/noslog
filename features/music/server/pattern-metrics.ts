import "server-only";

import type { Prisma } from "@prisma/client";
import { unstable_cache } from "next/cache";

import { buildPatternTendency } from "@/features/music/lib/pattern-tendency";
import { PUBLIC_DATA_REVALIDATE_SECONDS } from "@/lib/cache-policy";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { songMeterLevel } from "@/lib/chart-pattern/meterRecord";
import {
    computePatternMetrics,
    type MeterLevel,
    PATTERN_METRICS_VERSION,
} from "@/lib/chart-pattern/patternMetrics";
import type { ChartDocument } from "@/lib/chart-pattern/schema";
import db from "@/lib/db";

/** 공개 트랜잭션 안에서 부른다 — 이 공개본으로 그 채보의 원점수를 바꾼다 */
export async function savePatternMetrics(
    transaction: Prisma.TransactionClient,
    chartId: number,
    document: ChartDocument,
    publishedRevision: number
) {
    const chart = await transaction.musicChart.findUniqueOrThrow({
        where: { id: chartId },
        select: { musicIdx: true },
    });
    const data = {
        version: PATTERN_METRICS_VERSION,
        publishedRevision,
        ...computePatternMetrics(document, {
            songMeter: songMeterLevel(chart.musicIdx),
        }),
    };
    await transaction.chartPatternMetric.upsert({
        where: { chartId },
        create: { chartId, ...data },
        update: data,
    });
}

async function getPatternMetricRows() {
    const rows = await db.chartPatternMetric.findMany({
        where: { version: PATTERN_METRICS_VERSION },
        select: {
            chartId: true,
            stairs: true,
            repetition: true,
            polyrhythm: true,
            offset: true,
            chords: true,
            tempoChanges: true,
            tenutoCount: true,
            glissandoCount: true,
            trillCount: true,
            chart: { select: { difficulty: true } },
        },
    });
    return rows.map(({ chart, chords, ...row }) => ({
        ...row,
        chords: chords as MeterLevel | null,
        difficulty: chart.difficulty,
    }));
}

// 원점수 표는 모두에게 같고 100% 기준이 공개 채보 전체에 걸린다 — 채보를 공개할 때 태그로 통째로 비운다
const getCachedPatternMetricRows = unstable_cache(
    getPatternMetricRows,
    [`pattern-metrics-v${PATTERN_METRICS_VERSION}`],
    {
        tags: [CACHE_TAGS.patternMetrics],
        revalidate: PUBLIC_DATA_REVALIDATE_SECONDS,
    }
);

export async function getPatternTendency(chartId: number) {
    return buildPatternTendency(await getCachedPatternMetricRows(), chartId);
}
