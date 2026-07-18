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
const sourceMusics = JSON.parse(
    fs.readFileSync(
        new URL("./data/nosdata-musics.json", import.meta.url),
        "utf8"
    )
);

const categoryNames = {
    BM: "BEMANI楽曲",
    Org: "ノスタルジアオリジナル",
    "Cl/Jz": "クラシック/ジャズ",
    Var: "バラエティ",
    anime: "アニメ",
    pops: "ポップス",
};

function normalize(value) {
    return (value ?? "")
        .normalize("NFKC")
        .toLocaleLowerCase("ja-JP")
        .replace(
            /[\s\u3000'’`´・･~～\-‐‑‒–—―「」『』“”".,:!?/\\()[\]{}†★☆◆◇=+]/g,
            ""
        );
}

function validateSource() {
    const indexes = new Set();
    const allowedDifficulties = new Set(["Normal", "Hard", "Expert", "Real"]);

    for (const music of sourceMusics) {
        if (indexes.has(music.index)) {
            throw new Error(`중복 악곡 ID: ${music.index}`);
        }
        indexes.add(music.index);

        if (!categoryNames[music.categoryShort]) {
            throw new Error(`${music.title}: 알 수 없는 카테고리입니다.`);
        }

        const difficulties = new Set();
        for (const chart of music.levels) {
            if (!allowedDifficulties.has(chart.difficulty)) {
                throw new Error(
                    `${music.title}: 알 수 없는 난이도 ${chart.difficulty}`
                );
            }
            if (difficulties.has(chart.difficulty)) {
                throw new Error(
                    `${music.title}: ${chart.difficulty} 채보가 중복됩니다.`
                );
            }
            if (
                !Number.isInteger(chart.level) ||
                chart.level < 1 ||
                chart.level > 12
            ) {
                throw new Error(
                    `${music.title}: ${chart.difficulty} 레벨이 올바르지 않습니다.`
                );
            }
            difficulties.add(chart.difficulty);
        }
    }
}

function hasSourceDifference(stored, source) {
    if (stored.title !== source.title) return true;
    if ((stored.artist ?? null) !== source.artist) return true;
    if (stored.title_kana !== source.titleKana) return true;
    if ((stored.description ?? null) !== source.description) return true;
    if (stored.category_short !== source.categoryShort) return true;

    const charts = new Map(
        stored.charts.map((chart) => [chart.difficulty, chart])
    );
    return source.levels.some((chart) => {
        const storedChart = charts.get(chart.difficulty);
        const expectedConstant =
            chart.constant ??
            (chart.difficulty === "Real" ? null : chart.level);

        return (
            storedChart?.level !== chart.level ||
            (expectedConstant !== null &&
                storedChart?.level_constant !== expectedConstant)
        );
    });
}

async function assertMusicIndexCascade() {
    const constraints = await db.$queryRaw`
        SELECT
            tc.table_name AS "tableName",
            rc.update_rule AS "updateRule"
        FROM information_schema.table_constraints tc
        JOIN information_schema.key_column_usage kcu
            ON tc.constraint_name = kcu.constraint_name
            AND tc.constraint_schema = kcu.constraint_schema
        JOIN information_schema.referential_constraints rc
            ON tc.constraint_name = rc.constraint_name
            AND tc.constraint_schema = rc.constraint_schema
        JOIN information_schema.constraint_column_usage ccu
            ON rc.unique_constraint_name = ccu.constraint_name
            AND rc.unique_constraint_schema = ccu.constraint_schema
        WHERE tc.constraint_type = 'FOREIGN KEY'
            AND ccu.table_name = 'Music'
            AND ccu.column_name = 'index'
    `;
    const unsafeConstraints = constraints.filter(
        (constraint) => constraint.updateRule !== "CASCADE"
    );

    if (unsafeConstraints.length > 0) {
        throw new Error(
            `악곡 ID 변경을 전파할 수 없는 외래 키가 있습니다: ${unsafeConstraints
                .map((constraint) => constraint.tableName)
                .join(", ")}`
        );
    }
}

async function buildPlan() {
    const storedMusics = await db.music.findMany({
        select: {
            index: true,
            title: true,
            artist: true,
            title_kana: true,
            description: true,
            category_short: true,
            charts: {
                select: {
                    difficulty: true,
                    level: true,
                    level_constant: true,
                },
            },
        },
    });
    const byIndex = new Map(storedMusics.map((music) => [music.index, music]));
    const matchedIndexes = new Set();
    const plan = [];

    for (const source of sourceMusics) {
        let stored = byIndex.get(source.index);
        let action = "unchanged";

        if (!stored) {
            const candidates = storedMusics.filter(
                (music) =>
                    normalize(music.title) === normalize(source.title) &&
                    normalize(music.artist) === normalize(source.artist)
            );
            if (candidates.length > 1) {
                throw new Error(
                    `${source.title}: 기존 악곡을 하나로 확정할 수 없습니다.`
                );
            }
            stored = candidates[0];
            action = stored ? "migrate" : "create";
        }

        if (
            stored &&
            action === "unchanged" &&
            hasSourceDifference(stored, source)
        ) {
            action = "update";
        }

        if (stored) matchedIndexes.add(stored.index);
        plan.push({ action, source, stored });
    }

    return {
        items: plan,
        preserved: storedMusics.filter(
            (music) => !matchedIndexes.has(music.index)
        ),
    };
}

function getChartCreateData(chart) {
    return {
        difficulty: chart.difficulty,
        level: chart.level,
        level_constant:
            chart.constant ??
            (chart.difficulty === "Real" ? chart.level + 10 : chart.level),
    };
}

async function saveMusic(item) {
    const data = {
        title: item.source.title,
        title_kana: item.source.titleKana,
        artist: item.source.artist,
        category: categoryNames[item.source.categoryShort],
        category_short: item.source.categoryShort,
        description: item.source.description,
    };

    await db.$transaction(async (transaction) => {
        if (item.action === "create") {
            await transaction.music.create({
                data: {
                    index: item.source.index,
                    ...data,
                    charts: {
                        create: item.source.levels.map(getChartCreateData),
                    },
                },
            });
            return;
        }

        const currentIndex = item.stored.index;
        await transaction.music.update({
            where: { index: currentIndex },
            data: {
                ...(item.action === "migrate"
                    ? { index: item.source.index }
                    : {}),
                ...data,
            },
        });

        for (const chart of item.source.levels) {
            const levelConstant =
                chart.constant ??
                (chart.difficulty === "Real" ? undefined : chart.level);
            await transaction.musicChart.upsert({
                where: {
                    music_idx_difficulty: {
                        music_idx: item.source.index,
                        difficulty: chart.difficulty,
                    },
                },
                update: {
                    level: chart.level,
                    ...(levelConstant === undefined
                        ? {}
                        : { level_constant: levelConstant }),
                },
                create: {
                    music_idx: item.source.index,
                    ...getChartCreateData(chart),
                },
            });
        }
    });
}

function summarize(plan) {
    return Object.groupBy(plan.items, (item) => item.action);
}

try {
    validateSource();
    const plan = await buildPlan();
    const summary = summarize(plan);
    console.log(
        `검증 완료: Nosdata ${sourceMusics.length}곡, 추가 ${summary.create?.length ?? 0}곡, 정식 ID 교체 ${summary.migrate?.length ?? 0}곡, 갱신 ${summary.update?.length ?? 0}곡, DB 전용 유지 ${plan.preserved.length}곡`
    );

    if (!shouldApply) {
        console.log("저장하려면 --apply 옵션을 추가하세요.");
    } else {
        await assertMusicIndexCascade();
        const result = { create: 0, migrate: 0, update: 0, unchanged: 0 };
        for (const item of plan.items) {
            if (item.action !== "unchanged") {
                await saveMusic(item);
            }
            result[item.action] += 1;
        }
        console.log(
            `반영 완료: 추가 ${result.create}곡, 정식 ID 교체 ${result.migrate}곡, 갱신 ${result.update}곡`
        );
    }
} finally {
    await db.$disconnect();
}
