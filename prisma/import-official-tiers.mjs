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

    for (let unit = 145; unit >= 10; unit -= 1) {
        const value = unit / 10;
        groups.set(constantKey(value), { value, charts: [] });
    }

    for (const chart of charts) {
        const value = Number(chart.level_constant);
        const key = constantKey(value);
        const group = groups.get(key);
        if (!group) {
            throw new Error(
                `${chart.music.title} ${chart.difficulty}: 서열 상수 ${value}가 1.0~14.5 범위를 벗어났습니다.`
            );
        }
        group.charts.push(chart);
    }

    return [...groups.values()];
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
        if (!["s", "fc", "pianist"].includes(definition.goal)) {
            throw new Error(`지원하지 않는 목표: ${definition.goal}`);
        }
        slugs.add(definition.slug);
    }
}

async function loadCharts() {
    const charts = await db.musicChart.findMany({
        where: { level_constant: { not: null } },
        select: {
            id: true,
            difficulty: true,
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
            left.music.index.localeCompare(right.music.index) ||
            left.difficulty.localeCompare(right.difficulty)
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
                          goal: definition.goal,
                          description: definition.description,
                          status: "published",
                      },
                  })
                : await transaction.tierList.create({
                      data: {
                          slug: definition.slug,
                          title: definition.title,
                          mode: definition.mode,
                          goal: definition.goal,
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
                    position: position + 1,
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
    const charts = await loadCharts();
    if (charts.length === 0) {
        throw new Error("공식 상수가 등록된 채보가 없습니다.");
    }

    for (const definition of definitions) {
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
