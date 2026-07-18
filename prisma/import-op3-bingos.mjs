import { createHash } from "node:crypto";
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
const bingos = JSON.parse(
    fs.readFileSync(new URL("./data/op3-bingos.json", import.meta.url), "utf8")
);

const aliases = new Map([
    ["Bárbara", "Barbara"],
    ["Missing in the snow", "Missing in the snow"],
]);
const difficultyOrder = ["Normal", "Hard", "Expert", "Real"];
const archiveMusics = [
    {
        title: "CHOCOLATE PHILOSOPHY",
        artist: "常盤ゆう",
        category: "BEMANI楽曲",
        categoryShort: "BM",
        levels: [4, 6, 11, 2],
    },
    {
        title: "恋愛観測 -2021真夏のエンディング ver.-",
        artist: "2021真夏のSingers",
        category: "BEMANI楽曲",
        categoryShort: "BM",
        levels: [4, 7, 10, 2],
    },
    {
        title: "Turn the story",
        artist: "technoplanet feat. Kuroto Sion",
        category: "BEMANI楽曲",
        categoryShort: "BM",
        levels: [4, 7, 11, 2],
    },
    {
        title: "Welcome to pop'n fantasy",
        artist: "red glasses ＆ BlackY feat.pop'n fellows",
        category: "BEMANI楽曲",
        categoryShort: "BM",
        levels: [4, 7, 11, 2],
    },
    {
        title: "ラブキラ☆スプラッシュ",
        artist: 'BEMANI Sound Team "Sota F." feat.いちか',
        category: "BEMANI楽曲",
        categoryShort: "BM",
        levels: [3, 7, 10, 2],
    },
    {
        title: "ヴァイオリンソナタ第5番「春」第1楽章",
        artist: "ベートーヴェン",
        category: "クラシック/ジャズ",
        categoryShort: "Cl/Jz",
        levels: [3, 6, 10, 2],
    },
    {
        title: "I and I",
        artist: "ぺのれり feat.はぁち",
        category: "ノスタルジアオリジナル",
        categoryShort: "Org",
        levels: [4, 7, 12, 2],
    },
].map((music) => ({
    ...music,
    index: createHash("md5")
        .update(`noslog:archive:${music.title}`)
        .digest("hex"),
}));

function normalize(value) {
    return value
        .normalize("NFKD")
        .replace(/\p{M}/gu, "")
        .toLocaleLowerCase("en-US")
        .replace(
            /[\s\u3000'’`´・･~～\-‐‑‒–—―「」『』“”\".,:!?/\\()[\]{}†★☆◆◇=+]/g,
            ""
        );
}

function findMusic(musics, title) {
    const expected = aliases.get(title) ?? title;
    const normalized = normalize(expected);
    const matches = musics.filter(
        (music) => normalize(music.title) === normalized
    );

    if (matches.length !== 1) {
        const candidates = musics
            .filter((music) => {
                const candidate = normalize(music.title);
                return (
                    candidate.includes(normalized) ||
                    normalized.includes(candidate)
                );
            })
            .slice(0, 5)
            .map((music) => music.title)
            .join(", ");
        throw new Error(
            `${title}: 악곡을 ${matches.length === 0 ? "찾지 못했습니다" : "하나로 확정할 수 없습니다"}.${candidates ? ` 후보: ${candidates}` : ""}`
        );
    }

    return matches[0];
}

function findMissionMusic(musics, missionTitle) {
    if (!missionTitle.includes("연주")) return null;

    const normalizedMission = normalize(missionTitle);
    return (
        musics
            .filter((music) => {
                const normalizedTitle = normalize(music.title);
                return (
                    music.title.length >= 2 &&
                    normalizedTitle.length >= 2 &&
                    normalizedMission.includes(normalizedTitle)
                );
            })
            .sort((left, right) => right.title.length - left.title.length)[0] ??
        null
    );
}

function getVirtualArchiveMusics(storedMusics) {
    return archiveMusics
        .filter(
            (music) =>
                !storedMusics.some(
                    (stored) =>
                        normalize(stored.title) === normalize(music.title)
                )
        )
        .map((music) => ({
            index: music.index,
            title: music.title,
        }));
}

async function ensureArchiveMusics() {
    const existingMusics = await db.music.findMany({
        select: { index: true, title: true },
    });

    for (const music of archiveMusics) {
        const existing = existingMusics.find(
            (candidate) => normalize(candidate.title) === normalize(music.title)
        );
        if (existing) {
            await db.music.update({
                where: { index: existing.index },
                data: {
                    artist: music.artist,
                    category: music.category,
                    category_short: music.categoryShort,
                },
            });
            continue;
        }

        await db.music.create({
            data: {
                index: music.index,
                title: music.title,
                title_kana: music.title,
                artist: music.artist,
                category: music.category,
                category_short: music.categoryShort,
                charts: {
                    create: music.levels.map((level, index) => ({
                        difficulty: difficultyOrder[index],
                        level,
                        level_constant:
                            difficultyOrder[index] === "Real"
                                ? level + 10
                                : level,
                    })),
                },
            },
        });
        console.log(`아카이브 악곡 추가: ${music.title}`);
    }
}

async function resolveBingos(includeVirtualArchive = false) {
    const storedMusics = await db.music.findMany({
        select: { index: true, title: true },
    });
    const musics = includeVirtualArchive
        ? [...storedMusics, ...getVirtualArchiveMusics(storedMusics)]
        : storedMusics;
    const errors = [];
    const resolved = [];

    for (const bingo of bingos) {
        if (bingo.cells.length !== 25) {
            errors.push(
                `${bingo.title}: 미션이 ${bingo.cells.length}개입니다.`
            );
            continue;
        }

        try {
            const coverMusic = findMusic(musics, bingo.title);
            resolved.push({
                ...bingo,
                title: coverMusic.title,
                coverMusicIndex: coverMusic.index,
                cells: bingo.cells.map((cell) => {
                    const music = findMissionMusic(musics, cell.title);
                    return {
                        ...cell,
                        missionType: music ? "music" : "record",
                        musicIndex: music?.index ?? null,
                    };
                }),
            });
        } catch (error) {
            errors.push(error.message);
        }
    }

    if (errors.length > 0) {
        throw new Error(`검증 실패 ${errors.length}건:\n${errors.join("\n")}`);
    }

    return resolved;
}

async function saveBingo(bingo) {
    const existing = await db.bingo.findFirst({
        where: { coverMusicIndex: bingo.coverMusicIndex },
        select: { id: true },
    });

    return db.$transaction(async (transaction) => {
        const data = {
            title: bingo.title,
            description: `${bingo.sourceVersion} 미션 빙고`,
            sourceVersion: bingo.sourceVersion,
            rewardNos: bingo.rewardNos,
            lineRewardNos: bingo.lineRewardNos,
            completionRewardNos: bingo.completionRewardNos,
            requiredLines: bingo.requiredLines,
            status: "published",
            coverMusicIndex: bingo.coverMusicIndex,
        };
        const saved = existing
            ? await transaction.bingo.update({
                  where: { id: existing.id },
                  data,
                  select: { id: true },
              })
            : await transaction.bingo.create({
                  data,
                  select: { id: true },
              });

        for (const cell of bingo.cells) {
            await transaction.bingoCell.upsert({
                where: {
                    bingoId_position: {
                        bingoId: saved.id,
                        position: cell.position,
                    },
                },
                update: {
                    title: cell.title,
                    missionType: cell.missionType,
                    ruleType: "manual",
                    ruleConfig: {
                        sourceVersion: bingo.sourceVersion,
                    },
                    categoryShort: null,
                    targetDifficulty: null,
                    targetLevel: null,
                    musicIndex: cell.musicIndex,
                },
                create: {
                    bingoId: saved.id,
                    position: cell.position,
                    title: cell.title,
                    missionType: cell.missionType,
                    ruleType: "manual",
                    ruleConfig: {
                        sourceVersion: bingo.sourceVersion,
                    },
                    musicIndex: cell.musicIndex,
                },
            });
        }

        return existing ? "updated" : "created";
    });
}

try {
    if (shouldApply) {
        await ensureArchiveMusics();
    }
    const resolvedBingos = await resolveBingos(!shouldApply);
    const linkedCells = resolvedBingos.reduce(
        (count, bingo) =>
            count + bingo.cells.filter((cell) => cell.musicIndex).length,
        0
    );
    console.log(
        `검증 완료: 빙고 ${resolvedBingos.length}개, 미션 ${resolvedBingos.length * 25}개, 악곡 연결 미션 ${linkedCells}개`
    );

    if (!shouldApply) {
        console.log("저장하려면 --apply 옵션을 추가하세요.");
    } else {
        const result = { created: 0, updated: 0 };
        for (const bingo of resolvedBingos) {
            const action = await saveBingo(bingo);
            result[action] += 1;
            console.log(
                `${action === "created" ? "추가" : "갱신"}: ${bingo.title}`
            );
        }
        console.log(
            `반영 완료: 추가 ${result.created}개, 갱신 ${result.updated}개`
        );
    }
} finally {
    await db.$disconnect();
}
