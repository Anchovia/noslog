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
            sheet_len: true,
            difficulty_levels: true,
            normal: true,
            hard: true,
            expert: true,
            real: true,
        },
    });
    const sortedMusics = sortMusics(musics, searchParams);
    const start = page * PAGE_SIZE;

    return sortedMusics.slice(start, start + PAGE_SIZE);
}
