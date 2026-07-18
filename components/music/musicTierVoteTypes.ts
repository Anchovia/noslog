import type { Difficulty } from "./musicDetailTypes";

export interface EvaluationFormValues {
    perceivedConstant: number;
    stairs: number | null;
    chord: number | null;
    trill: number | null;
    glissando: number | null;
    repetition: number | null;
    comment: string;
}

export interface ConstantHistoryItem {
    id: number;
    value: number;
    effectiveAt: string;
}

export interface CommunityEvaluation {
    average: number | null;
    count: number;
    distribution: { value: number; count: number }[];
}

export interface CurrentEvaluation {
    perceived_constant: number;
    stairs: number;
    chord: number;
    trill: number;
    glissando: number;
    repetition: number;
    comment: string | null;
}

export interface EvaluationOpinion {
    id: number;
    perceivedConstant: number;
    comment: string;
    updatedAt: string;
    user: { id: number; username: string | null };
    positiveCount: number;
    negativeCount: number;
    viewerReaction: number | null;
    canDelete: boolean;
}

export interface MusicTierVoteProps {
    chartId: number;
    canVote: boolean;
    difficulty: Difficulty;
    level: number;
    officialConstant: number | null;
    tierConstant: number | null;
    constantHistory: ConstantHistoryItem[];
    community: CommunityEvaluation;
    currentEvaluation: CurrentEvaluation | null;
    opinionCount: number;
    opinions: EvaluationOpinion[];
}
