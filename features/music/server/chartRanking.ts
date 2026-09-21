import "server-only";

import { Prisma } from "@prisma/client";
import { unstable_cache } from "next/cache";
import db from "@/lib/db";
import { CACHE_TAGS } from "@/lib/cacheTags";
import { PUBLIC_DATA_REVALIDATE_SECONDS } from "@/lib/cachePolicy";
import {
    chartRankingRowSchema,
    chartScorePlayerSchema,
} from "@/features/music/schemas/chartRankingSchema";

export const MUSIC_RANKING_PAGE_SIZE = 25;

export function normalizeRankingPage(page: number, total: number) {
    return Number.isSafeInteger(page) &&
        page > 0 &&
        page <= Math.max(1, Math.ceil(total / MUSIC_RANKING_PAGE_SIZE))
        ? page
        : 1;
}

// 점수 비공개 플레이어(hide_play_scores)는 랭킹에서 빠진다 — 순위도 나머지 사람끼리 다시 매긴다(2026-09-18 S3).
// 비공개인 본인이 볼 때만 includeUserId 로 자기 줄을 넣어 「공개된 사람들 사이 내 자리」 를 보여 준다. 0 = 아무도 넣지 않음
function visiblePlayers(includeUserId: number) {
    return Prisma.sql`(u.hide_play_scores = false OR u.id = ${includeUserId})`;
}

export const getChartRanking = unstable_cache(
    async (chartId: number, requestedPage: number, includeUserId = 0) =>
        db.$transaction(
            async (transaction) => {
                const totalCount = await transaction.playData.count({
                    where: {
                        chart_id: chartId,
                        score: { gt: 0 },
                        user: {
                            OR: [
                                { hide_play_scores: false },
                                { id: includeUserId },
                            ],
                        },
                    },
                });
                const page = normalizeRankingPage(requestedPage, totalCount);
                // Imported besttime is the achievement time; account creation and synchronization times are unrelated.
                const rows = await transaction.$queryRaw<unknown[]>`
            WITH ranked AS (
                SELECT p.user_id, p.rank, p.score, p.fc_type,
                    (RANK() OVER (ORDER BY p.score DESC))::integer AS position,
                    ROW_NUMBER() OVER (ORDER BY p.score DESC,
                        NULLIF(REPLACE(REPLACE(BTRIM(p.besttime), '/', '-'), 'T', ' '), '') ASC NULLS LAST,
                        p.user_id ASC) AS row_number
                FROM "PlayData" p JOIN "User" u ON u.id = p.user_id
                WHERE p.chart_id = ${chartId} AND p.score > 0 AND ${visiblePlayers(includeUserId)}
            )
            SELECT r.position, r.rank, r.score, r.fc_type, r.user_id,
                JSON_BUILD_OBJECT('id', u.id, 'username', u.username, 'avatar', u.avatar, 'country', u.country) AS "user"
            FROM ranked r JOIN "User" u ON u.id = r.user_id
            ORDER BY r.row_number
            OFFSET ${(page - 1) * MUSIC_RANKING_PAGE_SIZE} LIMIT ${MUSIC_RANKING_PAGE_SIZE}
        `;
                return {
                    rows: chartRankingRowSchema.array().parse(rows),
                    totalCount,
                    page,
                    pageSize: MUSIC_RANKING_PAGE_SIZE,
                };
            },
            { isolationLevel: Prisma.TransactionIsolationLevel.RepeatableRead }
        ),
    ["music-detail-ranking-v3"],
    {
        revalidate: PUBLIC_DATA_REVALIDATE_SECONDS,
        tags: [CACHE_TAGS.chartRankings],
    }
);

/** 곡선 위 사진 — 참가자가 이 수 이하면 모두, 넘으면 상위 몇 명(+ 나)만 (2026-09-17 사용자 결정) */
const SCORE_PLAYERS_ALL_LIMIT = 30;
const SCORE_PLAYERS_TOP = 3;

function scorePlayersQuery(
    chartId: number,
    filter: Prisma.Sql,
    limit: number,
    includeUserId: number
) {
    return Prisma.sql`
        WITH ranked AS (
            SELECT p.user_id, p.rank, p.score, p.fc_type,
                (RANK() OVER (ORDER BY p.score DESC))::integer AS position,
                (ROW_NUMBER() OVER (ORDER BY p.score DESC,
                    NULLIF(REPLACE(REPLACE(BTRIM(p.besttime), '/', '-'), 'T', ' '), '') ASC NULLS LAST,
                    p.user_id ASC))::integer AS row_number
            FROM "PlayData" p JOIN "User" u ON u.id = p.user_id
            WHERE p.chart_id = ${chartId} AND p.score > 0 AND ${visiblePlayers(includeUserId)}
        )
        SELECT r.position, r.row_number, r.rank, r.score, r.fc_type, r.user_id,
            JSON_BUILD_OBJECT('id', u.id, 'username', u.username, 'avatar', u.avatar, 'country', u.country) AS "user"
        FROM ranked r JOIN "User" u ON u.id = r.user_id
        ${filter}
        ORDER BY r.row_number
        LIMIT ${limit}
    `;
}

export const getChartScorePlayers = unstable_cache(
    async (chartId: number, totalCount: number, includeUserId = 0) => {
        const limit =
            totalCount <= SCORE_PLAYERS_ALL_LIMIT
                ? SCORE_PLAYERS_ALL_LIMIT
                : SCORE_PLAYERS_TOP;
        const rows = await db.$queryRaw<unknown[]>(
            scorePlayersQuery(chartId, Prisma.empty, limit, includeUserId)
        );
        return chartScorePlayerSchema.array().parse(rows);
    },
    ["music-detail-score-players-v1"],
    {
        revalidate: PUBLIC_DATA_REVALIDATE_SECONDS,
        tags: [CACHE_TAGS.chartRankings],
    }
);

/** 상위 목록에 없는 나 한 줄 — 사람마다 달라 캐시하지 않는다. 순위는 공개된 사람들 사이 내 자리 */
export async function getChartScorePlayer(chartId: number, userId: number) {
    const rows = await db.$queryRaw<unknown[]>(
        scorePlayersQuery(
            chartId,
            Prisma.sql`WHERE r.user_id = ${userId}`,
            1,
            userId
        )
    );
    return chartScorePlayerSchema.array().parse(rows)[0] ?? null;
}
