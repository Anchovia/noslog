"use server";

import db from "@/lib/db";

export async function getMoreMusics(page: number, qurry: string | undefined) {
    if (qurry) {
        const musics = await db.music.findMany({
            where: {
                OR: [
                    { title: { contains: qurry } },
                    { artist: { contains: qurry } },
                ],
            },
            select: {
                index: true,
                title: true,
                artist: true,
                category_short: true,
                background: true,
                sheet_len: true,
                difficulty_levels: true,
            },
            skip: page * 20,
            take: 20,
        });
        return musics;
    } else {
        const musics = await db.music.findMany({
            select: {
                index: true,
                title: true,
                artist: true,
                category_short: true,
                background: true,
                sheet_len: true,
                difficulty_levels: true,
            },
            skip: page * 20,
            take: 20,
        });
        return musics;
    }
}
