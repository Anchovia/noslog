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

type ReplyMutation = Extract<
    CommunityMutation,
    { action: "reply-save" | "reply-delete" | "reply-like" }
>;

// 답글(2026-09-22 R1) — 의견과 같은 자격(그 채보 기록이 있어야 쓰기 · 좋아요), 한 단계만
async function executeReplyMutation(
    transaction: Prisma.TransactionClient,
    input: ReplyMutation,
    userId: number
) {
    const hasRecord = async (chartId: number) =>
        Boolean(
            await transaction.playData.findFirst({
                where: { chart_id: chartId, user_id: userId, score: { gt: 0 } },
                select: { id: true },
            })
        );

    if (input.action === "reply-save") {
        // 답글은 보이는 의견(또는 지운 의견 자리)에만 — 제외 · 숨김 의견에는 달 수 없다
        const opinion = await transaction.communityChartEvaluation.findFirst({
            where: {
                id: input.evaluationId,
                chartId: input.chartId,
                excluded: false,
                opinionHidden: false,
            },
            select: { id: true, opinion: true },
        });
        if (!opinion) throw new ApiError("opinion_unavailable", "unavailable");
        if (!(await hasRecord(input.chartId)))
            throw new ApiError("chart_record_required", "ineligible");
        if (input.replyId !== undefined) {
            const updated = await transaction.communityOpinionReply.updateMany({
                where: {
                    id: input.replyId,
                    evaluationId: opinion.id,
                    userId,
                    hidden: false,
                },
                data: { body: input.body, translations: Prisma.DbNull },
            });
            if (!updated.count)
                throw new ApiError("reply_unavailable", "unavailable");
            return {
                chartId: input.chartId,
                evaluationId: opinion.id,
                translate: { kind: "reply" as const, id: input.replyId },
            };
        }
        // 지운 의견 자리에는 새 답글을 받지 않는다 — 남은 대화만 보인다
        if (opinion.opinion === null)
            throw new ApiError("opinion_unavailable", "unavailable");
        const created = await transaction.communityOpinionReply.create({
            data: { evaluationId: opinion.id, userId, body: input.body },
            select: { id: true },
        });
        return {
            chartId: input.chartId,
            evaluationId: opinion.id,
            translate: { kind: "reply" as const, id: created.id },
        };
    }

    const reply = await transaction.communityOpinionReply.findFirst({
        where: {
            id: input.replyId,
            hidden: false,
            evaluation: { chartId: input.chartId, excluded: false },
        },
        select: { id: true, userId: true, evaluationId: true },
    });
    if (!reply) throw new ApiError("reply_unavailable", "unavailable");

    if (input.action === "reply-delete") {
        if (reply.userId !== userId)
            throw new ApiError("reply_unavailable", "unavailable");
        // 신고 기록은 남기되 답글과의 연결만 끊는다(의견 삭제와 같은 방식)
        await transaction.communityOpinionReport.updateMany({
            where: { replyId: reply.id },
            data: { replyId: null },
        });
        await transaction.communityOpinionReply.delete({
            where: { id: reply.id },
        });
        return { chartId: input.chartId, evaluationId: reply.evaluationId };
    }

    // reply-like — 내 답글에는 누를 수 없다
    if (reply.userId === userId)
        throw new ApiError("reply_unavailable", "unavailable");
    if (!(await hasRecord(input.chartId)))
        throw new ApiError("chart_record_required", "ineligible");
    if (input.selected)
        await transaction.communityOpinionReplyLike.upsert({
            where: { replyId_userId: { replyId: reply.id, userId } },
            create: { replyId: reply.id, userId },
            update: {},
        });
    else
        await transaction.communityOpinionReplyLike.deleteMany({
            where: { replyId: reply.id, userId },
        });
    return {
        chartId: input.chartId,
        evaluationId: reply.evaluationId,
        likeCount: await transaction.communityOpinionReplyLike.count({
            where: { replyId: reply.id },
        }),
        selected: input.selected,
    };
}

async function executeMutation(
    transaction: Prisma.TransactionClient,
    input: CommunityMutation,
    userId: number
) {
    if (input.action === "report" && input.input.replyId !== undefined) {
        const { replyId, reason, explanation } = input.input;
        const reply = await transaction.communityOpinionReply.findFirst({
            where: {
                id: replyId,
                hidden: false,
                userId: { not: userId },
                evaluation: { excluded: false },
            },
            select: {
                userId: true,
                body: true,
                evaluation: { select: { chartId: true } },
            },
        });
        if (!reply) throw new ApiError("reply_unavailable", "unavailable");
        await transaction.communityOpinionReport.upsert({
            where: { replyId_userId: { replyId, userId } },
            create: {
                replyId,
                userId,
                reason,
                explanation,
                authorId: reply.userId,
                opinionSnapshot: reply.body,
            },
            update: {},
        });
        return { chartId: reply.evaluation.chartId };
    }
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
        const { reason, explanation } = input.input;
        const evaluationId = opinion.id;
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

    if (
        input.action === "reply-save" ||
        input.action === "reply-delete" ||
        input.action === "reply-like"
    )
        return executeReplyMutation(transaction, input, userId);

    const chartId = "input" in input ? input.input.chartId : input.chartId;
    const chart = await transaction.musicChart.findUnique({
        where: { id: chartId },
        select: { id: true },
    });
    if (!chart) throw new ApiError("chart_unavailable", "unavailable");

    if (input.action === "delete-evaluation") {
        // 남의 답글이 달린 의견은 행을 지우면 답글까지 사라진다 — 평가 · 의견만 비우고 행은 남긴다(2026-09-22)
        const withReplies =
            await transaction.communityChartEvaluation.findFirst({
                where: { chartId, userId, replies: { some: {} } },
                select: { id: true },
            });
        if (withReplies) {
            await detachDeletedOpinion(transaction, withReplies.id);
            await transaction.communityChartEvaluation.update({
                where: { id: withReplies.id },
                data: {
                    stairs: null,
                    repetition: null,
                    polyrhythm: null,
                    offset: null,
                    chords: null,
                    opinion: null,
                    opinionUpdatedAt: null,
                    opinionCreatedAt: null,
                    opinionTranslations: Prisma.DbNull,
                },
            });
            return { chartId };
        }
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
                opinionTranslations: Prisma.DbNull,
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
            // 글이 바뀌면 전에 만든 번역은 맞지 않는다(2026-09-22)
            ...(previous?.opinion === opinion
                ? {}
                : { opinionTranslations: Prisma.DbNull }),
        };
        const saved = await transaction.communityChartEvaluation.upsert({
            where: { chartId_userId: { chartId, userId } },
            create: { chartId, userId, ...values },
            update: values,
            select: { id: true },
        });
        // 글이 새로 쓰였거나 바뀌었으면 응답 뒤 번역해 둔다(2026-09-22 — 올릴 때 한 번)
        return opinion && previous?.opinion !== opinion
            ? {
                  chartId,
                  translate: { kind: "opinion" as const, id: saved.id },
              }
            : { chartId };
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
