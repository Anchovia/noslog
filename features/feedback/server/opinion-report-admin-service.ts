import { revalidatePath, updateTag } from "next/cache";

import {
    opinionReportHiddenUpdateSchema,
    type OpinionReportStatus,
    opinionReportStatusUpdateInputFromFormData,
    opinionReportStatusUpdateSchema,
} from "@/features/feedback/schemas/opinion-report-admin-schema";
import type { AdminOpinionReport } from "@/features/feedback/types/opinion-report-admin";
import type { ActionResult } from "@/lib/actions/result";
import { actionValidationFailure } from "@/lib/actions/validation";
import { requireAdmin } from "@/lib/admin";
import { getChartEvaluationTag } from "@/lib/cache-tags";
import db from "@/lib/db";
import { logServerError } from "@/lib/observability/server";

type OpinionReportStatusUpdateResult = ActionResult<{
    status: OpinionReportStatus;
}>;

// 신고 사유 — 관리자 화면은 한국어라 공개 카탈로그(community.report.*)의 ko 문구를 옮겨 쓴다
const REASON_LABELS: Record<string, string> = {
    spam: "무관한 내용·스팸",
    abuse: "욕설·괴롭힘·혐오",
    sensitive: "민감·개인·위험 정보",
    other: "기타",
};

const userSelect = { id: true, username: true, nostalgiaName: true } as const;
const chartSelect = {
    chart: {
        select: {
            difficulty: true,
            musicIdx: true,
            music: { select: { title: true } },
        },
    },
} as const;

function userName(user: {
    id: number;
    username: string | null;
    nostalgiaName: string | null;
}) {
    return user.username ?? user.nostalgiaName ?? `유저 ${user.id}`;
}

export async function listOpinionReports(
    status: OpinionReportStatus
): Promise<AdminOpinionReport[]> {
    await requireAdmin();

    try {
        const reports = await db.communityOpinionReport.findMany({
            where: { status },
            include: {
                user: { select: userSelect },
                author: { select: userSelect },
                evaluation: { select: { opinionHidden: true, ...chartSelect } },
                reply: {
                    select: {
                        hidden: true,
                        evaluation: { select: chartSelect },
                    },
                },
            },
            orderBy: { createdAt: "desc" },
            take: 100,
        });

        return reports.map((report) => {
            const chart = (report.evaluation ?? report.reply?.evaluation)
                ?.chart;
            return {
                id: report.id,
                target: report.replyId === null ? "opinion" : "reply",
                reason: REASON_LABELS[report.reason] ?? report.reason,
                explanation: report.explanation,
                snapshot: report.opinionSnapshot,
                createdAt: report.createdAt.toISOString(),
                status,
                hidden:
                    report.reply?.hidden ??
                    report.evaluation?.opinionHidden ??
                    null,
                reporter: { id: report.user.id, name: userName(report.user) },
                author: { id: report.author.id, name: userName(report.author) },
                chart: chart
                    ? {
                          title: chart.music.title,
                          difficulty: chart.difficulty,
                          href: `/music/${encodeURIComponent(chart.musicIdx)}/${chart.difficulty.toLowerCase()}`,
                      }
                    : null,
            };
        });
    } catch (error) {
        logServerError(error, {
            event: "admin.opinion-report.list.failed",
            routePath: "/admin/feedback",
            routeType: "page",
        });
        throw error;
    }
}

export async function updateOpinionReportStatus(
    formData: FormData
): Promise<OpinionReportStatusUpdateResult> {
    await requireAdmin();
    const result = opinionReportStatusUpdateSchema.safeParse(
        opinionReportStatusUpdateInputFromFormData(formData)
    );
    if (!result.success) {
        return actionValidationFailure(result.error, {
            message: "신고 처리 요청을 확인해주세요.",
            preferFirstIssue: true,
            fieldPath: false,
        });
    }
    const input = result.data;

    try {
        const { count } = await db.communityOpinionReport.updateMany({
            where: { id: input.reportId, status: { not: input.status } },
            data: { status: input.status },
        });
        if (count === 0) {
            return {
                success: false,
                message:
                    input.status === "resolved"
                        ? "이미 처리 완료됐거나 없는 신고입니다."
                        : "이미 접수 상태이거나 없는 신고입니다.",
            };
        }
    } catch (error) {
        logServerError(error, {
            event: "admin.opinion-report.status-update.failed",
            routePath: "/admin/feedback",
            routeType: "action",
        });
        return { success: false, message: "신고 상태를 변경하지 못했습니다." };
    }

    revalidatePath("/admin/feedback");
    return {
        success: true,
        message:
            input.status === "resolved"
                ? "신고를 처리 완료했습니다."
                : "신고를 다시 열었습니다.",
        status: input.status,
    };
}

/** 신고된 의견 · 답글을 공개 목록에서 가리거나 되돌린다 */
export async function setOpinionReportTargetHidden(
    formData: FormData
): Promise<ActionResult> {
    await requireAdmin();
    const parsed = opinionReportHiddenUpdateSchema.safeParse({
        reportId: formData.get("reportId"),
        hidden: formData.get("hidden"),
    });
    if (!parsed.success)
        return { success: false, message: "신고 처리 요청을 확인해주세요." };
    const hidden = parsed.data.hidden === "true";

    try {
        const report = await db.communityOpinionReport.findUnique({
            where: { id: parsed.data.reportId },
            select: {
                replyId: true,
                evaluationId: true,
                evaluation: { select: { chartId: true } },
                reply: {
                    select: { evaluation: { select: { chartId: true } } },
                },
            },
        });
        const chartId =
            report?.reply?.evaluation.chartId ?? report?.evaluation?.chartId;
        if (!report || chartId === undefined)
            return { success: false, message: "작성자가 지운 글입니다." };
        if (report.replyId !== null) {
            await db.communityOpinionReply.update({
                where: { id: report.replyId },
                data: { hidden },
            });
        } else {
            await db.communityChartEvaluation.update({
                where: { id: report.evaluationId! },
                data: { opinionHidden: hidden },
            });
        }
        updateTag(getChartEvaluationTag(chartId));
    } catch (error) {
        logServerError(error, {
            event: "admin.opinion-report.hide.failed",
            routePath: "/admin/feedback",
            routeType: "action",
        });
        return { success: false, message: "글 상태를 변경하지 못했습니다." };
    }

    revalidatePath("/admin/feedback");
    return {
        success: true,
        message: hidden ? "글을 가렸습니다." : "글을 다시 보이게 했습니다.",
    };
}
