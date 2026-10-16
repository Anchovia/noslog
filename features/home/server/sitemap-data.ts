import "server-only";

import db from "@/lib/db";

/** 사이트맵에 싣는 공개 악곡 · 서열표 · 진행 중 빙고(2026-10-16 D8 — 라우트에서 옮김) */
export async function getSitemapSources(now: Date) {
    const [musics, tierLists, bingos] = await Promise.all([
        db.music.findMany({
            select: {
                index: true,
                updatedAt: true,
                charts: {
                    select: { difficulty: true, updatedAt: true },
                },
            },
        }),
        db.tierList.findMany({
            where: { status: "published" },
            select: { slug: true, updatedAt: true },
        }),
        db.bingo.findMany({
            where: {
                status: "published",
                AND: [
                    {
                        OR: [{ startsAt: null }, { startsAt: { lte: now } }],
                    },
                    { OR: [{ endsAt: null }, { endsAt: { gte: now } }] },
                ],
            },
            select: { id: true, updatedAt: true },
        }),
    ]);
    return { musics, tierLists, bingos };
}
