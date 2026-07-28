export type ExamMode = "basic" | "recital" | "event";

export interface ExamStageRecord {
    score: number;
    rank: string;
    fcType: number;
    maxCombo: number;
    judgeSjust: number | null;
    judgeJust: number | null;
    judgeGood: number | null;
    judgeMiss: number | null;
    judgeNear: number | null;
    noteRateStandard: number | null;
    noteRateTenuto: number | null;
    noteRateGlissando: number | null;
    noteRateTrill: number | null;
}

export interface ExamStageItem {
    id: number;
    position: number;
    label: string | null;
    requirementType: string;
    requiredValue: number;
    bestValue: number | null;
    bestRecord?: ExamStageRecord | null;
    musicIndex: string;
    title: string;
    artist: string | null;
    charts: { chartId: number; difficulty: string; level: number }[];
}

export interface ExamDashboardItem {
    id: number;
    slug: string;
    mode: string;
    scoringType: string;
    grade: number | null;
    shortLabel: string;
    title: string;
    description: string | null;
    feeNos: number;
    requiredGrade: number;
    rewards: {
        id: number;
        type: string;
        label: string;
        musicIndex: string | null;
    }[];
    isAchieved: boolean;
    submissionStatus: string | null;
    submissionReviewerNote: string | null;
    playerGrade: number | null;
    stages: ExamStageItem[];
}

export interface ExamStageResult extends ExamStageItem {
    comparisonValue: number;
    isPassed: boolean | null;
    individualTargetValue: number;
    individualGapValue: number;
    weakestNote: {
        label: string;
        rate: number;
    } | null;
}

export interface ExamSimulationResult {
    stages: ExamStageResult[];
    totalValue: number;
    targetValue: number;
    progress: number;
    firstFailedStage: ExamStageResult | undefined;
    priorityStage: ExamStageResult | undefined;
}
