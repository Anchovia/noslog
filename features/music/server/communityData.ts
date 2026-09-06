import "server-only";

import type { Prisma } from "@prisma/client";
import db from "@/lib/db";
import { TIER_GOALS, TIER_MODES, isTierGoal, isTierMode } from "@/lib/tiers";
import {
    canContributeGoalVote,
    summarizeGoalVotes,
} from "@/features/music/lib/community";
import {
    PATTERN_AXES,
    communityDataSchema,
    opinionPageSchema,
    patternSummarySchema,
} from "@/features/music/schemas/communitySchema";
import type {
    CommunityData,
    OpinionQuery,
} from "@/features/music/schemas/communitySchema";

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
                        result._count[axis] >= 3 ? result._avg[axis] : null,
                },
            ])
        )
    );
}

export async function getCommunityOpinions(
    query: OpinionQuery,
    userId?: number
) {
    const where: Prisma.CommunityChartEvaluationWhereInput = {
        chartId: query.chartId,
        excluded: false,
        opinionHidden: false,
        opinion: { not: null },
    };
    const orderBy: Prisma.CommunityChartEvaluationOrderByWithRelationInput[] =
        query.sort === "helpful"
            ? [
                  { helpful: { _count: "desc" } },
                  { opinionUpdatedAt: "desc" },
                  { id: "desc" },
              ]
            : [{ opinionUpdatedAt: "desc" }, { id: "desc" }];
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
                user: { select: { id: true, username: true, avatar: true } },
                _count: { select: { helpful: true } },
                helpful: {
                    where: { userId: userId ?? -1 },
                    select: { userId: true },
                },
            },
        }),
        db.communityChartEvaluation.count({ where }),
        userId
            ? db.playData.findFirst({
                  where: {
                      chart_id: query.chartId,
                      user_id: userId,
                      score: { gt: 0 },
                  },
                  select: { id: true },
              })
            : null,
    ]);
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
            user: row.user,
            helpfulCount: row._count.helpful,
            viewerHelpful: row.helpful.length > 0,
            own: row.user.id === userId,
            canReact: Boolean(record && row.user.id !== userId),
        })),
        total,
        nextOffset:
            query.offset + rows.length < total
                ? query.offset + rows.length
                : null,
    });
}

export async function getCommunityData(
    chartId: number,
    userId?: number
): Promise<CommunityData> {
    const [pattern, lists, votes, record, evaluation, history, opinions] =
        await Promise.all([
            getCommunityPattern(chartId),
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
                select: { mode: true, goal: true, value: true, userId: true },
            }),
            userId
                ? db.playData.findFirst({
                      where: { user_id: userId, chart_id: chartId },
                      select: {
                          score: true,
                          fc_type: true,
                          rank: true,
                          grade_recital: true,
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
            getCommunityOpinions(
                { chartId, sort: "helpful", offset: 0 },
                userId
            ),
        ]);
    const previous = new Map<string, number | null>();
    const events = history
        .flatMap((event) => {
            const { mode, goal } = event.tierList;
            if (!isTierMode(mode) || !goal || !isTierGoal(goal)) return [];
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
    return communityDataSchema.parse({
        pattern,
        canEvaluate: Boolean(record && record.score > 0),
        currentEvaluation: evaluation
            ? { ...evaluation, opinion: evaluation.opinion ?? "" }
            : null,
        scopes: TIER_MODES.flatMap((mode) =>
            TIER_GOALS.map((goal) => {
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
