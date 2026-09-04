import { revalidatePath, updateTag } from "next/cache";

import {
    chartEvaluationAdminDeleteInputFromFormData,
    chartEvaluationAdminDeleteSchema,
} from "@/features/music/schemas/chartEvaluationAdminSchema";
import type { AdminChartEvaluation } from "@/features/music/types/chartEvaluationAdmin";
import type { ActionResult } from "@/lib/actions/result";
import { requireAdmin } from "@/lib/admin";
import { CACHE_TAGS } from "@/lib/cacheTags";
import db from "@/lib/db";
import { logServerError } from "@/lib/observability/server";

function logChartEvaluationAdminError(
    error: unknown,
    event: string,
    routeType = "action"
) {
    logServerError(error, {
        event,
        routePath: "/admin/community",
        routeType,
    });
}

export async function listAdminChartEvaluations(): Promise<
    AdminChartEvaluation[]
> {
    await requireAdmin();

    try {
        const evaluations = await db.chartEvaluation.findMany({
            include: {
                user: {
                    select: { id: true, username: true, nostalgia_name: true },
                },
                chart: {
                    select: {
                        difficulty: true,
                        music: { select: { title: true } },
                    },
                },
                reactions: { select: { value: true } },
            },
            orderBy: { updated_at: "desc" },
            take: 100,
        });

        return evaluations.map((evaluation) => ({
            id: evaluation.id,
            chart: {
                difficulty: evaluation.chart.difficulty,
                musicTitle: evaluation.chart.music.title,
            },
            comment: evaluation.comment,
            patterns: {
                stairs: evaluation.stairs,
                repetition: evaluation.repetition,
                chord: evaluation.chord,
                trill: evaluation.trill,
                glissando: evaluation.glissando,
            },
            perceivedConstant: evaluation.perceived_constant,
            reactions: {
                up: evaluation.reactions.filter(({ value }) => value > 0)
                    .length,
                down: evaluation.reactions.filter(({ value }) => value < 0)
                    .length,
            },
            userName:
                evaluation.user.nostalgia_name ??
                evaluation.user.username ??
                `유저 ${evaluation.user.id}`,
        }));
    } catch (error) {
        logChartEvaluationAdminError(
            error,
            "admin.chart-evaluation.list.failed",
            "page"
        );
        throw error;
    }
}

export async function deleteAdminChartEvaluation(
    formData: FormData
): Promise<ActionResult> {
    await requireAdmin();
    const result = chartEvaluationAdminDeleteSchema.safeParse(
        chartEvaluationAdminDeleteInputFromFormData(formData)
    );
    if (!result.success) {
        return {
            success: false,
            message:
                result.error.issues[0]?.message ??
                "평가 삭제 요청을 확인해주세요.",
        };
    }

    try {
        const evaluation = await db.chartEvaluation.findUnique({
            where: { id: result.data.evaluationId },
            select: { id: true },
        });
        if (!evaluation) {
            return { success: false, message: "평가를 찾을 수 없습니다." };
        }

        await db.chartEvaluation.delete({ where: { id: evaluation.id } });
    } catch (error) {
        logChartEvaluationAdminError(
            error,
            "admin.chart-evaluation.delete.failed"
        );
        return { success: false, message: "평가를 삭제하지 못했습니다." };
    }

    updateTag(CACHE_TAGS.chartEvaluations);
    revalidatePath("/admin/community");
    return { success: true, message: "평가를 삭제했습니다." };
}
