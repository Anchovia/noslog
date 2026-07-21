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

export function normalizeRankingMode(value?: string | null): UserRankingMode {
    return value === "recital" ? "recital" : "basic";
}

export function normalizeRankingRegion(
    value?: string | null
): UserRankingRegion {
    return value === "kr" || value === "jp" || value === "global"
        ? value
        : "all";
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

export async function getCurrentUserRankingRow(
    user: RankingViewer | null,
    mode: UserRankingMode,
    region: UserRankingRegion
): Promise<UserRankingRow | null> {
    if (!user) return null;

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
