import { isTierGoalAchieved, isTierModeGoal } from "@/lib/tiers";
import type { TierGoal, TierMode, TierRecord } from "@/lib/tiers";
import { PATTERN_AXES } from "@/features/music/schemas/communitySchema";
import type {
    PatternRatings,
    PatternSummary,
} from "@/features/music/schemas/communitySchema";

export function canContributeGoalVote(
    record: (TierRecord & { grade_recital: number | null }) | null,
    mode: TierMode,
    goal: TierGoal
) {
    return (
        isTierModeGoal(mode, goal) &&
        isTierGoalAchieved(record, goal) &&
        (mode === "basic" || (record?.grade_recital ?? 0) > 0)
    );
}

/** 패턴 경향은 평가 1명부터 평균을 보여 준다 (2026-09-17 · 이전 3명) */
export const MIN_PATTERN_RATINGS = 1;

export function aggregatePatternRatings(
    evaluations: PatternRatings[]
): PatternSummary {
    return Object.fromEntries(
        PATTERN_AXES.map((axis) => {
            const values = evaluations.flatMap((evaluation) =>
                evaluation[axis] === null ? [] : [evaluation[axis]]
            );
            return [
                axis,
                {
                    count: values.length,
                    average:
                        values.length >= MIN_PATTERN_RATINGS
                            ? values.reduce((sum, value) => sum + value, 0) /
                              values.length
                            : null,
                },
            ];
        })
    ) as PatternSummary;
}

export function summarizeGoalVotes(values: number[]) {
    const sorted = [...values].sort((a, b) => a - b);
    const quantile = (position: number) => {
        const index = (sorted.length - 1) * position;
        const lower = Math.floor(index);
        return (
            sorted[lower] +
            (sorted[Math.ceil(index)] - sorted[lower]) * (index - lower)
        );
    };
    const distribution = Array.from(new Set(sorted)).map((value) => ({
        value,
        count: sorted.filter((item) => item === value).length,
    }));
    return {
        count: sorted.length,
        mean: sorted.length
            ? sorted.reduce((sum, value) => sum + value, 0) / sorted.length
            : null,
        median: sorted.length ? quantile(0.5) : null,
        lowerQuartile: sorted.length ? quantile(0.25) : null,
        upperQuartile: sorted.length ? quantile(0.75) : null,
        distribution,
    };
}
