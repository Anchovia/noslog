import {
    type ChartOption,
    EMPTY_EXAM,
    type ExamEditorFormValues,
    type ExamMode,
} from "@/features/exams/schemas/exam-editor-schema";

export type { ExamEditorFormValues, ExamMode };
export { EMPTY_EXAM };

export type SearchPurpose = "stage" | "reward";

export interface MusicSearchResult {
    musicIndex: string;
    title: string;
    artist: string | null;
    charts: ChartOption[];
}

export const EXAM_INPUT_CLASS = "nl-input";
export const EXAM_LABEL_CLASS = "nl-metadata text-nl-subdued mb-nl-8 block ";

export function getExamModeLabel(mode: ExamMode) {
    if (mode === "basic") return "Basic";
    if (mode === "recital") return "Recital";
    return "Event";
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
