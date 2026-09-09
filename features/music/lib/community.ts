import { isTierGoalAchieved } from "@/lib/tiers";
import type { TierGoal, TierMode, TierRecord } from "@/lib/tiers";
import { PATTERN_AXES } from "@/features/music/schemas/communitySchema";
import type {
    PatternRatings,
    PatternSummary,
} from "@/features/music/schemas/communitySchema";

export function canContributeGoalVote(
    record: (TierRecord & { grade_recital: number }) | null,
    mode: TierMode,
    goal: TierGoal
) {
    return (
        isTierGoalAchieved(record, goal) &&
        (mode === "basic" || (record?.grade_recital ?? 0) > 0)
    );
}

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
                        values.length >= 3
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
