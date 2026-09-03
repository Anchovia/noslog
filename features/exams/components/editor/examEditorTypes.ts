import {
    EMPTY_EXAM,
    type ChartOption,
    type ExamEditorFormValues,
    type ExamMode,
    type ExamRewardEditor,
    type ExamStageEditor,
    type ExamStatus,
    type ScoringType,
} from "@/features/exams/schemas/examEditorSchema";

export type {
    ChartOption,
    ExamEditorFormValues,
    ExamMode,
    ExamRewardEditor,
    ExamStageEditor,
    ExamStatus,
    ScoringType,
};
export { EMPTY_EXAM };

export type SearchPurpose = "stage" | "reward";

export interface MusicSearchResult {
    musicIndex: string;
    title: string;
    artist: string | null;
    charts: ChartOption[];
}

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

export function cloneExamValues(values: ExamEditorFormValues) {
    return {
        ...values,
        stages: values.stages.map((stage) => ({
            ...stage,
            charts: stage.charts.map((chart) => ({ ...chart })),
            allowedChartIds: [...stage.allowedChartIds],
        })),
        rewards: values.rewards.map((reward) => ({ ...reward })),
    };
}
