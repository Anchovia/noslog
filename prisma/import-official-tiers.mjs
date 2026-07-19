import fs from "node:fs";
import { loadEnvFile } from "node:process";

import { PrismaClient } from "@prisma/client";

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

const shouldApply = process.argv.includes("--apply");
const db = new PrismaClient();
const definitions = JSON.parse(
    fs.readFileSync(
        new URL("./data/official-tier-lists.json", import.meta.url),
        "utf8"
    )
);
const titleCollator = new Intl.Collator("ja", {
    numeric: true,
    sensitivity: "base",
});

function constantKey(value) {
    return Number(value).toFixed(4);
}

function groupCharts(charts) {
    const groups = new Map();

    for (const chart of charts) {
        const value = Number(chart.level_constant);
        const key = constantKey(value);
        const group = groups.get(key) ?? { value, charts: [] };
        group.charts.push(chart);
        groups.set(key, group);
    }

    return [...groups.values()].sort((left, right) => right.value - left.value);
}

function validateDefinitions() {
    const slugs = new Set();
    for (const definition of definitions) {
        if (slugs.has(definition.slug)) {
            throw new Error(`중복된 서열표 slug: ${definition.slug}`);
        }
        if (!["basic", "recital"].includes(definition.mode)) {
            throw new Error(`지원하지 않는 모드: ${definition.mode}`);
        }
        if (!["Expert", "Real"].includes(definition.difficulty)) {
            throw new Error(`지원하지 않는 난이도: ${definition.difficulty}`);
        }
        slugs.add(definition.slug);
    }
}

async function loadCharts(difficulty) {
    const charts = await db.musicChart.findMany({
        where: { difficulty, level_constant: { not: null } },
        select: {
            id: true,
            level_constant: true,
            music: {
                select: {
                    index: true,
                    title: true,
                    title_kana: true,
                },
            },
        },
    });

    charts.sort((left, right) => {
        const titleResult = titleCollator.compare(
            left.music.title_kana || left.music.title,
            right.music.title_kana || right.music.title
        );
        return (
            titleResult ||
            titleCollator.compare(left.music.title, right.music.title) ||
            left.music.index.localeCompare(right.music.index)
        );
    });

    return charts;
}

async function findExistingList(definition) {
    const candidates = await db.tierList.findMany({
        where: {
            slug: { in: [definition.slug, ...definition.legacySlugs] },
        },
        select: { id: true, slug: true, title: true },
    });

    if (candidates.length > 1) {
        throw new Error(
            `${definition.title}: 현재 slug와 이전 slug의 서열표가 동시에 존재합니다.`
        );
    }

    return candidates[0] ?? null;
}

async function replaceTierList(definition, groups, existing) {
    return db.$transaction(
        async (transaction) => {
            const tierList = existing
                ? await transaction.tierList.update({
                      where: { id: existing.id },
                      data: {
                          slug: definition.slug,
                          title: definition.title,
                          mode: definition.mode,
                          description: definition.description,
                          status: "published",
                      },
                  })
                : await transaction.tierList.create({
                      data: {
                          slug: definition.slug,
                          title: definition.title,
                          mode: definition.mode,
                          description: definition.description,
                          status: "published",
                      },
                  });

            await transaction.tierPlacementHistory.deleteMany({
                where: { tierListId: tierList.id },
            });
            await transaction.tierEntry.deleteMany({
                where: { tierListId: tierList.id },
            });
            await transaction.tierBand.deleteMany({
                where: { tierListId: tierList.id },
            });

            await transaction.tierBand.createMany({
                data: groups.map((group, position) => ({
                    tierListId: tierList.id,
                    value: group.value,
                    position,
                })),
            });

            const bands = await transaction.tierBand.findMany({
                where: { tierListId: tierList.id },
                select: { id: true, value: true },
            });
            const bandIdByValue = new Map(
                bands.map((band) => [constantKey(band.value), band.id])
            );
            const entries = groups.flatMap((group) => {
                const tierBandId = bandIdByValue.get(constantKey(group.value));
                if (!tierBandId) {
                    throw new Error(
                        `${group.value}: 생성한 상수 구간을 찾지 못했습니다.`
                    );
                }
                return group.charts.map((chart, position) => ({
                    tierListId: tierList.id,
                    tierBandId,
                    chartId: chart.id,
                    position,
                }));
            });

            await transaction.tierEntry.createMany({ data: entries });
            await transaction.tierPlacementHistory.createMany({
                data: groups.flatMap((group) =>
                    group.charts.map((chart) => ({
                        tierListId: tierList.id,
                        chartId: chart.id,
                        bandValue: group.value,
                    }))
                ),
            });

            return { id: tierList.id, entries: entries.length };
        },
        { maxWait: 15_000, timeout: 120_000 }
    );
}

async function main() {
    validateDefinitions();
    const difficulties = [
        ...new Set(definitions.map((item) => item.difficulty)),
    ];
    const chartsByDifficulty = new Map();

    for (const difficulty of difficulties) {
        const charts = await loadCharts(difficulty);
        if (charts.length === 0) {
            throw new Error(
                `${difficulty}: 공식 상수가 등록된 채보가 없습니다.`
            );
        }
        chartsByDifficulty.set(difficulty, charts);
    }

    for (const definition of definitions) {
        const charts = chartsByDifficulty.get(definition.difficulty);
        const groups = groupCharts(charts);
        const existing = await findExistingList(definition);
        const summary = `${definition.title}: ${groups.length}개 구간, ${charts.length}곡`;

        if (!shouldApply) {
            console.log(
                `${summary} (${existing ? `${existing.title}#${existing.id} 재사용` : "새로 생성"})`
            );
            continue;
        }

        const result = await replaceTierList(definition, groups, existing);
        console.log(`${summary} 저장 완료 (ID ${result.id})`);
    }

    if (!shouldApply) {
        console.log(
            "\n미리보기만 완료했습니다. 저장하려면 --apply를 추가하세요."
        );
    }
}

main()
    .catch((error) => {
        console.error(error);
        process.exitCode = 1;
    })
    .finally(async () => {
        await db.$disconnect();
    });
