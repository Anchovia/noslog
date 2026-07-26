import { loadEnvFile } from "node:process";

import { PrismaClient } from "@prisma/client";

import {
    BASIC_RATING_CURVES,
    BASIC_RATING_POLICY_VERSION,
    BASIC_RATING_SCORE_FLOOR,
    BASIC_RATING_TOP_COUNT,
    calculateBasicRating,
    calculateBasicRatingTheoreticalMax,
    type BasicRatingCurveId,
    type BasicRatingRecord,
} from "../lib/tiers/basicRating";

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

const jsonOutput = process.argv.includes("--json");
const requestedCurve = process.argv
    .find((argument) => argument.startsWith("--curve="))
    ?.split("=")[1] as BasicRatingCurveId | undefined;
const curveIds = Object.keys(BASIC_RATING_CURVES) as BasicRatingCurveId[];

if (requestedCurve && !curveIds.includes(requestedCurve)) {
    throw new Error(
        `지원하지 않는 곡선입니다: ${requestedCurve}. ${curveIds.join(", ")} 중 하나를 사용하세요.`
    );
}

const selectedCurveIds = requestedCurve ? [requestedCurve] : curveIds;
const db = new PrismaClient();

function round(value: number, digits = 2) {
    const scale = 10 ** digits;
    return Math.round(value * scale) / scale;
}

function median(values: number[]) {
    if (values.length === 0) return 0;
    const sorted = [...values].sort((left, right) => left - right);
    const middle = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0
        ? (sorted[middle - 1] + sorted[middle]) / 2
        : sorted[middle];
}

function formatNumber(value: number, digits = 2) {
    return new Intl.NumberFormat("ko-KR", {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits,
    }).format(value);
}

try {
    const tierList = await db.tierList.findUnique({
        where: { slug: "basic-pianist" },
        select: {
            id: true,
            slug: true,
            title: true,
            status: true,
            updatedAt: true,
            entries: {
                select: {
                    chartId: true,
                    tierBand: { select: { value: true } },
                    chart: {
                        select: {
                            difficulty: true,
                            music: {
                                select: { index: true, title: true },
                            },
                        },
                    },
                },
            },
        },
    });

    if (!tierList || tierList.status !== "published") {
        throw new Error("공개된 Basic Pianist 서열표를 찾지 못했습니다.");
    }
    if (tierList.entries.length < BASIC_RATING_TOP_COUNT) {
        throw new Error(
            `서열표 채보가 ${tierList.entries.length}개뿐이라 Top ${BASIC_RATING_TOP_COUNT}을 계산할 수 없습니다.`
        );
    }

    const theoreticalMax = calculateBasicRatingTheoreticalMax(
        tierList.entries.map((entry) => entry.tierBand.value)
    );
    const entryByChartId = new Map(
        tierList.entries.map((entry) => [
            entry.chartId,
            {
                tierConstant: entry.tierBand.value,
                title: entry.chart.music.title,
                difficulty: entry.chart.difficulty,
                musicIndex: entry.chart.music.index,
            },
        ])
    );

    const playRecords = await db.playData.findMany({
        where: {
            chart_id: { in: [...entryByChartId.keys()] },
            score: { gte: BASIC_RATING_SCORE_FLOOR },
        },
        select: {
            user_id: true,
            chart_id: true,
            score: true,
            user: {
                select: {
                    username: true,
                    nostalgia_name: true,
                    grade_basic: true,
                },
            },
        },
    });

    const users = new Map<
        number,
        {
            userId: number;
            name: string;
            gradeBasic: number | null;
            records: BasicRatingRecord[];
        }
    >();

    for (const record of playRecords) {
        if (record.chart_id === null) continue;
        const entry = entryByChartId.get(record.chart_id);
        if (!entry) continue;

        const user = users.get(record.user_id) ?? {
            userId: record.user_id,
            name:
                record.user.nostalgia_name ??
                record.user.username ??
                `User ${record.user_id}`,
            gradeBasic: record.user.grade_basic,
            records: [],
        };
        user.records.push({
            chartId: record.chart_id,
            score: record.score,
            tierConstant: entry.tierConstant,
        });
        users.set(record.user_id, user);
    }

    const rankings = Object.fromEntries(
        selectedCurveIds.map((curveId) => {
            const rows = [...users.values()]
                .map((user) => ({
                    userId: user.userId,
                    name: user.name,
                    gradeBasic: user.gradeBasic,
                    result: calculateBasicRating(
                        user.records,
                        theoreticalMax,
                        curveId
                    ),
                }))
                .sort(
                    (left, right) =>
                        right.result.rating - left.result.rating ||
                        right.result.rawTotal - left.result.rawTotal ||
                        left.userId - right.userId
                )
                .map((row, index) => ({
                    rank: index + 1,
                    userId: row.userId,
                    name: row.name,
                    gradeBasic: row.gradeBasic,
                    rating: round(row.result.rating, 4),
                    filledSlots: row.result.filledSlots,
                    cutlinePoints: round(row.result.cutlinePoints, 4),
                    topContributions: row.result.contributions
                        .slice(0, 10)
                        .map((contribution) => {
                            const entry = entryByChartId.get(
                                contribution.chartId
                            )!;
                            return {
                                chartId: contribution.chartId,
                                musicIndex: entry.musicIndex,
                                title: entry.title,
                                difficulty: entry.difficulty,
                                tierConstant: contribution.tierConstant,
                                score: contribution.score,
                                coefficient: round(contribution.coefficient, 6),
                                points: round(contribution.points, 6),
                            };
                        }),
                }));

            return [curveId, rows];
        })
    ) as Record<
        BasicRatingCurveId,
        Array<{
            rank: number;
            userId: number;
            name: string;
            gradeBasic: number | null;
            rating: number;
            filledSlots: number;
            cutlinePoints: number;
            topContributions: unknown[];
        }>
    >;

    const fullSampleCount = [...users.values()].filter(
        (user) => user.records.length >= BASIC_RATING_TOP_COUNT
    ).length;
    const report = {
        generatedAt: new Date().toISOString(),
        readOnly: true,
        policy: {
            version: BASIC_RATING_POLICY_VERSION,
            tierList: tierList.slug,
            tierListUpdatedAt: tierList.updatedAt.toISOString(),
            entryCount: tierList.entries.length,
            topCount: BASIC_RATING_TOP_COUNT,
            scoreFloor: BASIC_RATING_SCORE_FLOOR,
            tierWeight: "tierConstant^2",
            ratingMax: 10_000,
            theoreticalMax: round(theoreticalMax, 6),
        },
        sample: {
            usersWithEligibleRecords: users.size,
            usersWithTop100Filled: fullSampleCount,
            sufficientForDistributionDecision: fullSampleCount >= 20,
        },
        curves: Object.fromEntries(
            selectedCurveIds.map((curveId) => {
                const rows = rankings[curveId];
                const ratings = rows.map((row) => row.rating);
                return [
                    curveId,
                    {
                        label: BASIC_RATING_CURVES[curveId].label,
                        description: BASIC_RATING_CURVES[curveId].description,
                        anchors: BASIC_RATING_CURVES[curveId].anchors,
                        summary: {
                            average: round(
                                ratings.reduce(
                                    (sum, rating) => sum + rating,
                                    0
                                ) / Math.max(1, ratings.length),
                                4
                            ),
                            median: round(median(ratings), 4),
                            maximum: round(Math.max(0, ...ratings), 4),
                        },
                        ranking: rows,
                    },
                ];
            })
        ),
    };

    if (jsonOutput) {
        console.log(JSON.stringify(report, null, 2));
    } else {
        console.log("NosLog Basic 서열 레이팅 시뮬레이션 (읽기 전용)");
        console.log(
            `서열표: ${tierList.title} · ${tierList.entries.length.toLocaleString("ko-KR")}개 채보`
        );
        console.log(
            `정책: S 이상 · 채보별 최고 기록 · Top ${BASIC_RATING_TOP_COUNT} · 서열 상수² · 만점 10,000`
        );
        console.log(
            `표본: 대상 ${users.size}명 · Top 100 충족 ${fullSampleCount}명`
        );
        if (fullSampleCount < 20) {
            console.log(
                "주의: Top 100을 채운 사용자가 20명 미만이라 전체 분포 확정에는 표본이 부족합니다."
            );
        }

        for (const curveId of selectedCurveIds) {
            const curve = report.curves[curveId];
            console.log(
                `\n[${curve.label}] ${curve.description}\n` +
                    BASIC_RATING_CURVES[curveId].anchors
                        .map(
                            ([score, coefficient]) =>
                                `${(score / 1000).toFixed(0)}k ${(coefficient * 100).toFixed(0)}%`
                        )
                        .join(" · ")
            );

            for (const row of rankings[curveId].slice(0, 20)) {
                const displayedGrade =
                    row.gradeBasic && row.gradeBasic > 0
                        ? Math.round(row.gradeBasic / 100).toLocaleString(
                              "ko-KR"
                          )
                        : "-";
                console.log(
                    `${String(row.rank).padStart(2, " ")}. ${row.name} (#${row.userId}) ` +
                        `${formatNumber(row.rating)}점 · ${row.filledSlots}/100곡 · Grd ${displayedGrade}`
                );
            }
        }
    }
} finally {
    await db.$disconnect();
}
