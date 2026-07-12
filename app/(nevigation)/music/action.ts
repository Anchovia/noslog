"use server";

import db from "@/lib/db";
import { buildMusicWhere, type MusicSearchParams } from "./query";

export async function getMoreMusics(
    page: number,
    searchParams: MusicSearchParams
) {
    return db.music.findMany({
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
        skip: page * 20,
        take: 20,
    });
}
