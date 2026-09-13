import { revalidatePath } from "next/cache";

import {
    feedbackStatusUpdateInputFromFormData,
    feedbackStatusUpdateSchema,
    type FeedbackStatus,
} from "@/features/feedback/schemas/feedbackAdminSchema";
import type { AdminFeedbackReport } from "@/features/feedback/types/feedbackAdmin";
import type { ActionResult } from "@/lib/actions/result";
import { requireAdmin } from "@/lib/admin";
import db from "@/lib/db";
import { logServerError } from "@/lib/observability/server";

type FeedbackStatusUpdateResult = ActionResult<{ status: FeedbackStatus }>;

// 오락실 제보 종류 — 관리자 화면은 한국어라 공개 카탈로그(arcades.reportType.*)의 ko 문구를 옮겨 쓴다
const ARCADE_REPORT_TYPE_LABELS: Record<string, string> = {
    unavailable: "기체 고장·이용 불가",
    condition: "기체 상태·입력 문제",
    count: "기체 수 변경",
    price: "요금 변경",
    hours: "영업시간 변경",
    address: "위치·주소 변경",
    other: "기타 정보",
};

function refreshFeedbackAdmin() {
    revalidatePath("/admin");
    revalidatePath("/admin/feedback");
}

function logFeedbackAdminError(
    error: unknown,
    event: string,
    routeType = "action"
) {
    logServerError(error, {
        event,
        routePath: "/admin/feedback",
        routeType,
    });
}

export async function listFeedbackReports(
    status: FeedbackStatus
): Promise<AdminFeedbackReport[]> {
    await requireAdmin();

    try {
        const reports = await db.feedbackReport.findMany({
            where: { status },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        nostalgia_name: true,
                    },
                },
                arcade: {
                    select: {
                        id: true,
                        name: true,
                        publicDetails: { select: { slug: true } },
                    },
                },
                cabinet: { select: { label: true, position: true } },
            },
            orderBy: { createdAt: "desc" },
            take: 100,
        });

        return reports.map((report) => ({
            id: report.id,
            content: report.content,
            createdAt: report.createdAt.toISOString(),
            hasImage: Boolean(report.imageUrl),
            status,
            user: {
                id: report.user.id,
                name:
                    report.user.username ??
                    report.user.nostalgia_name ??
                    `유저 ${report.user.id}`,
            },
            // 어느 오락실·기체의 무슨 제보인지 — 처리 완료로 바꾸면 공개 기체 줄의 「고장 신고 N」 이 줄어든다
            arcade: report.arcade
                ? {
                      name: report.arcade.name,
                      href: `/gamecenter/${report.arcade.publicDetails?.slug ?? report.arcade.id}`,
                      cabinet: report.cabinet
                          ? (report.cabinet.label ??
                            `${report.cabinet.position + 1}번기`)
                          : null,
                      type: report.arcadeReportType
                          ? (ARCADE_REPORT_TYPE_LABELS[
                                report.arcadeReportType
                            ] ?? report.arcadeReportType)
                          : null,
                  }
                : null,
        }));
    } catch (error) {
        logFeedbackAdminError(error, "admin.feedback.list.failed", "page");
        throw error;
    }
}

export async function updateFeedbackStatus(
    formData: FormData
): Promise<FeedbackStatusUpdateResult> {
    await requireAdmin();
    const result = feedbackStatusUpdateSchema.safeParse(
        feedbackStatusUpdateInputFromFormData(formData)
    );
    if (!result.success) {
        return {
            success: false,
            message:
                result.error.issues[0]?.message ??
                "피드백 처리 요청을 확인해주세요.",
        };
    }
    const input = result.data;

    try {
        const feedback = await db.feedbackReport.findUnique({
            where: { id: input.feedbackId },
            select: { id: true, status: true },
        });
        if (!feedback) {
            return {
                success: false,
                message: "피드백을 찾을 수 없습니다.",
            };
        }
        if (feedback.status === input.status) {
            return {
                success: false,
                message:
                    input.status === "resolved"
                        ? "이미 처리 완료된 피드백입니다."
                        : "이미 접수 상태인 피드백입니다.",
            };
        }

        await db.feedbackReport.update({
            where: { id: feedback.id },
            data: {
                status: input.status,
                resolvedAt: input.status === "resolved" ? new Date() : null,
            },
        });
    } catch (error) {
        logFeedbackAdminError(error, "admin.feedback.status-update.failed");
        return {
            success: false,
            message: "피드백 상태를 변경하지 못했습니다.",
        };
    }

    refreshFeedbackAdmin();
    return {
        success: true,
        message:
            input.status === "resolved"
                ? "피드백을 처리 완료했습니다."
                : "피드백을 다시 열었습니다.",
        status: input.status,
    };
}
