import "server-only";

import { unstable_cache } from "next/cache";
import db from "@/lib/db";
import { CACHE_TAGS } from "@/lib/cacheTags";
import { PUBLIC_DATA_REVALIDATE_SECONDS } from "@/lib/cachePolicy";
import { getModePianistRatingBasis } from "@/features/tiers/server/tierBrowserData";
import {
    BASIC_RATING_ACTIVE_CURVE,
    BASIC_RATING_SCORE_FLOOR,
    calculateBasicRating,
} from "@/lib/tiers/basicRating";
import type { BasicRatingRecord } from "@/lib/tiers/basicRating";
import {
    GLOBAL_RANKING_PAGE_SIZE,
    globalRankingPayloadSchema,
} from "@/features/rankings/schemas/globalRankingSchema";
import type {
    GlobalRankingPayload,
    GlobalRankingQuery,
    GlobalRankingRow,
} from "@/features/rankings/schemas/globalRankingSchema";

const playerFields = {
    id: true,
    username: true,
    avatar: true,
    country: true,
    grade_basic: true,
    grade_recital: true,
    exam_basic: true,
    exam_recital: true,
} as const;
type PopulationRow = Omit<GlobalRankingRow, "rank"> & { rawValue: number };

const getPublicRankingPopulation = unstable_cache(
    async (
        mode: GlobalRankingQuery["mode"],
        metric: GlobalRankingQuery["metric"]
    ): Promise<{
        status: GlobalRankingPayload["status"];
        rows: PopulationRow[];
    }> => {
        const gradeField = mode === "basic" ? "grade_basic" : "grade_recital";
        const examField = mode === "basic" ? "exam_basic" : "exam_recital";
        if (metric === "grade") {
            const users = await db.user.findMany({
                where: { [gradeField]: { gt: 0 } },
                select: playerFields,
                orderBy: [{ [gradeField]: "desc" }, { id: "asc" }],
            });
            return {
                status: "available",
                rows: users.map((user) => ({
                    id: user.id,
                    username: user.username,
                    avatar: user.avatar,
                    country: user.country,
                    exam: user[examField],
                    grade: user[gradeField] ?? 0,
                    value: Math.round((user[gradeField] ?? 0) / 100),
                    rawValue: user[gradeField] ?? 0,
                })),
            };
        }
        const basis = await getModePianistRatingBasis(mode);
        if (
            !basis.theoreticalMax ||
            basis.entries.some(
                (entry) =>
                    !Number.isFinite(entry.value) ||
                    entry.value < 1 ||
                    entry.value > 14.5
            ) ||
            new Set(basis.entries.map((entry) => entry.chartId)).size !==
                basis.entries.length
        )
            return { status: "unavailable", rows: [] };
        const constants = new Map(
            basis.entries.map((entry) => [entry.chartId, entry.value])
        );
        const records = await db.playData.findMany({
            where: {
                chart_id: { in: [...constants.keys()] },
                score: { gte: BASIC_RATING_SCORE_FLOOR },
                ...(mode === "recital" ? { grade_recital: { gt: 0 } } : {}),
            },
            select: { user_id: true, chart_id: true, score: true },
        });
        const byUser = new Map<number, BasicRatingRecord[]>();
        for (const record of records) {
            if (record.chart_id === null) continue;
            const tierConstant = constants.get(record.chart_id);
            if (tierConstant === undefined) continue;
            const playerRecords = byUser.get(record.user_id) ?? [];
            playerRecords.push({
                chartId: record.chart_id,
                score: record.score,
                tierConstant,
            });
            byUser.set(record.user_id, playerRecords);
        }
        const users = byUser.size
            ? await db.user.findMany({
                  where: { id: { in: [...byUser.keys()] } },
                  select: playerFields,
              })
            : [];
        return {
            status: "available",
            rows: users.flatMap((user) => {
                const result = calculateBasicRating(
                    byUser.get(user.id) ?? [],
                    basis.theoreticalMax!,
                    BASIC_RATING_ACTIVE_CURVE
                );
                if (result.rating <= 0) return [];
                const value = Math.round(result.rating);
                return [
                    {
                        id: user.id,
                        username: user.username,
                        avatar: user.avatar,
                        country: user.country,
                        exam: user[examField],
                        grade: user[gradeField] ?? 0,
                        value,
                        rating: value,
                        filledSlots: result.filledSlots,
                        rawValue: result.rating,
                    },
                ];
            }),
        };
    },
    ["global-ranking-population-v2"],
    {
        revalidate: PUBLIC_DATA_REVALIDATE_SECONDS,
        tags: [CACHE_TAGS.userRankings, CACHE_TAGS.tierLists],
    }
);

export async function getGlobalRankingPage(
    query: GlobalRankingQuery,
    viewerId: number | null
): Promise<GlobalRankingPayload> {
    const population = await getPublicRankingPopulation(
        query.mode,
        query.metric
    );
    const rows = population.rows
        .filter(
            (row) =>
                query.region === "all" ||
                (query.region === "kr"
                    ? row.country === "ko-KR"
                    : query.region === "jp"
                      ? row.country === "ja-JP"
                      : row.country !== "ko-KR" && row.country !== "ja-JP")
        )
        .sort(
            (left, right) =>
                right.value - left.value ||
                right.rawValue - left.rawValue ||
                left.id - right.id
        );
    const totalCount = rows.length;
    const page = Math.min(
        query.page,
        Math.max(1, Math.ceil(totalCount / GLOBAL_RANKING_PAGE_SIZE))
    );
    let rank = 0;
    const rankedRows = rows.map((row, index) => {
        if (!index || row.value !== rows[index - 1].value) rank = index + 1;
        return { ...row, rank };
    });
    const myIndex = rankedRows.findIndex((row) => row.id === viewerId);
    return globalRankingPayloadSchema.parse({
        query: { ...query, page },
        page,
        totalCount,
        status: population.status,
        viewerId,
        rows: rankedRows.slice(
            (page - 1) * GLOBAL_RANKING_PAGE_SIZE,
            page * GLOBAL_RANKING_PAGE_SIZE
        ),
        // Containing page uses stable row position: a shared rank can span multiple pages.
        currentUser:
            myIndex < 0
                ? null
                : {
                      ...rankedRows[myIndex],
                      page: Math.floor(myIndex / GLOBAL_RANKING_PAGE_SIZE) + 1,
                  },
    });
}
