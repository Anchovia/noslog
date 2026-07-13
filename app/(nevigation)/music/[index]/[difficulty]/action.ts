"use server";

import db from "@/lib/db";
import getSession from "@/lib/session";
import { revalidatePath } from "next/cache";
import {
    chartEvaluationReactionSchema,
    chartEvaluationSchema,
    type ChartEvaluationInput,
    type ChartEvaluationReactionInput,
} from "./evaluationSchema";

interface EvaluationActionResult {
    success: boolean;
    message: string;
}

interface GetUserPlayDataProps {
    index: string;
    difficulty: string;
}

export async function getUserPlayData({
    index,
    difficulty,
}: GetUserPlayDataProps) {
    const session = await getSession();

    if (!session.id) {
        return null;
    }

    return db.playData.findFirst({
        where: {
            music_idx: index,
            user_id: session.id,
            difficulty,
        },
        select: {
            user_id: true,
            user: {
                select: {
                    id: true,
                    username: true,
                    avatar: true,
                },
            },
            rank: true,
            fc_type: true,
            grade_basic: true,
            grade_recital: true,
            level: true,
            score: true,
            max_combo: true,
            play_count: true,
            fullcombo_count: true,
            pianistic_count: true,
            besttime: true,
        },
    });
}

export async function getRecentChartPlays({
    index,
    difficulty,
}: GetUserPlayDataProps) {
    const session = await getSession();

    if (!session.id) {
        return [];
    }

    const plays = await db.chartPlayHistory.findMany({
        where: {
            user_id: session.id,
            chart: {
                music_idx: index,
                difficulty,
            },
        },
        select: {
            id: true,
            score: true,
            rank: true,
            source_play_time: true,
        },
        orderBy: [{ source_play_time: "desc" }, { id: "desc" }],
        take: 4,
    });

    return plays.reverse().map((play) => ({
        id: play.id,
        score: play.score,
        rank: play.rank,
        play_time: play.source_play_time,
    }));
}

// 사용자별 채보 투표를 최초 등록하거나 기존 값으로 갱신함
export async function submitChartEvaluation(
    input: ChartEvaluationInput
): Promise<EvaluationActionResult> {
    const session = await getSession();

    if (!session.id) {
        return { success: false, message: "로그인 후 투표할 수 있습니다." };
    }

    const parsed = chartEvaluationSchema.safeParse(input);

    if (!parsed.success) {
        return {
            success: false,
            message:
                parsed.error.issues[0]?.message ?? "투표 값을 확인해 주세요.",
        };
    }

    const chart = await db.musicChart.findUnique({
        where: { id: parsed.data.chartId },
        select: { id: true, music_idx: true, difficulty: true },
    });

    if (!chart) {
        return { success: false, message: "채보 정보를 찾을 수 없습니다." };
    }

    const data = {
        perceived_constant: parsed.data.perceivedConstant,
        stairs: parsed.data.stairs,
        chord: parsed.data.chord,
        trill: parsed.data.trill,
        glissando: parsed.data.glissando,
        repetition: parsed.data.repetition,
        comment: parsed.data.comment || null,
    };

    await db.chartEvaluation.upsert({
        where: {
            chart_id_user_id: {
                chart_id: chart.id,
                user_id: session.id,
            },
        },
        create: {
            ...data,
            chart_id: chart.id,
            user_id: session.id,
        },
        update: data,
    });

    revalidatePath(`/music/${chart.music_idx}/${chart.difficulty}`);

    return { success: true, message: "투표가 반영되었습니다." };
}

// 같은 반응을 다시 누르면 취소하고 다른 반응이면 값을 교체함
export async function toggleChartEvaluationReaction(
    input: ChartEvaluationReactionInput
): Promise<EvaluationActionResult> {
    const session = await getSession();

    if (!session.id) {
        return { success: false, message: "로그인 후 반응할 수 있습니다." };
    }

    const parsed = chartEvaluationReactionSchema.safeParse(input);

    if (!parsed.success) {
        return { success: false, message: "반응 값을 확인해 주세요." };
    }

    const evaluation = await db.chartEvaluation.findUnique({
        where: { id: parsed.data.evaluationId },
        select: {
            id: true,
            chart: { select: { music_idx: true, difficulty: true } },
        },
    });

    if (!evaluation) {
        return { success: false, message: "의견을 찾을 수 없습니다." };
    }

    const existing = await db.chartEvaluationReaction.findUnique({
        where: {
            evaluation_id_user_id: {
                evaluation_id: evaluation.id,
                user_id: session.id,
            },
        },
        select: { id: true, value: true },
    });

    if (existing?.value === parsed.data.value) {
        await db.chartEvaluationReaction.delete({
            where: { id: existing.id },
        });
    } else {
        await db.chartEvaluationReaction.upsert({
            where: {
                evaluation_id_user_id: {
                    evaluation_id: evaluation.id,
                    user_id: session.id,
                },
            },
            create: {
                evaluation_id: evaluation.id,
                user_id: session.id,
                value: parsed.data.value,
            },
            update: { value: parsed.data.value },
        });
    }

    revalidatePath(
        `/music/${evaluation.chart.music_idx}/${evaluation.chart.difficulty}`
    );

    return { success: true, message: "반응이 반영되었습니다." };
}
