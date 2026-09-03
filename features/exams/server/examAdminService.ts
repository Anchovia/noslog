import { revalidatePath, updateTag } from "next/cache";

import {
    examDeleteSchema,
    examEditorSchema,
    examMusicSearchSchema,
    type ExamEditorFieldName,
    type ExamEditorFormValues,
} from "@/features/exams/schemas/examEditorSchema";
import type { ActionFieldErrors, ActionResult } from "@/lib/actions/result";
import { requireAdmin } from "@/lib/admin";
import { CACHE_TAGS } from "@/lib/cacheTags";
import db from "@/lib/db";
import { logServerError } from "@/lib/observability/server";

type ExamActionResult = ActionResult<{ id: number }, ExamEditorFieldName>;
type ExamDeleteActionResult = ActionResult;

interface StageSignatureInput {
    allowedChartIds: number[];
    label: string | null;
    musicIndex: string;
    position: number;
    requiredValue: number;
    requirementType: string;
}

function getStageSignature(stages: StageSignatureInput[]) {
    return JSON.stringify(
        stages
            .map((stage) => ({
                musicIndex: stage.musicIndex,
                position: stage.position,
                label: stage.label,
                requirementType: stage.requirementType,
                requiredValue: stage.requiredValue,
                allowedChartIds: [...stage.allowedChartIds].sort(
                    (first, second) => first - second
                ),
            }))
            .sort((first, second) => first.position - second.position)
    );
}

function examFieldErrors(
    issues: ReadonlyArray<{ path: PropertyKey[]; message: string }>
) {
    const fieldErrors: ActionFieldErrors<ExamEditorFieldName> = {};

    for (const issue of issues) {
        if (issue.path[0] === "id") continue;
        const field = issue.path.join(".") as ExamEditorFieldName;
        fieldErrors[field] ??= [];
        fieldErrors[field]?.push(issue.message);
    }

    return fieldErrors;
}

function invalidExamResult(
    issues: ReadonlyArray<{ path: PropertyKey[]; message: string }>
): ExamActionResult {
    const fieldErrors = examFieldErrors(issues);

    return {
        success: false,
        message: issues[0]?.message ?? "검정 입력을 확인해주세요.",
        ...(Object.keys(fieldErrors).length > 0 ? { fieldErrors } : {}),
    };
}

function refreshExams(examId?: number) {
    updateTag(CACHE_TAGS.exams);
    revalidatePath("/admin");
    revalidatePath("/admin/exams");
    if (examId !== undefined) revalidatePath(`/admin/exams/${examId}`);
    revalidatePath("/exams");
}

function logExamActionError(error: unknown, event: string) {
    logServerError(error, {
        event,
        routePath: "/admin/exams",
        routeType: "action",
    });
}

export async function searchAdminMusic(query: string) {
    await requireAdmin();
    const result = examMusicSearchSchema.safeParse({ query });
    if (!result.success || !result.data.query) return [];

    try {
        const musics = await db.music.findMany({
            where: {
                OR: [
                    {
                        title: {
                            contains: result.data.query,
                            mode: "insensitive",
                        },
                    },
                    {
                        artist: {
                            contains: result.data.query,
                            mode: "insensitive",
                        },
                    },
                ],
            },
            select: {
                index: true,
                title: true,
                artist: true,
                charts: {
                    select: { id: true, difficulty: true, level: true },
                    orderBy: { level: "asc" },
                },
            },
            orderBy: { title: "asc" },
            take: 20,
        });

        return musics.map((music) => ({
            musicIndex: music.index,
            title: music.title,
            artist: music.artist,
            charts: music.charts.map((chart) => ({
                chartId: chart.id,
                difficulty: chart.difficulty,
                level: chart.level,
            })),
        }));
    } catch (error) {
        logExamActionError(error, "admin.exam.music-search.failed");
        throw error;
    }
}

export async function getExamEditorData(
    examId: number
): Promise<ExamEditorFormValues | null> {
    await requireAdmin();

    try {
        const exam = await db.exam.findUnique({
            where: { id: examId },
            select: {
                id: true,
                slug: true,
                mode: true,
                scoringType: true,
                grade: true,
                shortLabel: true,
                title: true,
                description: true,
                feeNos: true,
                requiredGrade: true,
                status: true,
                rewards: {
                    select: {
                        id: true,
                        type: true,
                        label: true,
                        musicIndex: true,
                        music: { select: { title: true } },
                    },
                    orderBy: { position: "asc" },
                },
                stages: {
                    select: {
                        id: true,
                        label: true,
                        requirementType: true,
                        requiredValue: true,
                        music: {
                            select: {
                                index: true,
                                title: true,
                                artist: true,
                                charts: {
                                    select: {
                                        id: true,
                                        difficulty: true,
                                        level: true,
                                    },
                                    orderBy: { level: "asc" },
                                },
                            },
                        },
                        allowedCharts: { select: { chartId: true } },
                    },
                    orderBy: { position: "asc" },
                },
            },
        });
        if (!exam) return null;

        return {
            id: exam.id,
            slug: exam.slug,
            mode: exam.mode as ExamEditorFormValues["mode"],
            scoringType:
                exam.scoringType as ExamEditorFormValues["scoringType"],
            grade: exam.grade,
            shortLabel: exam.shortLabel,
            title: exam.title,
            description: exam.description ?? "",
            feeNos: exam.feeNos,
            requiredGrade: exam.requiredGrade,
            status: exam.status as ExamEditorFormValues["status"],
            rewards: exam.rewards.map((reward) => ({
                id: reward.id,
                type: reward.type as ExamEditorFormValues["rewards"][number]["type"],
                label: reward.label ?? reward.music?.title ?? "",
                musicIndex: reward.musicIndex,
            })),
            stages: exam.stages.map((stage) => ({
                id: stage.id,
                musicIndex: stage.music.index,
                title: stage.music.title,
                artist: stage.music.artist,
                charts: stage.music.charts.map((chart) => ({
                    chartId: chart.id,
                    difficulty: chart.difficulty,
                    level: chart.level,
                })),
                allowedChartIds: stage.allowedCharts.map(
                    (item) => item.chartId
                ),
                label: stage.label ?? "",
                requirementType:
                    stage.requirementType as ExamEditorFormValues["stages"][number]["requirementType"],
                requiredValue: stage.requiredValue,
            })),
        };
    } catch (error) {
        logExamActionError(error, "admin.exam.read.failed");
        throw error;
    }
}

export async function saveExam(input: unknown): Promise<ExamActionResult> {
    await requireAdmin();
    const result = examEditorSchema.safeParse(input);
    if (!result.success) return invalidExamResult(result.error.issues);
    const data = result.data;

    try {
        const duplicate = await db.exam.findFirst({
            where: {
                slug: data.slug,
                ...(data.id ? { NOT: { id: data.id } } : {}),
            },
            select: { id: true },
        });
        if (duplicate) {
            const message = "이미 사용 중인 식별자입니다.";
            return {
                success: false,
                message,
                fieldErrors: { slug: [message] },
            };
        }

        if (data.mode !== "event" && data.grade !== null) {
            const duplicateGrade = await db.exam.findFirst({
                where: {
                    mode: data.mode,
                    grade: data.grade,
                    ...(data.id ? { NOT: { id: data.id } } : {}),
                },
                select: { id: true },
            });
            if (duplicateGrade) {
                const message = "같은 모드의 급수가 이미 등록되어 있습니다.";
                return {
                    success: false,
                    message,
                    fieldErrors: { grade: [message] },
                };
            }
        }

        const chartIds = [
            ...new Set(data.stages.flatMap((stage) => stage.allowedChartIds)),
        ];
        const charts = await db.musicChart.findMany({
            where: { id: { in: chartIds } },
            select: { id: true, music_idx: true },
        });
        const chartMusic = new Map(
            charts.map((chart) => [chart.id, chart.music_idx])
        );
        const invalidStage = data.stages.find((stage) =>
            stage.allowedChartIds.some(
                (chartId) => chartMusic.get(chartId) !== stage.musicIndex
            )
        );
        if (charts.length !== chartIds.length || invalidStage) {
            const message = "과제곡의 허용 난이도를 다시 선택해주세요.";
            return {
                success: false,
                message,
                fieldErrors: { stages: [message] },
            };
        }

        const rewardMusicIndexes = data.rewards
            .map((reward) => reward.musicIndex)
            .filter((value): value is string => Boolean(value));
        if (rewardMusicIndexes.length > 0) {
            const rewardMusicCount = await db.music.count({
                where: { index: { in: rewardMusicIndexes } },
            });
            if (rewardMusicCount !== new Set(rewardMusicIndexes).size) {
                const message = "보상 악곡을 다시 선택해주세요.";
                return {
                    success: false,
                    message,
                    fieldErrors: { rewards: [message] },
                };
            }
        }

        let replaceStages = true;
        if (data.id) {
            const current = await db.exam.findUnique({
                where: { id: data.id },
                select: {
                    mode: true,
                    scoringType: true,
                    stages: {
                        select: {
                            musicIndex: true,
                            position: true,
                            label: true,
                            requirementType: true,
                            requiredValue: true,
                            allowedCharts: { select: { chartId: true } },
                        },
                        orderBy: { position: "asc" },
                    },
                    _count: {
                        select: { submissions: true, achievements: true },
                    },
                },
            });
            if (!current) {
                return {
                    success: false,
                    message: "검정을 찾을 수 없습니다.",
                };
            }

            replaceStages =
                getStageSignature(
                    current.stages.map((stage) => ({
                        musicIndex: stage.musicIndex,
                        position: stage.position,
                        allowedChartIds: stage.allowedCharts.map(
                            (item) => item.chartId
                        ),
                        label: stage.label,
                        requirementType: stage.requirementType,
                        requiredValue: stage.requiredValue,
                    }))
                ) !==
                getStageSignature(
                    data.stages.map((stage, index) => ({
                        musicIndex: stage.musicIndex,
                        position: index + 1,
                        allowedChartIds: stage.allowedChartIds,
                        label: stage.label || null,
                        requirementType: stage.requirementType,
                        requiredValue: stage.requiredValue,
                    }))
                );
            const hasHistory =
                current._count.submissions > 0 ||
                current._count.achievements > 0;
            const scoringChanged =
                current.mode !== data.mode ||
                current.scoringType !== data.scoringType;
            if (hasHistory && (replaceStages || scoringChanged)) {
                return {
                    success: false,
                    message:
                        "인증 이력이 있는 검정의 모드, 채점 방식과 과제곡은 수정할 수 없습니다.",
                };
            }
        }

        const exam = await db.$transaction(async (transaction) => {
            const examData = {
                slug: data.slug,
                mode: data.mode,
                scoringType: data.scoringType,
                grade: data.mode === "event" ? null : data.grade,
                shortLabel: data.shortLabel,
                title: data.title,
                description: data.description || null,
                feeNos: data.feeNos,
                requiredGrade: data.requiredGrade,
                status: data.status,
            };

            const examId = data.id
                ? (
                      await transaction.exam.update({
                          where: { id: data.id },
                          data: examData,
                          select: { id: true },
                      })
                  ).id
                : (
                      await transaction.exam.create({
                          data: examData,
                          select: { id: true },
                      })
                  ).id;

            if (replaceStages) {
                await transaction.examStage.deleteMany({ where: { examId } });
                for (const [index, stage] of data.stages.entries()) {
                    await transaction.examStage.create({
                        data: {
                            examId,
                            musicIndex: stage.musicIndex,
                            position: index + 1,
                            label: stage.label || null,
                            requirementType: stage.requirementType,
                            requiredValue: stage.requiredValue,
                            allowedCharts: {
                                create: stage.allowedChartIds.map(
                                    (chartId) => ({ chartId })
                                ),
                            },
                        },
                    });
                }
            }

            await transaction.examReward.deleteMany({ where: { examId } });
            if (data.rewards.length > 0) {
                await transaction.examReward.createMany({
                    data: data.rewards.map((reward, index) => ({
                        examId,
                        position: index + 1,
                        type: reward.type,
                        label: reward.label,
                        musicIndex: reward.musicIndex || null,
                    })),
                });
            }
            return { id: examId };
        });

        refreshExams(exam.id);
        return {
            success: true,
            message: data.id ? "검정을 저장했습니다." : "검정을 추가했습니다.",
            id: exam.id,
        };
    } catch (error) {
        logExamActionError(error, "admin.exam.save.failed");
        return { success: false, message: "검정을 저장하지 못했습니다." };
    }
}

export async function deleteExam(
    examId: number
): Promise<ExamDeleteActionResult> {
    await requireAdmin();
    const result = examDeleteSchema.safeParse({ id: examId });
    if (!result.success) {
        return {
            success: false,
            message: result.error.issues[0]?.message ?? "잘못된 검정입니다.",
        };
    }

    try {
        const exam = await db.exam.findUnique({
            where: { id: result.data.id },
            select: {
                _count: { select: { submissions: true, achievements: true } },
            },
        });
        if (!exam) {
            return { success: false, message: "검정을 찾을 수 없습니다." };
        }
        if (exam._count.submissions > 0 || exam._count.achievements > 0) {
            return {
                success: false,
                message: "인증 이력이 있는 검정은 삭제할 수 없습니다.",
            };
        }

        await db.exam.delete({ where: { id: result.data.id } });
        refreshExams();
        return { success: true, message: "검정을 삭제했습니다." };
    } catch (error) {
        logExamActionError(error, "admin.exam.delete.failed");
        return { success: false, message: "검정을 삭제하지 못했습니다." };
    }
}
