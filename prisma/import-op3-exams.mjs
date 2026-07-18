import { loadEnvFile } from "node:process";
import { createHash } from "node:crypto";

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

const labels = ["1st", "2nd", "Fin"];
const difficultyOrder = ["Normal", "Hard", "Expert", "Real"];

const archiveMusics = [
    {
        title: "50th Memorial Songs -Beginning Story-",
        artist: "BEMANI Sound Team",
        category: "BEMANI楽曲",
        categoryShort: "BM",
        levels: [3, 6, 10],
    },
    {
        title: "くるみ割り人形より小序曲",
        artist: "チャイコフスキー",
        category: "クラシック/ジャズ",
        categoryShort: "Cl/Jz",
        levels: [3, 7, 10],
    },
    {
        title: "レクイエムより「怒りの日」",
        artist: "モーツァルト",
        category: "クラシック/ジャズ",
        categoryShort: "Cl/Jz",
        levels: [4, 8, 12, 3],
    },
    {
        title: "ハンガリー狂詩曲第2番",
        artist: "リスト",
        category: "クラシック/ジャズ",
        categoryShort: "Cl/Jz",
        levels: [6, 8, 12, 3],
    },
    {
        title: "管弦楽組曲第2番より「バディヌリー」",
        artist: "J.S.バッハ",
        category: "クラシック/ジャズ",
        categoryShort: "Cl/Jz",
        levels: [3, 7, 12, 2],
    },
    {
        title: "野ばら",
        artist: "シューベルト",
        category: "クラシック/ジャズ",
        categoryShort: "Cl/Jz",
        levels: [4, 7, 11, 2],
    },
    {
        title: "東洋風幻想曲イスラメイ",
        artist: "バラキレフ",
        category: "クラシック/ジャズ",
        categoryShort: "Cl/Jz",
        levels: [5, 9, 12, 3],
    },
    {
        title: "エチュード Op.25-5",
        artist: "ショパン",
        category: "クラシック/ジャズ",
        categoryShort: "Cl/Jz",
        levels: [4, 7, 12, 3],
    },
    {
        title: "クープランの墓よりプレリュード",
        artist: "ラヴェル",
        category: "クラシック/ジャズ",
        categoryShort: "Cl/Jz",
        levels: [6, 8, 12, 3],
    },
].map((music) => ({
    ...music,
    index: createHash("md5")
        .update(`noslog:archive:${music.title}`)
        .digest("hex"),
}));

function stage(title, difficulty, level, requiredValue, artist = null) {
    return {
        title,
        artist,
        charts: [{ difficulty, level }],
        requiredValue,
    };
}

function eventStage(title, levels, requiredValue) {
    return {
        title,
        artist: null,
        charts: levels.map((level, index) => ({
            difficulty: difficultyOrder[index],
            level,
        })),
        requiredValue,
    };
}

function gradeExam(mode, grade, requiredGrade, feeNos, stages) {
    const modeLabel = mode === "basic" ? "Basic" : "Recital";

    return {
        slug: `${mode}-${grade}`,
        mode,
        scoringType: mode === "basic" ? "score" : "recital_point",
        grade,
        shortLabel: `${grade}급`,
        title: `${modeLabel} ${grade}급`,
        description: null,
        feeNos,
        requiredGrade,
        stages,
        rewards: [
            {
                type: "grade",
                label: `${modeLabel} ${grade}급`,
                title: null,
            },
        ],
    };
}

function eventExam(slug, shortLabel, title, scoringType, stages, rewards) {
    return {
        slug,
        mode: "event",
        scoringType,
        grade: null,
        shortLabel,
        title,
        description: null,
        feeNos: 2000,
        requiredGrade: 0,
        stages,
        rewards: rewards.map((rewardTitle) => ({
            type: "music_unlock",
            label: rewardTitle,
            title: rewardTitle,
        })),
    };
}

const exams = [
    gradeExam("basic", 10, 800, 1000, [
        stage("50th Memorial Songs -Beginning Story-", "Normal", 3, 850000),
        stage("くるみ割り人形より小序曲", "Normal", 3, 1725000),
        stage("Ensemble Forecast 3/28", "Normal", 3, 2625000),
    ]),
    gradeExam("basic", 9, 1200, 1250, [
        stage("Owls", "Normal", 4, 875000),
        stage("ラデツキー行進曲", "Normal", 4, 1775000),
        stage("ハンガリー舞曲第6番", "Normal", 4, 2700000),
    ]),
    gradeExam("basic", 8, 2000, 1500, [
        stage("アーカーシャの碑文", "Hard", 5, 900000),
        stage("アラベスク", "Hard", 5, 1825000),
        stage("Beyond the Ocean", "Hard", 6, 2775000),
    ]),
    gradeExam("basic", 7, 3000, 1750, [
        stage("シシリエンヌ", "Hard", 6, 925000),
        stage("風の丘の東", "Hard", 7, 1875000),
        stage("Fly far bounce", "Hard", 7, 2850000),
    ]),
    gradeExam("basic", 6, 4000, 2000, [
        stage("パガニーニによる大練習曲第6番「主題と変奏」", "Hard", 8, 925000),
        stage("Life is beautiful", "Hard", 8, 1875000),
        stage("凛として咲く花の如く", "Expert", 9, 2850000),
    ]),
    gradeExam("basic", 5, 4500, 2500, [
        stage("little runaway", "Expert", 9, 925000),
        stage("ルミナスデイズ", "Expert", 9, 1875000),
        stage("felys", "Expert", 10, 2850000),
    ]),
    gradeExam("basic", 4, 5000, 3000, [
        stage("ワルツ第14番", "Expert", 12, 925000),
        stage("夕映の真鍮", "Expert", 11, 1875000),
        stage("ivy of rutiles", "Expert", 12, 2850000),
    ]),
    gradeExam("basic", 3, 5250, 3500, [
        stage("エチュード Op.10-4", "Expert", 12, 925000),
        stage("neko fun jitter", "Real", 2, 1875000),
        stage("Last Twilight", "Expert", 12, 2850000),
    ]),
    gradeExam("basic", 2, 5400, 4250, [
        stage("バルベリア・タンゴ", "Real", 2, 925000),
        stage("ウィリアム・テル序曲", "Real", 2, 1875000),
        stage(
            "協奏曲「世界の果てに約束の凱歌を」～28の鍵盤のための～",
            "Real",
            2,
            2850000
        ),
    ]),
    gradeExam("basic", 1, 5500, 5000, [
        stage('ピアノ独奏無言歌 "灰燼"', "Real", 3, 925000),
        stage("天使の追放", "Real", 3, 1875000),
        stage("交響詩「悪魔の誕生」", "Real", 3, 2850000),
    ]),
    gradeExam("recital", 10, 800, 1000, [
        stage("メヌエット", "Hard", 3, 24, "ペツォールト"),
        stage("メヌエット ト短調", "Hard", 3, 52),
        stage("メヌエット イ短調", "Hard", 3, 84),
    ]),
    gradeExam("recital", 9, 1200, 1250, [
        stage("小人がひとり森の中で", "Hard", 4, 26),
        stage("人形の夢と目覚め", "Hard", 5, 56),
        stage("乙女の祈り", "Hard", 6, 90),
    ]),
    gradeExam("recital", 8, 2000, 1500, [
        stage("おもちゃの兵隊の行進", "Hard", 5, 28),
        stage("軍隊行進曲第1番", "Hard", 6, 56),
        stage("ラデツキー行進曲", "Hard", 7, 90),
    ]),
    gradeExam("recital", 7, 3000, 1750, [
        stage("少年と少女のためのラプソディア", "Hard", 7, 28),
        stage("flee for free!!", "Hard", 6, 60),
        stage("tears proof masquerade", "Hard", 8, 96),
    ]),
    gradeExam("recital", 6, 4000, 2000, [
        stage("アラベスク第1番", "Hard", 8, 30),
        stage("月の光", "Expert", 7, 64),
        stage("亜麻色の髪の乙女", "Expert", 9, 102),
    ]),
    gradeExam("recital", 5, 4500, 2500, [
        stage("Somnio", "Expert", 9, 30),
        stage("Un Happy Heart", "Expert", 9, 64),
        stage("felys", "Expert", 10, 102),
    ]),
    gradeExam("recital", 4, 5000, 3000, [
        stage("一夜の恋", "Expert", 10, 30),
        stage("コルドバの女", "Expert", 11, 64),
        stage("愛、遠く", "Real", 2, 102),
    ]),
    gradeExam("recital", 3, 5250, 3500, [
        stage("序曲「煌」", "Expert", 12, 30),
        stage("Petite Queen", "Expert", 11, 64),
        stage("蒼氷のフラグメント", "Real", 2, 102),
    ]),
    gradeExam("recital", 2, 5400, 4250, [
        stage("リメンバーリメンバー (BEMANI SYMPHONY Arr.)", "Real", 2, 30),
        stage("隅田川夏恋歌", "Real", 2, 64),
        stage("水の戯れ", "Real", 2, 102),
    ]),
    gradeExam("recital", 1, 5500, 5000, [
        stage('交響曲第5番第1楽章"運命"', "Real", 2, 32),
        stage("交響曲第7番第1楽章", "Real", 2, 68),
        stage('交響曲第9番第4楽章"歓喜の歌"', "Real", 3, 108),
    ]),
    eventExam(
        "event-7th-kac",
        "7th KAC",
        "The 7th KAC 스페셜 검정",
        "score",
        [
            eventStage("zeeros", [5, 9, 12], 925000),
            eventStage('ピアノ協奏曲第1番"蠍火"', [6, 9, 12], 1875000),
            eventStage("Carezza", [4, 10, 12], 2850000),
        ],
        ["Carezza"]
    ),
    eventExam(
        "event-8th-kac",
        "8th KAC",
        "The 8th KAC 스페셜 검정",
        "score",
        [
            eventStage("魔王", [3, 7, 12, 3], 925000),
            eventStage(
                "パガニーニによる大練習曲第6番「主題と変奏」",
                [5, 8, 12, 3],
                1875000
            ),
            eventStage(
                "virkatoの主題によるperson09風超絶技巧変奏曲",
                [5, 7, 12, 3],
                2850000
            ),
        ],
        ["virkatoの主題によるperson09風超絶技巧変奏曲"]
    ),
    eventExam(
        "event-9th-kac",
        "9th KAC",
        "The 9th KAC 스페셜 검정",
        "score",
        [
            eventStage(
                "協奏曲第2番ト短調 RV 315「夏」より第三楽章",
                [3, 7, 12, 3],
                925000
            ),
            eventStage("ambages", [6, 9, 12, 3], 1875000),
            eventStage("ピアノ体操第一", [6, 10, 12, 3], 2850000),
        ],
        ["ピアノ体操第一"]
    ),
    eventExam(
        "event-10th-kac",
        "10th KAC",
        "The 10th KAC 스페셜 검정",
        "score",
        [
            eventStage(
                "協奏曲「世界の果てに約束の凱歌を」～28の鍵盤のための～",
                [4, 8, 12, 2],
                925000
            ),
            eventStage("世界の果てに約束の凱歌を", [5, 8, 12, 2], 1875000),
            eventStage("天使の追放", [8, 11, 12, 3], 2850000),
        ],
        ["世界の果てに約束の凱歌を", "天使の追放"]
    ),
    eventExam(
        "event-virtuosity-basic",
        "초절기교 BASIC",
        "화려한 초절기교 스페셜 검정 BASIC",
        "score",
        [
            eventStage("レクイエムより「怒りの日」", [4, 8, 12, 3], 925000),
            eventStage("ハンガリー狂詩曲第2番", [6, 8, 12, 3], 1875000),
            eventStage("女神の微睡", [7, 9, 12, 3], 2850000),
        ],
        ["女神の微睡"]
    ),
    eventExam(
        "event-virtuosity-recital",
        "초절기교 RECITAL",
        "화려한 초절기교 스페셜 검정 RECITAL",
        "recital_point",
        [
            eventStage(
                "管弦楽組曲第2番より「バディヌリー」",
                [3, 7, 12, 2],
                32
            ),
            eventStage("野ばら", [4, 7, 11, 2], 68),
            eventStage("女神の微睡", [7, 9, 12, 3], 108),
        ],
        ["女神の微睡"]
    ),
    eventExam(
        "event-virtuosity-2024-basic",
        "초절기교 2024 BASIC",
        "화려한 초절기교 스페셜 검정 2024 BASIC",
        "score",
        [
            eventStage("半音階的大ギャロップ", [5, 9, 12, 2], 925000),
            eventStage("東洋風幻想曲イスラメイ", [5, 9, 12, 3], 1875000),
            eventStage(
                'ワルツ第17番 ト短調 "大犬のワルツ"',
                [6, 9, 12, 3],
                2850000
            ),
        ],
        ['ワルツ第17番 ト短調 "大犬のワルツ"']
    ),
    eventExam(
        "event-virtuosity-2024-recital",
        "초절기교 2024 RECITAL",
        "화려한 초절기교 스페셜 검정 2024 RECITAL",
        "recital_point",
        [
            eventStage("エチュード Op.25-5", [4, 7, 12, 3], 32),
            eventStage("クープランの墓よりプレリュード", [6, 8, 12, 3], 68),
            eventStage(
                'ワルツ第17番 ト短調 "大犬のワルツ"',
                [6, 9, 12, 3],
                108
            ),
        ],
        ['ワルツ第17番 ト短調 "大犬のワルツ"']
    ),
];

function normalize(value) {
    return value
        .normalize("NFKC")
        .toLocaleLowerCase("ja-JP")
        .replace(/[\s'"“”‘’「」『』・･~～\-－—–]/g, "");
}

function findMusic(musics, title, artist) {
    const titleKey = normalize(title);
    let candidates = musics.filter(
        (music) => normalize(music.title) === titleKey
    );

    if (artist) {
        const artistKey = normalize(artist);
        candidates = candidates.filter(
            (music) => normalize(music.artist ?? "") === artistKey
        );
    }

    if (candidates.length !== 1) {
        throw new Error(
            `${title}: 악곡 매칭 결과가 ${candidates.length}개입니다.`
        );
    }

    return candidates[0];
}

function findChart(music, chartSpec) {
    const chart = music.charts.find(
        (candidate) =>
            candidate.difficulty.toLowerCase() ===
                chartSpec.difficulty.toLowerCase() &&
            candidate.level === chartSpec.level
    );

    if (!chart) {
        const available = music.charts
            .map((candidate) => `${candidate.difficulty} ${candidate.level}`)
            .join(", ");
        throw new Error(
            `${music.title}: ${chartSpec.difficulty} ${chartSpec.level} 채보가 없습니다. 현재 채보: ${available}`
        );
    }

    return chart;
}

function getVirtualArchiveMusics() {
    let virtualChartId = -1;
    return archiveMusics.map((music) => ({
        index: music.index,
        title: music.title,
        artist: music.artist,
        charts: music.levels.map((level, index) => ({
            id: virtualChartId--,
            difficulty: difficultyOrder[index],
            level,
        })),
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
        if (existing) continue;

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
                        level_constant: level,
                    })),
                },
            },
        });
        console.log(`아카이브 악곡 추가: ${music.title}`);
    }
}

async function resolveExams(includeVirtualArchive = false) {
    const storedMusics = await db.music.findMany({
        select: {
            index: true,
            title: true,
            artist: true,
            charts: {
                select: { id: true, difficulty: true, level: true },
            },
        },
    });
    const musics = includeVirtualArchive
        ? [...storedMusics, ...getVirtualArchiveMusics()]
        : storedMusics;

    const errors = [];
    const resolvedExams = [];

    for (const exam of exams) {
        const resolvedStages = [];
        const resolvedRewards = [];

        for (const [index, examStage] of exam.stages.entries()) {
            try {
                const music = findMusic(
                    musics,
                    examStage.title,
                    examStage.artist
                );
                resolvedStages.push({
                    musicIndex: music.index,
                    title: music.title,
                    position: index + 1,
                    label: labels[index],
                    requirementType: index === 0 ? "single" : "cumulative",
                    requiredValue: examStage.requiredValue,
                    chartIds: examStage.charts.map(
                        (chartSpec) => findChart(music, chartSpec).id
                    ),
                });
            } catch (error) {
                errors.push(`${exam.title} / ${error.message}`);
            }
        }

        for (const reward of exam.rewards) {
            try {
                if (!reward.title) {
                    resolvedRewards.push({ ...reward, musicIndex: null });
                    continue;
                }
                const music = findMusic(musics, reward.title, null);
                resolvedRewards.push({
                    ...reward,
                    label: music.title,
                    musicIndex: music.index,
                });
            } catch (error) {
                errors.push(`${exam.title} / 보상 / ${error.message}`);
            }
        }

        resolvedExams.push({
            ...exam,
            stages: resolvedStages,
            rewards: resolvedRewards,
        });
    }

    if (errors.length > 0) {
        throw new Error(`검증 실패 ${errors.length}건:\n${errors.join("\n")}`);
    }

    return resolvedExams;
}

async function saveExam(exam) {
    const existing = await db.exam.findFirst({
        where:
            exam.mode === "event"
                ? {
                      mode: "event",
                      OR: [{ slug: exam.slug }, { title: exam.title }],
                  }
                : { mode: exam.mode, grade: exam.grade },
        select: { id: true },
    });

    return db.$transaction(async (transaction) => {
        const data = {
            slug: exam.slug,
            mode: exam.mode,
            shortLabel: exam.shortLabel,
            scoringType: exam.scoringType,
            grade: exam.grade,
            title: exam.title,
            description: exam.description,
            feeNos: exam.feeNos,
            requiredGrade: exam.requiredGrade,
            status: "published",
        };
        const saved = existing
            ? await transaction.exam.update({
                  where: { id: existing.id },
                  data,
                  select: { id: true },
              })
            : await transaction.exam.create({
                  data,
                  select: { id: true },
              });

        await transaction.examStage.deleteMany({
            where: { examId: saved.id },
        });
        for (const examStage of exam.stages) {
            await transaction.examStage.create({
                data: {
                    examId: saved.id,
                    musicIndex: examStage.musicIndex,
                    position: examStage.position,
                    label: examStage.label,
                    requirementType: examStage.requirementType,
                    requiredValue: examStage.requiredValue,
                    allowedCharts: {
                        create: examStage.chartIds.map((chartId) => ({
                            chartId,
                        })),
                    },
                },
            });
        }

        await transaction.examReward.deleteMany({
            where: { examId: saved.id },
        });
        await transaction.examReward.createMany({
            data: exam.rewards.map((reward, index) => ({
                examId: saved.id,
                position: index + 1,
                type: reward.type,
                label: reward.label,
                musicIndex: reward.musicIndex,
            })),
        });

        return existing ? "updated" : "created";
    });
}

try {
    let resolvedExams = await resolveExams(true);
    console.log(
        `검증 완료: 검정 ${resolvedExams.length}개, 과제곡 ${resolvedExams.length * 3}개`
    );

    if (!shouldApply) {
        console.log(`추가 예정 아카이브 악곡: ${archiveMusics.length}개`);
        console.log("저장하려면 --apply 옵션을 추가하세요.");
        process.exitCode = 0;
    } else {
        await ensureArchiveMusics();
        resolvedExams = await resolveExams();
        const result = { created: 0, updated: 0 };
        for (const exam of resolvedExams) {
            const action = await saveExam(exam);
            result[action] += 1;
            console.log(
                `${action === "created" ? "추가" : "갱신"}: ${exam.title}`
            );
        }
        console.log(
            `반영 완료: 추가 ${result.created}개, 갱신 ${result.updated}개`
        );
    }
} finally {
    await db.$disconnect();
}
