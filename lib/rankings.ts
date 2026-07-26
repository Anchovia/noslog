import { CACHE_TAGS } from "@/lib/cacheTags";
import db from "@/lib/db";
import {
    BASIC_RATING_ACTIVE_CURVE,
    BASIC_RATING_POLICY_VERSION,
    BASIC_RATING_SCORE_FLOOR,
    BASIC_RATING_TIER_GOAL,
    BASIC_RATING_TIER_MODE,
    BASIC_RATING_TOP_COUNT,
    calculateBasicRating,
    calculateBasicRatingTheoreticalMax,
    type BasicRatingRecord,
} from "@/lib/tiers/basicRating";
import { Prisma } from "@prisma/client";
import { unstable_cache } from "next/cache";

export type UserRankingMode = "basic" | "recital";
export type UserRankingMetric = "grade" | "rating";
export type UserRankingRegion = "all" | "kr" | "jp" | "global";

export interface UserRankingRow {
    id: number;
    rank: number;
    username: string | null;
    avatar: string | null;
    country: string;
    grade: number;
    exam: number | null;
    rating?: number;
    filledSlots?: number;
}

export interface UserRankingPayload {
    page: number;
    totalCount: number;
    rows: UserRankingRow[];
    currentUser: UserRankingRow | null;
}

interface RankingViewer {
    id: number;
    username: string | null;
    avatar: string | null;
    country: string;
    grade_basic: number | null;
    grade_recital: number | null;
    exam_basic: number | null;
    exam_recital: number | null;
}

interface RankingPositionOptions {
    userId: number;
    grade: number | null;
    mode: UserRankingMode;
    scope?: Prisma.UserWhereInput;
}

interface BasicRatingSourceRevision {
    id: number;
    status: string;
    revision: string;
}

interface BasicRatingRankingRow extends UserRankingRow {
    rating: number;
    ratingRaw: number;
    rawTotal: number;
    filledSlots: number;
}

export function getRankingRegionWhere(
    region: UserRankingRegion
): Prisma.UserWhereInput {
    if (region === "kr") return { country: "ko-KR" };
    if (region === "jp") return { country: "ja-JP" };
    if (region === "global") {
        return { country: { notIn: ["ko-KR", "ja-JP"] } };
    }
    return {};
}

function matchesRankingRegion(country: string, region: UserRankingRegion) {
    if (region === "kr") return country === "ko-KR";
    if (region === "jp") return country === "ja-JP";
    if (region === "global") {
        return country !== "ko-KR" && country !== "ja-JP";
    }
    return true;
}

export function normalizeRankingMode(value?: string | null): UserRankingMode {
    return value === "recital" ? "recital" : "basic";
}

export function normalizeRankingMetric(
    value?: string | null,
    mode: UserRankingMode = "basic"
): UserRankingMetric {
    return value === "rating" && mode === "basic" ? "rating" : "grade";
}

export function normalizeRankingRegion(
    value?: string | null
): UserRankingRegion {
    return value === "kr" || value === "jp" || value === "global"
        ? value
        : "all";
}

// 홈과 공식 Grd 랭킹 페이지가 같은 공개 순위 데이터를 공유하도록 캐시함
const getCachedGradeRankingPage = unstable_cache(
    async (
        mode: UserRankingMode,
        region: UserRankingRegion,
        page: number,
        pageSize: number
    ) => {
        const gradeField = mode === "basic" ? "grade_basic" : "grade_recital";
        const examField = mode === "basic" ? "exam_basic" : "exam_recital";
        const where: Prisma.UserWhereInput = {
            ...getRankingRegionWhere(region),
            [gradeField]: { gt: 0 },
        };
        const [totalCount, users] = await Promise.all([
            db.user.count({ where }),
            db.user.findMany({
                where,
                select: {
                    id: true,
                    username: true,
                    avatar: true,
                    country: true,
                    grade_basic: true,
                    grade_recital: true,
                    exam_basic: true,
                    exam_recital: true,
                },
                orderBy: [{ [gradeField]: "desc" }, { id: "asc" }],
                skip: (page - 1) * pageSize,
                take: pageSize,
            }),
        ]);

        const rows: UserRankingRow[] = users.map((user, index) => ({
            id: user.id,
            rank: (page - 1) * pageSize + index + 1,
            username: user.username,
            avatar: user.avatar,
            country: user.country,
            grade: user[gradeField] ?? 0,
            exam: user[examField],
        }));

        return { totalCount, rows };
    },
    ["user-grade-ranking-page"],
    {
        revalidate: 300,
        tags: [CACHE_TAGS.userRankings],
    }
);

// 서열표 본문이 바뀌면 별도 수동 작업 없이 새로운 캐시 키를 사용함
async function getBasicRatingSourceRevision() {
    const rows = await db.$queryRaw<BasicRatingSourceRevision[]>(Prisma.sql`
        SELECT
            list."id",
            list."status",
            CONCAT_WS(
                ':',
                list."updated_at"::text,
                COALESCE(
                    (
                        SELECT MAX(band."updated_at")::text
                        FROM "TierBand" AS band
                        WHERE band."tier_list_id" = list."id"
                    ),
                    ''
                ),
                COALESCE(
                    (
                        SELECT MAX(entry."updated_at")::text
                        FROM "TierEntry" AS entry
                        WHERE entry."tier_list_id" = list."id"
                    ),
                    ''
                ),
                (
                    SELECT COUNT(*)::text
                    FROM "TierBand" AS band
                    WHERE band."tier_list_id" = list."id"
                ),
                (
                    SELECT COUNT(*)::text
                    FROM "TierEntry" AS entry
                    WHERE entry."tier_list_id" = list."id"
                )
            ) AS "revision"
        FROM "TierList" AS list
        WHERE list."mode" = ${BASIC_RATING_TIER_MODE}
          AND list."goal" = ${BASIC_RATING_TIER_GOAL}
          AND list."status" = 'published'
        ORDER BY list."updated_at" DESC
        LIMIT 1
    `);

    const source = rows[0];
    return source?.status === "published" ? source : null;
}

async function queryBasicRatingRankingRows(tierListId: number) {
    const tierList = await db.tierList.findUnique({
        where: { id: tierListId },
        select: {
            status: true,
            entries: {
                select: {
                    chartId: true,
                    tierBand: { select: { value: true } },
                },
            },
        },
    });
    if (
        !tierList ||
        tierList.status !== "published" ||
        tierList.entries.length < BASIC_RATING_TOP_COUNT
    )
        return [];

    const theoreticalMax = calculateBasicRatingTheoreticalMax(
        tierList.entries.map((entry) => entry.tierBand.value)
    );
    if (theoreticalMax <= 0) return [];

    const tierConstantByChartId = new Map(
        tierList.entries.map((entry) => [entry.chartId, entry.tierBand.value])
    );
    const playRecords = await db.playData.findMany({
        where: {
            chart_id: { in: [...tierConstantByChartId.keys()] },
            score: { gte: BASIC_RATING_SCORE_FLOOR },
        },
        select: {
            user_id: true,
            chart_id: true,
            score: true,
        },
    });
    const userIds = [...new Set(playRecords.map((record) => record.user_id))];
    if (userIds.length === 0) return [];

    const users = await db.user.findMany({
        where: { id: { in: userIds } },
        select: {
            id: true,
            username: true,
            avatar: true,
            country: true,
            grade_basic: true,
            exam_basic: true,
        },
    });
    const recordsByUser = new Map<number, BasicRatingRecord[]>();
    for (const record of playRecords) {
        if (record.chart_id === null) continue;
        const tierConstant = tierConstantByChartId.get(record.chart_id);
        if (tierConstant === undefined) continue;

        const records = recordsByUser.get(record.user_id) ?? [];
        records.push({
            chartId: record.chart_id,
            score: record.score,
            tierConstant,
        });
        recordsByUser.set(record.user_id, records);
    }

    return users.flatMap((user): BasicRatingRankingRow[] => {
        const records = recordsByUser.get(user.id);
        if (!records?.length) return [];

        const result = calculateBasicRating(
            records,
            theoreticalMax,
            BASIC_RATING_ACTIVE_CURVE
        );
        if (result.rating <= 0) return [];

        return [
            {
                id: user.id,
                rank: 0,
                username: user.username,
                avatar: user.avatar,
                country: user.country,
                grade: user.grade_basic ?? 0,
                exam: user.exam_basic,
                rating: Math.round(result.rating),
                ratingRaw: result.rating,
                rawTotal: result.rawTotal,
                filledSlots: result.filledSlots,
            },
        ];
    });
}

const getCachedBasicRatingRankingRows = unstable_cache(
    async (
        policyVersion: string,
        tierListId: number,
        tierListRevision: string
    ) => {
        if (!policyVersion || !tierListRevision) return [];
        return queryBasicRatingRankingRows(tierListId);
    },
    ["user-basic-rating-ranking"],
    {
        revalidate: 300,
        tags: [CACHE_TAGS.userRankings, CACHE_TAGS.tierLists],
    }
);

async function getBasicRatingRankingRows(region: UserRankingRegion) {
    const source = await getBasicRatingSourceRevision();
    if (!source) return [];

    const rows = await getCachedBasicRatingRankingRows(
        BASIC_RATING_POLICY_VERSION,
        source.id,
        source.revision
    );

    return rows
        .filter((row) => matchesRankingRegion(row.country, region))
        .sort(
            (left, right) =>
                right.ratingRaw - left.ratingRaw ||
                right.rawTotal - left.rawTotal ||
                left.id - right.id
        )
        .map((row, index) => ({ ...row, rank: index + 1 }));
}

export async function getCachedUserRankingPage(
    mode: UserRankingMode,
    region: UserRankingRegion,
    page: number,
    pageSize: number,
    metric: UserRankingMetric = "grade"
) {
    if (metric === "rating" && mode === "basic") {
        const rows = await getBasicRatingRankingRows(region);
        return {
            totalCount: rows.length,
            rows: rows.slice((page - 1) * pageSize, page * pageSize),
        };
    }

    return getCachedGradeRankingPage(mode, region, page, pageSize);
}

// 현재 Grd와 동일한 동점 규칙으로 유저의 순위를 계산함
export async function getUserRankingPosition({
    userId,
    grade,
    mode,
    scope = {},
}: RankingPositionOptions) {
    if (!grade || grade <= 0) return null;

    const gradeField = mode === "basic" ? "grade_basic" : "grade_recital";
    const higherUserCount = await db.user.count({
        where: {
            AND: [
                scope,
                { [gradeField]: { gt: 0 } },
                {
                    OR: [
                        { [gradeField]: { gt: grade } },
                        {
                            AND: [
                                { [gradeField]: grade },
                                { id: { lt: userId } },
                            ],
                        },
                    ],
                },
            ],
        },
    });

    return higherUserCount + 1;
}

export async function getCurrentUserRankingRow(
    user: RankingViewer | null,
    mode: UserRankingMode,
    region: UserRankingRegion,
    metric: UserRankingMetric = "grade"
): Promise<UserRankingRow | null> {
    if (!user) return null;

    if (metric === "rating" && mode === "basic") {
        return (
            (await getBasicRatingRankingRows(region)).find(
                (row) => row.id === user.id
            ) ?? null
        );
    }

    const gradeField = mode === "basic" ? "grade_basic" : "grade_recital";
    const examField = mode === "basic" ? "exam_basic" : "exam_recital";
    const grade = user[gradeField] ?? 0;
    const matchesRegion =
        region === "all" ||
        (region === "kr" && user.country === "ko-KR") ||
        (region === "jp" && user.country === "ja-JP") ||
        (region === "global" &&
            user.country !== "ko-KR" &&
            user.country !== "ja-JP");

    if (grade <= 0 || !matchesRegion) return null;

    const rank = await getUserRankingPosition({
        userId: user.id,
        grade,
        mode,
        scope: getRankingRegionWhere(region),
    });

    return {
        id: user.id,
        rank: rank!,
        username: user.username,
        avatar: user.avatar,
        country: user.country,
        grade,
        exam: user[examField],
    };
}
