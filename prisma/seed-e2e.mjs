import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const databaseUrl = process.env.DATABASE_URL;

function assertSafeDatabase() {
    if (process.env.E2E_SEED !== "1" || !databaseUrl) {
        throw new Error("E2E_SEED=1과 DATABASE_URL이 필요합니다.");
    }

    const { hostname } = new URL(databaseUrl);
    if (!["localhost", "127.0.0.1", "postgres"].includes(hostname)) {
        throw new Error("E2E 시드는 로컬 테스트 DB에서만 실행할 수 있습니다.");
    }
}

async function seed() {
    assertSafeDatabase();

    const music = await prisma.music.upsert({
        where: { index: "e2e-music-001" },
        update: {
            title: "E2E Music",
            title_kana: "E2E Music",
            artist: "NosLog Test",
            category: "Original",
            category_short: "Org",
            background: "/bg/0ff2ac56c4fd26219090d5b5cfcad29c.png",
        },
        create: {
            index: "e2e-music-001",
            title: "E2E Music",
            title_kana: "E2E Music",
            artist: "NosLog Test",
            category: "Original",
            category_short: "Org",
            background: "/bg/0ff2ac56c4fd26219090d5b5cfcad29c.png",
        },
    });

    const chartDefinitions = [
        { difficulty: "Normal", level: 4, level_constant: 4 },
        { difficulty: "Hard", level: 7, level_constant: 7 },
        { difficulty: "Expert", level: 10, level_constant: 10.2 },
        { difficulty: "Real", level: 2, level_constant: 12 },
    ];
    const charts = new Map();

    for (const chart of chartDefinitions) {
        const savedChart = await prisma.musicChart.upsert({
            where: {
                music_idx_difficulty: {
                    music_idx: music.index,
                    difficulty: chart.difficulty,
                },
            },
            update: chart,
            create: {
                ...chart,
                music_idx: music.index,
            },
        });
        charts.set(chart.difficulty, savedChart);
    }

    await prisma.user.upsert({
        where: { username: "E2E_RANKER" },
        update: {
            country: "ko-KR",
            grade_basic: 568_300,
            grade_recital: 521_000,
        },
        create: {
            username: "E2E_RANKER",
            country: "ko-KR",
            grade_basic: 568_300,
            grade_recital: 521_000,
        },
    });

    await prisma.tierList.deleteMany({
        where: { slug: "e2e-basic-tier" },
    });
    const tierList = await prisma.tierList.findUnique({
        where: { slug: "basic-s" },
    });
    if (!tierList) {
        throw new Error("Basic S 서열표 마이그레이션이 적용되지 않았습니다.");
    }

    const tierBand = await prisma.tierBand.findUnique({
        where: {
            tierListId_value: {
                tierListId: tierList.id,
                value: 10.2,
            },
        },
    });
    if (!tierBand) {
        throw new Error("Basic S 서열표의 10.2 구간을 찾을 수 없습니다.");
    }

    await prisma.tierEntry.deleteMany({
        where: { tierListId: tierList.id },
    });
    await prisma.tierEntry.create({
        data: {
            position: 1,
            tierListId: tierList.id,
            tierBandId: tierBand.id,
            chartId: charts.get("Expert").id,
        },
    });

    await prisma.bingo.deleteMany({ where: { title: "E2E 빙고" } });
    await prisma.bingo.create({
        data: {
            title: "E2E 빙고",
            description: "Playwright 공개 화면 검증용 빙고",
            rewardNos: 3_000,
            requiredLines: 1,
            status: "published",
            coverMusicIndex: music.index,
            cells: {
                create: Array.from({ length: 25 }, (_, index) => ({
                    position: index + 1,
                    title: `E2E 미션 ${index + 1}`,
                    missionType: "record",
                    ruleType: "manual",
                })),
            },
        },
    });

    await prisma.exam.deleteMany({ where: { slug: "e2e-event-exam" } });
    await prisma.exam.create({
        data: {
            slug: "e2e-event-exam",
            mode: "event",
            shortLabel: "E2E",
            scoringType: "score",
            title: "E2E 이벤트 검정",
            description: "Playwright 공개 화면 검증용 검정",
            feeNos: 2_000,
            requiredGrade: 0,
            status: "published",
            stages: {
                create: [
                    {
                        position: 1,
                        label: "1st",
                        requirementType: "single",
                        requiredValue: 900_000,
                        musicIndex: music.index,
                        allowedCharts: {
                            create: [{ chartId: charts.get("Expert").id }],
                        },
                    },
                ],
            },
            rewards: {
                create: [
                    {
                        position: 1,
                        type: "music",
                        label: music.title,
                        musicIndex: music.index,
                    },
                ],
            },
        },
    });
}

try {
    await seed();
    console.log("E2E seed completed.");
} finally {
    await prisma.$disconnect();
}
