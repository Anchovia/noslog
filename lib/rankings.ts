import db from "@/lib/db";
import { CACHE_TAGS } from "@/lib/cacheTags";
import type { Prisma } from "@prisma/client";
import { unstable_cache } from "next/cache";

export type UserRankingMode = "basic" | "recital";
export type UserRankingRegion = "all" | "kr" | "jp" | "global";

export interface UserRankingRow {
    id: number;
    rank: number;
    username: string | null;
    avatar: string | null;
    country: string;
    grade: number;
    exam: number | null;
}

interface RankingPositionOptions {
    userId: number;
    grade: number | null;
    mode: UserRankingMode;
    scope?: Prisma.UserWhereInput;
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

// 홈과 랭킹 페이지가 같은 공개 순위 데이터를 공유하도록 캐시함
export const getCachedUserRankingPage = unstable_cache(
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
    ["user-ranking-page"],
    {
        revalidate: 300,
        tags: [CACHE_TAGS.userRankings],
    }
);

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
