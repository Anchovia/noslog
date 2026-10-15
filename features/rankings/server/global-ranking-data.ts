import "server-only";

import { unstable_cache } from "next/cache";

import { getNameLabels } from "@/features/contributions/server/contribution-point-service";
import {
    examAchievementGradeSelect,
    getBestExamGrade,
} from "@/features/exams/exam-grades";
import type {
    GlobalRankingPayload,
    GlobalRankingQuery,
    GlobalRankingRow,
} from "@/features/rankings/schemas/global-ranking-schema";
import {
    GLOBAL_RANKING_PAGE_SIZE,
    globalRankingPayloadSchema,
} from "@/features/rankings/schemas/global-ranking-schema";
import {
    getRatingBasis,
    rebuildPlayerRatings,
} from "@/features/rankings/server/player-rating-service";
import { PUBLIC_DATA_REVALIDATE_SECONDS } from "@/lib/cache-policy";
import { CACHE_TAGS } from "@/lib/cache-tags";
import db from "@/lib/db";

const playerFields = {
    id: true,
    username: true,
    avatar: true,
    country: true,
    grade_basic: true,
    grade_recital: true,
    hide_play_scores: true,
    examAchievements: examAchievementGradeSelect,
} as const;
// hidden = 점수 비공개 — 캐시에는 담아 두되 응답 전에 뺀다(본인이 볼 때만 남김, 2026-09-18 S3)
type PopulationRow = Omit<GlobalRankingRow, "rank"> & {
    rawValue: number;
    hidden: boolean;
};

const getPublicRankingPopulation = unstable_cache(
    async (
        mode: GlobalRankingQuery["mode"],
        metric: GlobalRankingQuery["metric"]
    ): Promise<{
        status: GlobalRankingPayload["status"];
        rows: PopulationRow[];
    }> => {
        const gradeField = mode === "basic" ? "grade_basic" : "grade_recital";
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
                    exam: getBestExamGrade(user.examAchievements, mode),
                    grade: user[gradeField] ?? 0,
                    value: Math.round((user[gradeField] ?? 0) / 100),
                    rawValue: user[gradeField] ?? 0,
                    hidden: user.hide_play_scores,
                })),
            };
        }
        // 레이팅은 사람마다 저장해 둔 값을 읽는다(2026-10-15 L2-A2). 표가 비었거나 기준(서열 상수 · 계산식)이
        // 바뀌었으면 여기서 한 번 모두 다시 센다 — 배포 뒤 첫 방문 · 서열표 저장 뒤 after() 가 끝나기 전
        const basis = await getRatingBasis(mode);
        if (!basis) return { status: "unavailable", rows: [] };
        const readStored = () =>
            db.playerRating.findMany({
                where: { mode },
                select: {
                    rating: true,
                    filled_slots: true,
                    basis_version: true,
                    user: { select: playerFields },
                },
            });
        let stored = await readStored();
        if (
            !stored.length ||
            stored.some((row) => row.basis_version !== basis.version)
        ) {
            await rebuildPlayerRatings(mode, basis);
            stored = await readStored();
        }
        return {
            status: "available",
            rows: stored.map(({ rating, filled_slots, user }) => {
                const value = Math.round(rating);
                return {
                    id: user.id,
                    username: user.username,
                    avatar: user.avatar,
                    country: user.country,
                    exam: getBestExamGrade(user.examAchievements, mode),
                    grade: user[gradeField] ?? 0,
                    value,
                    rating: value,
                    filledSlots: filled_slots,
                    rawValue: rating,
                    hidden: user.hide_play_scores,
                };
            }),
        };
    },
    ["global-ranking-population-v5"],
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
        .filter((row) => !row.hidden || row.id === viewerId)
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
    const pageRows = rankedRows.slice(
        (page - 1) * GLOBAL_RANKING_PAGE_SIZE,
        page * GLOBAL_RANKING_PAGE_SIZE
    );
    // 기여 라벨은 캐시 밖에서 보이는 줄만 — 적립되면 바로 바뀐다
    const labels = await getNameLabels([
        ...pageRows.map((row) => row.id),
        ...(myIndex < 0 ? [] : [rankedRows[myIndex].id]),
    ]);
    return globalRankingPayloadSchema.parse({
        query: { ...query, page },
        page,
        totalCount,
        status: population.status,
        viewerId,
        rows: pageRows.map((row) => ({
            ...row,
            label: labels.get(row.id) ?? null,
        })),
        // Containing page uses stable row position: a shared rank can span multiple pages.
        currentUser:
            myIndex < 0
                ? null
                : {
                      ...rankedRows[myIndex],
                      label: labels.get(rankedRows[myIndex].id) ?? null,
                      page: Math.floor(myIndex / GLOBAL_RANKING_PAGE_SIZE) + 1,
                  },
    });
}

/**
 * 프로필 머리 수치 상자 「NosLog 레이팅」(2026-09-26 T1) — 랭킹 페이지와 같은 캐시된 레이팅 집계에서 내 값 · 자리만.
 * 순위 = 점수를 공개한 다른 플레이어 중 반올림 레이팅이 나보다 높은 수 + 1(공동 순위는 랭킹 표와 같음),
 * 국가는 같은 국가 코드끼리. 집계에 없으면(레이팅 0 · 기준표 없음) null
 */
export async function getProfileRatingStanding(
    userId: number,
    mode: GlobalRankingQuery["mode"],
    country: string | null
) {
    const population = await getPublicRankingPopulation(mode, "rating");
    if (population.status !== "available") return null;
    const me = population.rows.find((row) => row.id === userId);
    if (!me) return null;
    const others = population.rows.filter(
        (row) => !row.hidden && row.id !== userId
    );
    const position = (rows: PopulationRow[]) =>
        rows.filter((row) => row.value > me.value).length + 1;
    return {
        value: me.value,
        /** 프로필 머리는 Grd 처럼 소수 둘째 자리까지 보여 준다(2026-10-01 사용자) — 순위 계산은 반올림 값 그대로 */
        exactValue: me.rawValue,
        world: position(others),
        country: country
            ? position(others.filter((row) => row.country === country))
            : null,
    };
}
