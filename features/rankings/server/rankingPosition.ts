import "server-only";

import type { Prisma } from "@prisma/client";
import db from "@/lib/db";
import type { GlobalRankingQuery } from "@/features/rankings/schemas/globalRankingSchema";

interface RankingPositionOptions {
    userId: number;
    grade: number | null;
    mode: GlobalRankingQuery["mode"];
    scope?: Prisma.UserWhereInput;
}

// Published integer Grd defines competition rank, including the profile summaries.
export async function getUserRankingPosition({
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
                    [gradeField]: {
                        gte: (Math.round(grade / 100) + 0.5) * 100,
                    },
                },
            ],
        },
    });

    return higherUserCount + 1;
}
