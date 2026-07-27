import { musicBG } from "../../constants";
import db from "../../db";
import { getLocalJacketUrl } from "../../musicJackets";
import type { Prisma } from "@prisma/client";

interface SyncMusicSheet {
    difficulty: string;
    level: number;
    score: number;
    rank: string;
    fc_type: number;
    play_count: number;
    clear_count: number;
    clear_flag: [number];
    fullcombo_count: number;
    pianistic_count: number;
    max_combo: number;
    grade_basic: number;
    grade_recital: number;
    judge: [number, number, number, number, number];
    note_success_rate: [number, number, number, number];
    besttime: string;
}

export interface BemaniMusicCatalogInput {
    "@index": string;
    artist: string | null;
    category: string;
    category_short: string;
    description: string | null;
    license: string;
    title: string;
    title_kana: string;
    unlock_type: number;
    sheet: Pick<SyncMusicSheet, "difficulty" | "level">[];
}

export interface SyncMusicInput extends Omit<BemaniMusicCatalogInput, "sheet"> {
    sheet: SyncMusicSheet[];
}

function bemaniMetadata(data: BemaniMusicCatalogInput) {
    return {
        title: data.title,
        title_kana: data.title_kana,
        artist: data.artist,
        category: data.category,
        category_short: data.category_short,
        description: data.description,
        license: data.license,
        unlock_type: data.unlock_type,
    };
}

export async function updateMusic(music: BemaniMusicCatalogInput[]) {
    const startTime = Date.now(); // 시작 시간

    const existingMusic = await db.music.findMany({
        where: {
            index: {
                in: music.map((data) => data["@index"]),
            },
        },
        select: {
            index: true,
            title: true,
            title_kana: true,
            artist: true,
            category: true,
            category_short: true,
            description: true,
            license: true,
            unlock_type: true,
            background: true,
        },
    });
    const existingByIndex = new Map(
        existingMusic.map((item) => [item.index, item])
    );
    const newMusicData: Prisma.MusicCreateManyInput[] = [];
    const musicUpdatePromises: Promise<unknown>[] = [];

    for (const data of music) {
        const index = data["@index"];
        const existing = existingByIndex.get(index);
        const metadata = {
            ...bemaniMetadata(data),
            background:
                getLocalJacketUrl(index) ||
                existing?.background ||
                musicBG[index] ||
                null,
        };

        if (!existing) {
            newMusicData.push({ index, ...metadata });
            continue;
        }

        const changed = Object.entries(metadata).some(
            ([key, value]) => existing[key as keyof typeof existing] !== value
        );
        if (changed) {
            musicUpdatePromises.push(
                db.music.update({
                    where: { index },
                    data: metadata,
                })
            );
        }
    }

    await Promise.all([
        newMusicData.length > 0
            ? db.music.createMany({ data: newMusicData })
            : Promise.resolve(null),
        ...musicUpdatePromises,
    ]);

    // 악곡의 난이도별 채보를 정규화 테이블과 동기화
    const chartUpserts = music.flatMap((data) =>
        data.sheet.map((sheet) =>
            db.musicChart.upsert({
                where: {
                    music_idx_difficulty: {
                        music_idx: data["@index"],
                        difficulty: sheet.difficulty,
                    },
                },
                create: {
                    music_idx: data["@index"],
                    difficulty: sheet.difficulty,
                    level: sheet.level,
                    level_constant:
                        sheet.difficulty === "Real"
                            ? sheet.level + 10
                            : sheet.level,
                },
                update: {
                    level: sheet.level,
                },
            })
        )
    );

    await db.$transaction(chartUpserts);
    console.info(`(5)악곡 채보 데이터 동기화 완료 (${chartUpserts.length}개)`);

    const duration = Date.now() - startTime; // 종료 시간

    console.info(`===[악곡 및 채보 데이터 동기화 성공(${duration}ms)]===`);
}
