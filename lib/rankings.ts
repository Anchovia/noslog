import db from "@/lib/db";
import type { Prisma } from "@/lib/generated/prisma";

export type UserRankingMode = "basic" | "recital";

interface RankingPositionOptions {
    userId: number;
    grade: number | null;
    mode: UserRankingMode;
    scope?: Prisma.UserWhereInput;
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
