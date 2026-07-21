export type ExamMode = "basic" | "recital" | "event";
export type ScoringType = "score" | "recital_point";
export type ExamStatus = "draft" | "published";
export type RequirementType = "single" | "cumulative";
export type SearchPurpose = "stage" | "reward";

export interface ChartOption {
    chartId: number;
    difficulty: string;
    level: number;
}

export interface ExamStageEditor {
    id?: number;
    musicIndex: string;
    title: string;
    artist: string | null;
    charts: ChartOption[];
    allowedChartIds: number[];
    label: string;
    requirementType: RequirementType;
    requiredValue: number;
}

export interface ExamRewardEditor {
    id?: number;
    type: "grade" | "music_unlock";
    label: string;
    musicIndex: string | null;
}

export interface ExamEditorData {
    id?: number;
    slug: string;
    mode: ExamMode;
    scoringType: ScoringType;
    grade: number | null;
    shortLabel: string;
    title: string;
    description: string;
    feeNos: number;
    requiredGrade: number;
    status: ExamStatus;
    stages: ExamStageEditor[];
    rewards: ExamRewardEditor[];
}

export interface MusicSearchResult {
    musicIndex: string;
    title: string;
    artist: string | null;
    charts: ChartOption[];
}

export const EMPTY_EXAM: ExamEditorData = {
    slug: "basic-10",
    mode: "basic",
    scoringType: "score",
    grade: 10,
    shortLabel: "10급",
    title: "Basic 10급",
    description: "",
    feeNos: 1000,
    requiredGrade: 800,
    status: "draft",
    stages: [],
    rewards: [{ type: "grade", label: "Basic 10급", musicIndex: null }],
};

export const EXAM_INPUT_CLASS =
    "border-border bg-surface text-input placeholder:text-text-disabled h-11 w-full rounded-md border px-3 outline-none focus:border-focus";
export const EXAM_LABEL_CLASS = "text-caption mb-1.5 block font-semibold";

export function getExamModeLabel(mode: ExamMode) {
    if (mode === "basic") return "Basic";
    if (mode === "recital") return "Recital";
    return "Event";
}

export function getDifficultyColor(difficulty: string) {
    const normalizedDifficulty = difficulty.toLowerCase();

    if (normalizedDifficulty === "normal") return "text-normal";
    if (normalizedDifficulty === "hard") return "text-hard";
    if (normalizedDifficulty === "expert") return "text-expert";
    return "text-real";
}
