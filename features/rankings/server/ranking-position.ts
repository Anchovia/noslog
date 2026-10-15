import "server-only";

import type { Prisma } from "@prisma/client";

import type { GlobalRankingQuery } from "@/features/rankings/schemas/global-ranking-schema";
import db from "@/lib/db";
import { statsGradeField } from "@/lib/player-stats";

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

    const gradeField = statsGradeField(mode);
    const higherUserCount = await db.user.count({
        where: {
            AND: [
                scope,
                // 점수 비공개 플레이어는 순위에서 빠진다 — 남은 사람 가운데 몇 등인지(2026-09-18 S3)
                { hide_play_scores: false },
                {
                    stats: {
                        [gradeField]: {
                            gt: 0,
                            gte: (Math.round(grade / 100) + 0.5) * 100,
                        },
                    },
                },
            ],
        },
    });

    return higherUserCount + 1;
}
