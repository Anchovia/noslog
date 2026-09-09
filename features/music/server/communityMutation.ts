import "server-only";

import { Prisma } from "@prisma/client";
import db from "@/lib/db";
import { ApiError } from "@/lib/api/response";
import {
    canContributeGoalVote,
    summarizeGoalVotes,
} from "@/features/music/lib/community";
import { communityMutationSchema } from "@/features/music/schemas/communitySchema";
import type { CommunityMutation } from "@/features/music/schemas/communitySchema";

async function detachDeletedOpinion(
    transaction: Prisma.TransactionClient,
    evaluationId: number
) {
    await transaction.communityOpinionHelpful.deleteMany({
        where: { evaluationId },
    });
    await transaction.communityOpinionReport.updateMany({
        where: { evaluationId },
        data: { evaluationId: null },
    });
}

async function updateVoteReview(
    transaction: Prisma.TransactionClient,
    chartId: number,
    mode: string,
    goal: string
) {
    const list = await transaction.tierList.findFirst({
        where: { mode, goal, status: "published" },
        orderBy: [{ updatedAt: "desc" }, { id: "desc" }],
        select: {
            entries: {
                where: { chartId },
                select: { tierBand: { select: { value: true } } },
            },
        },
    });
    const officialValue = list?.entries[0]?.tierBand.value;
    if (officialValue === undefined) return;
    const votes = await transaction.chartGoalVote.findMany({
        where: { chartId, mode, goal, excluded: false },
        select: { value: true },
    });
    const summary = summarizeGoalVotes(votes.map((vote) => vote.value));
    const evidence = {
        officialValue,
        count: summary.count,
        mean: summary.mean,
        median: summary.median,
        distribution: summary.distribution,
    };
    const disagreement =
        summary.count >= 5 &&
        (officialValue < summary.lowerQuartile! ||
            officialValue > summary.upperQuartile!);
    if (disagreement) {
        await transaction.chartGoalVoteReview.upsert({
            where: { chartId_mode_goal: { chartId, mode, goal } },
            create: { chartId, mode, goal, ...evidence },
            update: evidence,
        });
    } else {
        await transaction.chartGoalVoteReview.updateMany({
            where: { chartId, mode, goal },
            data: evidence,
        });
    }
}

async function executeMutation(
    transaction: Prisma.TransactionClient,
    input: CommunityMutation,
    userId: number
) {
    if (input.action === "report") {
        const opinion = await transaction.communityChartEvaluation.findFirst({
            where: {
                id: input.input.evaluationId,
                excluded: false,
                opinionHidden: false,
                opinion: { not: null },
                userId: { not: userId },
            },
            select: { id: true, chartId: true, userId: true, opinion: true },
        });
        if (!opinion) throw new ApiError("opinion_unavailable", "unavailable");
        const { evaluationId, reason, explanation } = input.input;
        await transaction.communityOpinionReport.upsert({
            where: { evaluationId_userId: { evaluationId, userId } },
            create: {
                evaluationId,
                userId,
                reason,
                explanation,
                authorId: opinion.userId,
                opinionSnapshot: opinion.opinion!,
            },
            update: {},
        });
        return { chartId: opinion.chartId };
    }

    if (input.action === "helpful") {
        const opinion = await transaction.communityChartEvaluation.findFirst({
            where: {
                id: input.evaluationId,
                excluded: false,
                opinionHidden: false,
                opinion: { not: null },
                userId: { not: userId },
            },
            select: { chartId: true },
        });
        if (!opinion) throw new ApiError("opinion_unavailable", "unavailable");
        const record = await transaction.playData.findFirst({
            where: {
                chart_id: opinion.chartId,
                user_id: userId,
                score: { gt: 0 },
            },
            select: { id: true },
        });
        if (!record) throw new ApiError("chart_record_required", "ineligible");
        if (input.selected)
            await transaction.communityOpinionHelpful.upsert({
                where: {
                    evaluationId_userId: {
                        evaluationId: input.evaluationId,
                        userId,
                    },
                },
                create: { evaluationId: input.evaluationId, userId },
                update: {},
            });
        else
            await transaction.communityOpinionHelpful.deleteMany({
                where: { evaluationId: input.evaluationId, userId },
            });
        return {
            chartId: opinion.chartId,
            helpfulCount: await transaction.communityOpinionHelpful.count({
                where: { evaluationId: input.evaluationId },
            }),
            selected: input.selected,
        };
    }

    const chartId = "input" in input ? input.input.chartId : input.chartId;
    const chart = await transaction.musicChart.findUnique({
        where: { id: chartId },
        select: { id: true },
    });
    if (!chart) throw new ApiError("chart_unavailable", "unavailable");

    if (input.action === "delete-evaluation") {
        await transaction.communityChartEvaluation.deleteMany({
            where: { chartId, userId },
        });
        return { chartId };
    }
    if (input.action === "delete-opinion") {
        const previous = await transaction.communityChartEvaluation.findUnique({
            where: { chartId_userId: { chartId, userId } },
            select: { id: true },
        });
        if (previous) await detachDeletedOpinion(transaction, previous.id);
        await transaction.communityChartEvaluation.updateMany({
            where: { chartId, userId },
            data: {
                opinion: null,
                opinionUpdatedAt: null,
                opinionCreatedAt: null,
            },
        });
        return { chartId };
    }
    const record = await transaction.playData.findFirst({
        where: { chart_id: chartId, user_id: userId },
        select: {
            id: true,
            score: true,
            rank: true,
            fc_type: true,
            grade_recital: true,
        },
    });
    if (input.action === "save-evaluation") {
        if (!record || record.score <= 0)
            throw new ApiError("chart_record_required", "ineligible");
        const previous = await transaction.communityChartEvaluation.findUnique({
            where: { chartId_userId: { chartId, userId } },
            select: {
                id: true,
                opinion: true,
                opinionUpdatedAt: true,
                opinionCreatedAt: true,
                excluded: true,
            },
        });
        if (previous?.excluded)
            throw new ApiError("evaluation_excluded", "unavailable");
        const { stairs, repetition, polyrhythm, offset, chords } = input.input;
        const opinion = input.input.opinion || null;
        if (!opinion && previous?.opinion)
            await detachDeletedOpinion(transaction, previous.id);
        const now = new Date();
        const opinionCreatedAt = opinion
            ? (previous?.opinionCreatedAt ?? now)
            : null;
        const opinionUpdatedAt =
            previous?.opinion === opinion
                ? previous?.opinionUpdatedAt
                : opinion
                  ? now
                  : null;
        const values = {
            stairs,
            repetition,
            polyrhythm,
            offset,
            chords,
            opinion,
            opinionUpdatedAt,
            opinionCreatedAt,
        };
        await transaction.communityChartEvaluation.upsert({
            where: { chartId_userId: { chartId, userId } },
            create: { chartId, userId, ...values },
            update: values,
        });
        return { chartId };
    }

    const { mode, goal } = input.input;
    const scope = { chartId, userId, mode, goal };
    const existing = await transaction.chartGoalVote.findUnique({
        where: { chartId_userId_mode_goal: scope },
    });
    if (input.action === "save-vote") {
        if (!canContributeGoalVote(record, mode, goal))
            throw new ApiError("goal_record_required", "ineligible");
        if (existing?.excluded)
            throw new ApiError("vote_excluded", "unavailable");
        await transaction.chartGoalVote.upsert({
            where: { chartId_userId_mode_goal: scope },
            create: { ...scope, value: input.input.value },
            update: { value: input.input.value },
        });
    } else {
        if (!existing) return { chartId };
        await transaction.chartGoalVote.delete({ where: { id: existing.id } });
    }
    await transaction.chartGoalVoteAudit.create({
        data: {
            ...scope,
            action:
                input.action === "delete-vote"
                    ? "delete"
                    : existing
                      ? "edit"
                      : "create",
            previousValue: existing?.value ?? null,
            value: input.action === "save-vote" ? input.input.value : null,
            evidence: record
                ? {
                      playDataId: record.id,
                      score: record.score,
                      fcType: record.fc_type,
                      gradeRecital: record.grade_recital,
                  }
                : {},
        },
    });
    await updateVoteReview(transaction, chartId, mode, goal);
    return { chartId };
}

export async function mutateChartCommunity(input: unknown, userId: number) {
    const parsed = communityMutationSchema.safeParse(input);
    if (!parsed.success) throw new ApiError("invalid_contribution", "invalid");
    // 동시 수정에서도 한 사람의 투표와 감사 전후 값을 한 트랜잭션으로 유지함.
    for (let attempt = 0; attempt < 3; attempt++) {
        try {
            return await db.$transaction(
                (transaction) =>
                    executeMutation(transaction, parsed.data, userId),
                {
                    isolationLevel:
                        Prisma.TransactionIsolationLevel.Serializable,
                }
            );
        } catch (error) {
            if (
                !(error instanceof Prisma.PrismaClientKnownRequestError) ||
                error.code !== "P2034" ||
                attempt === 2
            )
                throw error;
        }
    }
    throw new Error("Community transaction did not complete.");
}
