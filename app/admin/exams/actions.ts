"use server";

import { revalidatePath, updateTag } from "next/cache";

import { examEditorSchema } from "@/app/admin/exams/schema";
import { requireAdmin } from "@/lib/admin";
import { CACHE_TAGS } from "@/lib/cacheTags";
import db from "@/lib/db";

function getStageSignature(
    stages: {
        musicIndex: string;
        position: number;
        label: string | null;
        requirementType: string;
        requiredValue: number;
        allowedChartIds: number[];
    }[]
) {
    return JSON.stringify(
        stages
            .map((stage) => ({
                ...stage,
                allowedChartIds: [...stage.allowedChartIds].sort(
                    (a, b) => a - b
                ),
            }))
            .sort((a, b) => a.position - b.position)
    );
}

export async function searchAdminMusic(query: string) {
    await requireAdmin();
    const keyword = query.trim();
    if (!keyword) return [];

    const musics = await db.music.findMany({
        where: {
            OR: [
                { title: { contains: keyword } },
                { artist: { contains: keyword } },
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
}

export async function saveExam(input: unknown) {
    await requireAdmin();
    const result = examEditorSchema.safeParse(input);
    if (!result.success) {
        return {
            success: false as const,
            message:
                result.error.issues[0]?.message ?? "입력값을 확인해주세요.",
        };
    }

    const data = result.data;
    const duplicate = await db.exam.findFirst({
        where: {
            slug: data.slug,
            ...(data.id ? { NOT: { id: data.id } } : {}),
        },
        select: { id: true },
    });
    if (duplicate) {
        return {
            success: false as const,
            message: "이미 사용 중인 식별자입니다.",
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
            return {
                success: false as const,
                message: "같은 모드의 급수가 이미 등록되어 있습니다.",
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
        return {
            success: false as const,
            message: "과제곡의 허용 난이도를 다시 선택해주세요.",
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
            return {
                success: false as const,
                message: "보상 악곡을 다시 선택해주세요.",
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
                },
                _count: { select: { submissions: true, achievements: true } },
            },
        });
        if (!current)
            return {
                success: false as const,
                message: "검정을 찾을 수 없습니다.",
            };

        replaceStages =
            getStageSignature(
                current.stages.map((stage) => ({
                    ...stage,
                    allowedChartIds: stage.allowedCharts.map(
                        (item) => item.chartId
                    ),
                }))
            ) !== getStageSignature(data.stages);
        const hasHistory =
            current._count.submissions > 0 || current._count.achievements > 0;
        const scoringChanged =
            current.mode !== data.mode ||
            current.scoringType !== data.scoringType;
        if (hasHistory && (replaceStages || scoringChanged)) {
            return {
                success: false as const,
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
                            create: stage.allowedChartIds.map((chartId) => ({
                                chartId,
                            })),
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

    updateTag(CACHE_TAGS.exams);
    revalidatePath("/admin");
    revalidatePath("/admin/exams");
    revalidatePath("/exams");
    return { success: true as const, id: exam.id };
}

export async function deleteExam(examId: number) {
    await requireAdmin();
    if (!Number.isInteger(examId)) {
        return { success: false as const, message: "잘못된 검정입니다." };
    }
    const exam = await db.exam.findUnique({
        where: { id: examId },
        select: {
            _count: { select: { submissions: true, achievements: true } },
        },
    });
    if (!exam)
        return { success: false as const, message: "검정을 찾을 수 없습니다." };
    if (exam._count.submissions > 0 || exam._count.achievements > 0) {
        return {
            success: false as const,
            message: "인증 이력이 있는 검정은 삭제할 수 없습니다.",
        };
    }
    await db.exam.delete({ where: { id: examId } });
    updateTag(CACHE_TAGS.exams);
    revalidatePath("/admin");
    revalidatePath("/admin/exams");
    revalidatePath("/exams");
    return { success: true as const };
}
