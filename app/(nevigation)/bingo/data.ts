import { CACHE_TAGS } from "@/lib/cacheTags";
import db from "@/lib/db";
import { unstable_cache } from "next/cache";

// 공개 빙고 목록과 셀 위치는 모든 사용자에게 동일하므로 캐시함
export const getCachedPublishedBingos = unstable_cache(
    async () => {
        const bingos = await db.bingo.findMany({
            where: { status: "published" },
            select: {
                id: true,
                title: true,
                coverMusicIndex: true,
                rewardNos: true,
                requiredLines: true,
                startsAt: true,
                endsAt: true,
                coverMusic: {
                    select: { title: true, background: true },
                },
                cells: {
                    select: { id: true, position: true },
                    orderBy: { position: "asc" },
                },
            },
            orderBy: { id: "asc" },
        });

        return bingos.map((bingo) => ({
            ...bingo,
            startsAt: bingo.startsAt?.toISOString() ?? null,
            endsAt: bingo.endsAt?.toISOString() ?? null,
        }));
    },
    ["published-bingos", "op3-20260719"],
    {
        revalidate: 3600,
        tags: [CACHE_TAGS.bingos],
    }
);

// 빙고판과 미션 구성은 id별로 캐시함
export const getCachedBingoDetail = unstable_cache(
    async (bingoId: number) => {
        const bingo = await db.bingo.findFirst({
            where: { id: bingoId, status: "published" },
            select: {
                id: true,
                title: true,
                description: true,
                coverMusicIndex: true,
                requiredLines: true,
                rewardNos: true,
                startsAt: true,
                endsAt: true,
                coverMusic: {
                    select: {
                        title: true,
                        background: true,
                        description: true,
                    },
                },
                cells: {
                    select: {
                        id: true,
                        title: true,
                        missionType: true,
                        musicIndex: true,
                        position: true,
                        categoryShort: true,
                    },
                    orderBy: { position: "asc" },
                },
            },
        });

        return bingo
            ? {
                  ...bingo,
                  startsAt: bingo.startsAt?.toISOString() ?? null,
                  endsAt: bingo.endsAt?.toISOString() ?? null,
              }
            : null;
    },
    ["bingo-detail", "op3-20260719"],
    {
        revalidate: 3600,
        tags: [CACHE_TAGS.bingos],
    }
);

export function isBingoAvailable(
    bingo: { startsAt: string | null; endsAt: string | null },
    now = new Date()
) {
    return (
        (!bingo.startsAt || new Date(bingo.startsAt) <= now) &&
        (!bingo.endsAt || new Date(bingo.endsAt) >= now)
    );
}

// 완료 상태는 로그인 사용자마다 다르므로 공유 캐시를 사용하지 않음
export async function getUserBingoCellProgress(
    userId: number,
    cellIds: number[]
) {
    if (cellIds.length === 0) return [];

    const progress = await db.bingoCellProgress.findMany({
        where: {
            userId,
            bingoCellId: { in: cellIds },
        },
        select: {
            bingoCellId: true,
            isCompleted: true,
            updatedAt: true,
        },
    });

    return progress.map((item) => ({
        ...item,
        updatedAt: item.updatedAt.toISOString(),
    }));
}
