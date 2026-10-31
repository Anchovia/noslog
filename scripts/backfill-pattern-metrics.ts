// 패턴 경향 원점수 채우기 — 공개 채보마다 chart_pattern_metrics 한 줄을 지금 계산식으로 다시 쓴다.
// 공개 화면 저장 · 기여 반영은 그때그때 계산하지만, SQL 로 한꺼번에 공개한 채보, 계산식 버전을 올리거나 곡별 변박 기록(lib/chart-pattern/meterRecord.json)을 고친 뒤에는 이걸로 채운다.
// 실행: npm run db:backfill:pattern-metrics(.env 의 DB). 다른 DB 는 --env-file=<파일>
import { loadEnvFile } from "node:process";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

import { songMeterLevel } from "../lib/chart-pattern/meterRecord";
import {
    computePatternMetrics,
    isMeterKnown,
    PATTERN_METRICS_VERSION,
} from "../lib/chart-pattern/patternMetrics";
import { chartDocumentSchema } from "../lib/chart-pattern/schema";

const envFile = process.argv
    .find((argument) => argument.startsWith("--env-file="))
    ?.split("=")
    .slice(1)
    .join("=");

if (envFile) {
    loadEnvFile(envFile);
} else if (!process.env.DATABASE_URL) {
    loadEnvFile(".env");
}

const db = new PrismaClient({
    adapter: new PrismaPg({
        connectionString: process.env.DATABASE_URL,
        options: "-c TimeZone=UTC",
    }),
});

async function main() {
    const patterns = await db.chartPattern.findMany({
        where: { publishedRevision: { not: null } },
        select: {
            chartId: true,
            publishedRevision: true,
            publishedContent: true,
            chart: { select: { musicIdx: true } },
            revisions: {
                where: { kind: { not: "publish" } },
                orderBy: { number: "desc" },
                select: { number: true, kind: true },
            },
        },
    });
    let written = 0;
    const invalid: number[] = [];
    for (const pattern of patterns) {
        const publishedRevision = pattern.publishedRevision!;
        const document = chartDocumentSchema.safeParse(
            pattern.publishedContent
        );
        if (!document.success) {
            invalid.push(pattern.chartId);
            continue;
        }
        const lastEdit = pattern.revisions.find(
            (revision) => revision.number <= publishedRevision
        );
        const data = {
            version: PATTERN_METRICS_VERSION,
            publishedRevision,
            ...computePatternMetrics(document.data, {
                meterKnown: isMeterKnown(lastEdit?.kind),
                songMeter: songMeterLevel(pattern.chart.musicIdx),
            }),
        };
        await db.chartPatternMetric.upsert({
            where: { chartId: pattern.chartId },
            create: { chartId: pattern.chartId, ...data },
            update: data,
        });
        written++;
    }
    console.log(
        `공개 채보 ${patterns.length}개 중 ${written}개 원점수를 썼습니다(계산식 v${PATTERN_METRICS_VERSION}).`
    );
    if (invalid.length) {
        console.error(
            `형식이 맞지 않아 건너뛴 채보 ${invalid.length}개: chart_id ${invalid.join(", ")}`
        );
        process.exitCode = 1;
    }
}

main().finally(() => db.$disconnect());
