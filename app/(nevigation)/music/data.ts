import "server-only";

import db from "@/lib/db";
import { buildMusicWhere, sortMusics, type MusicSearchParams } from "./query";

const PAGE_SIZE = 20;

// 첫 조회와 무한 스크롤이 같은 필터·정렬 기준을 사용하도록 관리함
export async function getMusicPage(
    searchParams: MusicSearchParams,
    page: number
) {
    const musics = await db.music.findMany({
        where: buildMusicWhere(searchParams),
        select: {
            index: true,
            title: true,
            artist: true,
            category_short: true,
            background: true,
            charts: {
                select: {
                    difficulty: true,
                    level: true,
                },
            },
        },
    });
    const musicItems = musics.map(({ charts, ...music }) => {
        const levels = new Map(
            charts.map((chart) => [chart.difficulty, chart.level])
        );

        return {
            ...music,
            normal: levels.get("Normal") ?? 0,
            hard: levels.get("Hard") ?? 0,
            expert: levels.get("Expert") ?? 0,
            real: levels.get("Real") ?? null,
        };
    });
    const sortedMusics = sortMusics(musicItems, searchParams);
    const start = page * PAGE_SIZE;

    return sortedMusics.slice(start, start + PAGE_SIZE);
}
