import "server-only";

import type { NameLabel } from "@/features/contributions/contribution-level";
import { CONTRIBUTION_POINTS } from "@/features/contributions/contribution-level";
import {
    CHART_COMMENT_DAILY_LIMIT,
    chartCommentInputSchema,
    chartCommentListQuerySchema,
    chartRowIdSchema,
} from "@/features/contributions/schemas/chart-draft-schema";
import { logDraftError } from "@/features/contributions/server/chart-draft-service";
import {
    awardContribution,
    getNameLabels,
} from "@/features/contributions/server/contribution-point-service";
import type { ActionResult } from "@/lib/actions/result";
import { requireAdmin } from "@/lib/admin";
import { isWithinDailyLimit } from "@/lib/daily-limit";
import db from "@/lib/db";
import { translatorFor } from "@/lib/i18n/messages";
import getSession from "@/lib/session";
import { claimUploadTokenQuota } from "@/lib/upload-rate-limit";
import { getSessionUser } from "@/lib/user";

async function isAdminUser() {
    const { user } = await getSessionUser();
    return user?.role === "admin";
}

export interface ChartCommentItem {
    id: number;
    timeMs: number;
    /** problem | suggestion | praise (2026-10-01 H2) */
    kind: string;
    body: string;
    resolved: boolean;
    createdAt: string;
    own: boolean;
    user: { id: number; username: string | null; label: NameLabel | null };
}

/**
 * 시각 댓글 목록 — draftId 가 있으면 그 초안의 작성자와 운영자만, 없으면 공개 채보 댓글(누구나).
 * 운영자가 가린 댓글은 빠진다. 시각 순.
 */
export async function listChartComments(
    input: unknown
): Promise<ChartCommentItem[] | null> {
    const parsed = chartCommentListQuerySchema.safeParse(input);
    if (!parsed.success) return null;
    const query = parsed.data;
    const session = await getSession();
    if (query.draftId) {
        if (!session.id) return null;
        const draft = await db.chartDraft.findUnique({
            where: { id: query.draftId },
            select: { userId: true, chartId: true },
        });
        if (
            !draft ||
            draft.chartId !== query.chartId ||
            (draft.userId !== session.id && !(await isAdminUser()))
        )
            return null;
    }
    const rows = await db.chartComment.findMany({
        where: {
            chartId: query.chartId,
            draftId: query.draftId ?? null,
            hidden: false,
        },
        orderBy: [{ timeMs: "asc" }, { id: "asc" }],
        take: 300,
        select: {
            id: true,
            timeMs: true,
            kind: true,
            body: true,
            resolved: true,
            createdAt: true,
            user: { select: { id: true, username: true } },
        },
    });
    const labels = await getNameLabels(rows.map((row) => row.user.id));
    return rows.map((row) => ({
        id: row.id,
        timeMs: row.timeMs,
        kind: row.kind,
        body: row.body,
        resolved: row.resolved,
        createdAt: row.createdAt.toISOString(),
        own: row.user.id === session.id,
        user: { ...row.user, label: labels.get(row.user.id) ?? null },
    }));
}

/** 시각 댓글 쓰기 — 초안 댓글은 작성자 · 운영자만, 공개 채보 댓글은 로그인한 누구나(하루 한도) */
export async function addChartComment(
    input: unknown,
    requestedLocale: string
): Promise<ActionResult> {
    const t = translatorFor(requestedLocale);
    const session = await getSession();
    if (!session.id)
        return { success: false, message: t("contribution.loginRequired") };
    const parsed = chartCommentInputSchema.safeParse(input);
    if (!parsed.success)
        return { success: false, message: t("contribution.comment.invalid") };
    const { chartId, draftId, timeMs, body, kind } = parsed.data;
    try {
        if (draftId) {
            const draft = await db.chartDraft.findUnique({
                where: { id: draftId },
                select: { userId: true, chartId: true },
            });
            if (
                !draft ||
                draft.chartId !== chartId ||
                (draft.userId !== session.id && !(await isAdminUser()))
            )
                return {
                    success: false,
                    message: t("contribution.comment.invalid"),
                };
            const quota = await claimUploadTokenQuota(
                session.id,
                "draft-comment"
            );
            if (!quota.allowed)
                return { success: false, message: t("common.tooManyRequests") };
        } else {
            const pattern = await db.chartPattern.findUnique({
                where: { chartId },
                select: { publishedRevision: true },
            });
            if (!pattern?.publishedRevision)
                return {
                    success: false,
                    message: t("contribution.comment.invalid"),
                };
        }
        const data = {
            chartId,
            draftId: draftId ?? null,
            userId: session.id,
            timeMs,
            kind,
            body,
        };
        if (draftId) {
            await db.chartComment.create({ data });
        } else {
            // 하루 한도는 공개 채보 의견만 센다 — 초안 검토 댓글은 한도와 따로다.
            // 세기와 넣기 사이를 사람마다 잠가 동시에 보낸 요청이 한도를 넘지 않게 한다
            const added = await db.$transaction(async (tx) => {
                const within = await isWithinDailyLimit(tx, {
                    lockKey: `chart-comment-daily:${data.userId}`,
                    limit: CHART_COMMENT_DAILY_LIMIT,
                    countRecent: (since) =>
                        tx.chartComment.count({
                            where: {
                                userId: data.userId,
                                draftId: null,
                                createdAt: { gte: since },
                            },
                        }),
                });
                if (!within) return false;
                await tx.chartComment.create({ data });
                return true;
            });
            if (!added)
                return {
                    success: false,
                    message: t("contribution.comment.dailyLimit"),
                };
        }
        return { success: true, message: t("contribution.comment.added") };
    } catch (error) {
        logDraftError(
            error,
            "contribution.comment.add.failed",
            "/music/pattern"
        );
        return { success: false, message: t("contribution.submitError") };
    }
}

/** 내 댓글 지우기 — 해결되기 전까지만 */
export async function deleteMyChartComment(
    commentId: number,
    requestedLocale: string
): Promise<ActionResult> {
    const t = translatorFor(requestedLocale);
    const session = await getSession();
    if (!session.id)
        return { success: false, message: t("contribution.loginRequired") };
    if (!chartRowIdSchema.safeParse(commentId).success)
        return { success: false, message: t("contribution.submitError") };
    const deleted = await db.chartComment.deleteMany({
        where: { id: commentId, userId: session.id, resolved: false },
    });
    return deleted.count
        ? { success: true, message: t("contribution.comment.deleted") }
        : { success: false, message: t("contribution.submitError") };
}

/** 댓글 「해결」 — 운영자만. 공개 채보 댓글을 운영자가 아닌 사람이 썼으면 기여 1점 */
export async function resolveChartComment(
    commentId: number
): Promise<ActionResult> {
    const admin = await requireAdmin();
    if (!chartRowIdSchema.safeParse(commentId).success)
        return { success: false, message: "댓글을 찾을 수 없습니다." };
    const comment = await db.chartComment.findUnique({
        where: { id: commentId },
        select: {
            id: true,
            resolved: true,
            draftId: true,
            userId: true,
            user: { select: { role: true } },
        },
    });
    if (!comment || comment.resolved)
        return { success: false, message: "해결할 댓글이 아닙니다." };
    await db.chartComment.update({
        where: { id: comment.id },
        data: {
            resolved: true,
            resolvedAt: new Date(),
            resolvedById: admin.id,
        },
    });
    if (comment.draftId === null && comment.user.role !== "admin") {
        await awardContribution({
            userId: comment.userId,
            kind: "chart_comment",
            sourceKey: String(comment.id),
            points: CONTRIBUTION_POINTS.chart_comment,
        });
    }
    return { success: true, message: "해결로 표시했습니다." };
}

/** 댓글 가리기 — 운영자만(장난 · 신고 대응). 목록에서 빠진다 */
export async function hideChartComment(
    commentId: number
): Promise<ActionResult> {
    await requireAdmin();
    if (!chartRowIdSchema.safeParse(commentId).success)
        return { success: false, message: "댓글을 찾을 수 없습니다." };
    const updated = await db.chartComment.updateMany({
        where: { id: commentId },
        data: { hidden: true },
    });
    return updated.count
        ? { success: true, message: "댓글을 가렸습니다." }
        : { success: false, message: "댓글을 찾을 수 없습니다." };
}
