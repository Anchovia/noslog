import "server-only";

import type { Prisma } from "@prisma/client";
import { unstable_cache } from "next/cache";

import { getNameLabels } from "@/features/contributions/server/contribution-point-service";
import {
    canContributeGoalVote,
    MIN_PATTERN_RATINGS,
    summarizeGoalVotes,
} from "@/features/music/lib/community";
import type {
    CommunityData,
    OpinionQuery,
    OpinionReplyQuery,
} from "@/features/music/schemas/community-schema";
import {
    communityDataSchema,
    opinionPageSchema,
    opinionReplyListSchema,
    PATTERN_AXES,
    patternSummarySchema,
} from "@/features/music/schemas/community-schema";
import {
    communityTranslationsSchema,
    isCommunityTranslationEnabled,
} from "@/features/music/server/community-translation";
import { PUBLIC_DATA_REVALIDATE_SECONDS } from "@/lib/cache-policy";
import { CACHE_TAGS, getChartEvaluationTag } from "@/lib/cache-tags";
import db from "@/lib/db";
import { detectTextLanguage } from "@/lib/i18n/text-language";
import {
    isTierGoal,
    isTierMode,
    isTierModeGoal,
    TIER_GOALS,
    TIER_MODE_GOALS,
    TIER_MODES,
} from "@/lib/tiers";

export async function getCommunityPattern(chartId: number) {
    const result = await db.communityChartEvaluation.aggregate({
        where: { chartId, excluded: false },
        _avg: {
            stairs: true,
            repetition: true,
            polyrhythm: true,
            offset: true,
            chords: true,
        },
        _count: {
            stairs: true,
            repetition: true,
            polyrhythm: true,
            offset: true,
            chords: true,
        },
    });
    return patternSummarySchema.parse(
        Object.fromEntries(
            PATTERN_AXES.map((axis) => [
                axis,
                {
                    count: result._count[axis],
                    average:
                        result._count[axis] >= MIN_PATTERN_RATINGS
                            ? result._avg[axis]
                            : null,
                },
            ])
        )
    );
}

// 패턴 평가 요약은 모두에게 같다 — 그 채보의 평가를 저장 · 정리할 때 채보 태그로 비운다(2026-10-15 S7, 채보별 2026-10-16)
export const getCachedCommunityPattern = (chartId: number) =>
    unstable_cache(
        () => getCommunityPattern(chartId),
        ["community-pattern-v2", String(chartId)],
        {
            tags: [CACHE_TAGS.chartEvaluations, getChartEvaluationTag(chartId)],
            revalidate: PUBLIC_DATA_REVALIDATE_SECONDS,
        }
    )();

/** hasRecord: 부른 쪽이 이미 이 사람 기록을 읽었으면 넘긴다 — 같은 요청에서 다시 읽지 않는다(2026-10-16 D8 · Q4) */
export async function getCommunityOpinions(
    query: OpinionQuery,
    userId?: number,
    hasRecord?: boolean
) {
    // 지운 의견이라도 남의 답글이 남아 있으면 자리를 남긴다(2026-09-22)
    const where: Prisma.CommunityChartEvaluationWhereInput = {
        chartId: query.chartId,
        excluded: false,
        opinionHidden: false,
        OR: [
            { opinion: { not: null } },
            { replies: { some: { hidden: false } } },
        ],
    };
    const orderBy: Prisma.CommunityChartEvaluationOrderByWithRelationInput[] =
        query.sort === "helpful"
            ? [
                  { helpful: { _count: "desc" } },
                  { opinionUpdatedAt: { sort: "desc", nulls: "last" } },
                  { id: "desc" },
              ]
            : [
                  { opinionUpdatedAt: { sort: "desc", nulls: "last" } },
                  { id: "desc" },
              ];
    const [rows, total, record] = await Promise.all([
        db.communityChartEvaluation.findMany({
            where,
            orderBy,
            skip: query.offset,
            take: 10,
            select: {
                id: true,
                opinion: true,
                createdAt: true,
                opinionCreatedAt: true,
                opinionUpdatedAt: true,
                opinionTranslations: true,
                user: {
                    select: {
                        id: true,
                        username: true,
                        avatar: true,
                        translationConsentAt: true,
                    },
                },
                _count: {
                    select: {
                        helpful: true,
                        replies: { where: { hidden: false } },
                    },
                },
                helpful: {
                    where: { userId: userId ?? -1 },
                    select: { userId: true },
                },
            },
        }),
        db.communityChartEvaluation.count({ where }),
        hasRecord !== undefined
            ? hasRecord || null
            : userId
              ? db.playData.findFirst({
                    where: {
                        chartId: query.chartId,
                        userId: userId,
                        score: { gt: 0 },
                    },
                    select: { id: true },
                })
              : null,
    ]);
    const labels = await getNameLabels(rows.map((row) => row.user.id));
    return opinionPageSchema.parse({
        items: rows.map((row) => ({
            id: row.id,
            opinion: row.opinion,
            createdAt: (row.opinionCreatedAt ?? row.createdAt).toISOString(),
            updatedAt: (row.opinionUpdatedAt ?? row.createdAt).toISOString(),
            edited: Boolean(
                row.opinionUpdatedAt &&
                row.opinionUpdatedAt.getTime() >
                    (row.opinionCreatedAt ?? row.createdAt).getTime()
            ),
            user: { ...row.user, label: labels.get(row.user.id) ?? null },
            helpfulCount: row._count.helpful,
            viewerHelpful: row.helpful.length > 0,
            own: row.user.id === userId,
            // 지운 의견 자리에는 좋아요 · 신고를 받지 않는다
            canReact: Boolean(
                record && row.opinion !== null && row.user.id !== userId
            ),
            replyCount: row._count.replies,
            language: row.opinion ? detectTextLanguage(row.opinion) : null,
            translations: communityTranslationsSchema.parse(
                (row.user.translationConsentAt
                    ? row.opinionTranslations
                    : null) ?? {}
            ),
            translatable: row.user.translationConsentAt !== null,
        })),
        translationEnabled: isCommunityTranslationEnabled(),
        total,
        nextOffset:
            query.offset + rows.length < total
                ? query.offset + rows.length
                : null,
    });
}

/*
 * 모두에게 같은 부분 — 서열 값 · 목표 투표 · 서열 이력(2026-10-15 S7). 서열표 저장(tierLists)과 그 채보의 목표 투표 저장(채보 태그) 때 비운다.
 * 투표 행의 userId 는 「내 투표」 를 고르는 데만 쓰고 응답에는 싣지 않는다
 */
const getCachedCommunityPublic = (chartId: number) =>
    unstable_cache(
        async () => {
            const [lists, votes, history] = await Promise.all([
                db.tierList.findMany({
                    where: {
                        mode: { in: [...TIER_MODES] },
                        goal: { in: [...TIER_GOALS] },
                        status: "published",
                    },
                    orderBy: [{ updatedAt: "desc" }, { id: "desc" }],
                    select: {
                        id: true,
                        mode: true,
                        goal: true,
                        entries: {
                            where: { chartId },
                            select: { tierBand: { select: { value: true } } },
                        },
                    },
                }),
                db.chartGoalVote.findMany({
                    where: { chartId, excluded: false },
                    select: {
                        mode: true,
                        goal: true,
                        value: true,
                        userId: true,
                    },
                }),
                db.tierPlacementHistory.findMany({
                    where: { chartId, tierList: { status: "published" } },
                    orderBy: [{ effectiveAt: "asc" }, { id: "asc" }],
                    select: {
                        id: true,
                        bandValue: true,
                        effectiveAt: true,
                        tierList: { select: { mode: true, goal: true } },
                    },
                }),
            ]);
            const previous = new Map<string, number | null>();
            const events = history
                .flatMap((event) => {
                    const { mode, goal } = event.tierList;
                    if (
                        !isTierMode(mode) ||
                        !goal ||
                        !isTierGoal(goal) ||
                        !isTierModeGoal(mode, goal)
                    )
                        return [];
                    const key = `${mode}:${goal}`;
                    const previousValue = previous.get(key) ?? null;
                    previous.set(key, event.bandValue);
                    return [
                        {
                            id: event.id,
                            mode,
                            goal,
                            previousValue,
                            value: event.bandValue,
                            effectiveAt: event.effectiveAt.toISOString(),
                        },
                    ];
                })
                .reverse();
            return { lists, votes, events };
        },
        ["community-public-v2", String(chartId)],
        {
            tags: [
                CACHE_TAGS.tierLists,
                CACHE_TAGS.chartEvaluations,
                getChartEvaluationTag(chartId),
            ],
            revalidate: PUBLIC_DATA_REVALIDATE_SECONDS,
        }
    )();

/** 곡 상세 서열 탭에서 부를 때는 이미 읽은 이 사람 기록을 넘긴다(없으면 null) — 같은 PlayData 를 세 번 읽지 않는다(2026-10-16 D8 · Q4) */
export interface CommunityViewerRecord {
    score: number;
    fcType: number;
    rank: string;
    gradeRecital: number | null;
}

export async function getCommunityData(
    chartId: number,
    userId?: number,
    viewerRecord?: CommunityViewerRecord | null
): Promise<CommunityData> {
    const [pattern, { lists, votes, events }, record, evaluation, opinions] =
        await Promise.all([
            getCachedCommunityPattern(chartId),
            getCachedCommunityPublic(chartId),
            viewerRecord !== undefined
                ? viewerRecord
                : userId
                  ? db.playData.findFirst({
                        where: { userId: userId, chartId: chartId },
                        select: {
                            score: true,
                            fcType: true,
                            rank: true,
                            gradeRecital: true,
                        },
                    })
                  : null,
            userId
                ? db.communityChartEvaluation.findUnique({
                      where: { chartId_userId: { chartId, userId } },
                      select: {
                          stairs: true,
                          repetition: true,
                          polyrhythm: true,
                          offset: true,
                          chords: true,
                          opinion: true,
                          excluded: true,
                      },
                  })
                : null,
            getCommunityOpinions(
                { chartId, sort: "newest", offset: 0 },
                userId,
                viewerRecord !== undefined
                    ? Boolean(viewerRecord && viewerRecord.score > 0)
                    : undefined
            ),
        ]);
    return communityDataSchema.parse({
        pattern,
        canEvaluate: Boolean(record && record.score > 0),
        currentEvaluation: evaluation
            ? { ...evaluation, opinion: evaluation.opinion ?? "" }
            : null,
        scopes: TIER_MODES.flatMap((mode) =>
            TIER_MODE_GOALS[mode].map((goal) => {
                const list = lists.find(
                    (item) => item.mode === mode && item.goal === goal
                );
                const scopedVotes = votes.filter(
                    (vote) => vote.mode === mode && vote.goal === goal
                );
                const summary = summarizeGoalVotes(
                    scopedVotes.map((vote) => vote.value)
                );
                const officialValue = list?.entries[0]?.tierBand.value ?? null;
                return {
                    mode,
                    goal,
                    officialValue,
                    placement: !list
                        ? "not-published"
                        : officialValue === null
                          ? "not-listed"
                          : "published",
                    count: summary.count,
                    average: summary.count >= 3 ? summary.mean : null,
                    distribution:
                        summary.count >= 3 ? summary.distribution : [],
                    eligible: canContributeGoalVote(record, mode, goal),
                    ownVote:
                        scopedVotes.find((vote) => vote.userId === userId)
                            ?.value ?? null,
                };
            })
        ),
        history: events,
        opinions,
    });
}

// 의견 하나의 답글 — 한 단계, 오래된 것부터(대화 순서). 한 의견에 많아야 수십 개라 한 번에 준다(2026-09-22 R1)
export async function getOpinionReplies(
    query: OpinionReplyQuery,
    userId?: number
) {
    const [rows, opinion, record] = await Promise.all([
        db.communityOpinionReply.findMany({
            where: {
                evaluationId: query.evaluationId,
                hidden: false,
                evaluation: {
                    chartId: query.chartId,
                    excluded: false,
                    opinionHidden: false,
                },
            },
            orderBy: [{ createdAt: "asc" }, { id: "asc" }],
            take: 200,
            select: {
                id: true,
                body: true,
                translations: true,
                createdAt: true,
                updatedAt: true,
                user: {
                    select: {
                        id: true,
                        username: true,
                        avatar: true,
                        translationConsentAt: true,
                    },
                },
                _count: { select: { likes: true } },
                likes: {
                    where: { userId: userId ?? -1 },
                    select: { userId: true },
                },
            },
        }),
        db.communityChartEvaluation.findFirst({
            where: {
                id: query.evaluationId,
                chartId: query.chartId,
                excluded: false,
                opinionHidden: false,
            },
            select: { opinion: true },
        }),
        userId
            ? db.playData.findFirst({
                  where: {
                      chartId: query.chartId,
                      userId: userId,
                      score: { gt: 0 },
                  },
                  select: { id: true },
              })
            : null,
    ]);
    const labels = await getNameLabels(rows.map((row) => row.user.id));
    return opinionReplyListSchema.parse({
        items: rows.map((row) => ({
            id: row.id,
            body: row.body,
            createdAt: row.createdAt.toISOString(),
            updatedAt: row.updatedAt.toISOString(),
            // 좋아요만 눌려도 updatedAt 은 바뀌지 않는다(본문 고침에만) — 1초 여유
            edited: row.updatedAt.getTime() - row.createdAt.getTime() > 1000,
            user: { ...row.user, label: labels.get(row.user.id) ?? null },
            likeCount: row._count.likes,
            viewerLiked: row.likes.length > 0,
            own: row.user.id === userId,
            canReact: Boolean(record && row.user.id !== userId),
            language: detectTextLanguage(row.body),
            translations: communityTranslationsSchema.parse(
                (row.user.translationConsentAt ? row.translations : null) ?? {}
            ),
            translatable: row.user.translationConsentAt !== null,
        })),
        translationEnabled: isCommunityTranslationEnabled(),
        // 새 답글은 보이는 의견에만(지운 의견 자리에는 받지 않는다)
        canReply: Boolean(record && opinion?.opinion),
    });
}
