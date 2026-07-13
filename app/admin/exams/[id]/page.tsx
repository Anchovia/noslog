import { notFound } from "next/navigation";

import ExamEditor, { type ExamEditorData } from "@/components/admin/examEditor";
import db from "@/lib/db";

export default async function EditExamPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const examId = Number(id);
    if (!Number.isInteger(examId)) notFound();

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
    if (!exam) notFound();

    const initialExam: ExamEditorData = {
        id: exam.id,
        slug: exam.slug,
        mode: exam.mode as ExamEditorData["mode"],
        scoringType: exam.scoringType as ExamEditorData["scoringType"],
        grade: exam.grade,
        shortLabel: exam.shortLabel,
        title: exam.title,
        description: exam.description ?? "",
        feeNos: exam.feeNos,
        requiredGrade: exam.requiredGrade,
        status: exam.status as ExamEditorData["status"],
        rewards: exam.rewards.map((reward) => ({
            id: reward.id,
            type: reward.type as ExamEditorData["rewards"][number]["type"],
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
            allowedChartIds: stage.allowedCharts.map((item) => item.chartId),
            label: stage.label ?? "",
            requirementType:
                stage.requirementType as ExamEditorData["stages"][number]["requirementType"],
            requiredValue: stage.requiredValue,
        })),
    };

    return <ExamEditor initialExam={initialExam} />;
}
