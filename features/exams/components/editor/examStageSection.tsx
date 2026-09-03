import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import type { FieldErrors, UseFormRegister } from "react-hook-form";

import type {
    ExamEditorFormValues,
    ExamStageEditor,
    ScoringType,
} from "@/features/exams/schemas/examEditorSchema";
import { cn } from "@/lib/utils";

import ExamFieldError from "./examFieldError";
import {
    EXAM_INPUT_CLASS,
    EXAM_LABEL_CLASS,
    getDifficultyColor,
} from "./examEditorTypes";

interface ExamStageSectionProps {
    error?: string;
    errors: FieldErrors<ExamEditorFormValues>;
    onAdd: () => void;
    onMove: (index: number, direction: -1 | 1) => void;
    onRemove: (index: number) => void;
    onToggleChart: (stageIndex: number, chartId: number) => void;
    register: UseFormRegister<ExamEditorFormValues>;
    scoringType: ScoringType;
    stages: ExamStageEditor[];
}

function getStageLabel(index: number) {
    if (index === 2) return "Fin";
    return `${index + 1}${index === 0 ? "st" : "nd"}`;
}

export default function ExamStageSection({
    error,
    errors,
    onAdd,
    onMove,
    onRemove,
    onToggleChart,
    register,
    scoringType,
    stages,
}: ExamStageSectionProps) {
    return (
        <section>
            <div className="mb-3 flex items-center justify-between">
                <div>
                    <h2 className="text-section font-bold">과제곡</h2>
                    <p className="text-caption mt-0.5">
                        곡별 허용 난이도와 통과 조건을 설정합니다.
                    </p>
                </div>
                <button
                    type="button"
                    onClick={onAdd}
                    disabled={stages.length >= 3}
                    className="bg-text-primary text-bg flex size-9 items-center justify-center rounded-md disabled:opacity-40"
                    aria-label="과제곡 추가"
                >
                    <Plus className="size-4" />
                </button>
            </div>

            <div className="flex flex-col gap-2">
                {stages.map((stage, index) => (
                    <article
                        key={stage.id ?? stage.musicIndex}
                        className="bg-surface rounded-card p-3"
                    >
                        <div className="flex items-start gap-2">
                            <span className="text-caption mt-1 w-7 shrink-0">
                                {getStageLabel(index)}
                            </span>
                            <div className="min-w-0 flex-1">
                                <p className="text-body truncate font-bold">
                                    {stage.title}
                                </p>
                                <p className="text-caption truncate">
                                    {stage.artist ?? "아티스트 정보 없음"}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => onMove(index, -1)}
                                disabled={index === 0}
                                className="text-text-secondary p-1 disabled:opacity-25"
                                aria-label="과제곡 위로 이동"
                            >
                                <ArrowUp className="size-4" />
                            </button>
                            <button
                                type="button"
                                onClick={() => onMove(index, 1)}
                                disabled={index === stages.length - 1}
                                className="text-text-secondary p-1 disabled:opacity-25"
                                aria-label="과제곡 아래로 이동"
                            >
                                <ArrowDown className="size-4" />
                            </button>
                            <button
                                type="button"
                                onClick={() => onRemove(index)}
                                className="text-danger p-1"
                                aria-label="과제곡 삭제"
                            >
                                <Trash2 className="size-4" />
                            </button>
                        </div>

                        <div className="mt-3 flex flex-wrap gap-1.5">
                            {stage.charts.map((chart) => {
                                const selected = stage.allowedChartIds.includes(
                                    chart.chartId
                                );

                                return (
                                    <button
                                        key={chart.chartId}
                                        type="button"
                                        aria-pressed={selected}
                                        onClick={() =>
                                            onToggleChart(index, chart.chartId)
                                        }
                                        className={cn(
                                            "border-border rounded-full border px-2.5 py-1 text-xs font-semibold capitalize opacity-45",
                                            selected &&
                                                "bg-surface-muted opacity-100 ring-1 ring-current",
                                            getDifficultyColor(chart.difficulty)
                                        )}
                                    >
                                        {chart.difficulty} {chart.level}
                                    </button>
                                );
                            })}
                        </div>
                        <ExamFieldError
                            message={
                                errors.stages?.[index]?.allowedChartIds?.message
                            }
                        />

                        <div className="mt-3 grid grid-cols-2 gap-2">
                            <label>
                                <span className={EXAM_LABEL_CLASS}>조건</span>
                                <select
                                    aria-invalid={Boolean(
                                        errors.stages?.[index]?.requirementType
                                    )}
                                    className={EXAM_INPUT_CLASS}
                                    {...register(
                                        `stages.${index}.requirementType`
                                    )}
                                >
                                    <option value="single">해당 곡</option>
                                    <option value="cumulative">
                                        누적 합계
                                    </option>
                                </select>
                                <ExamFieldError
                                    message={
                                        errors.stages?.[index]?.requirementType
                                            ?.message
                                    }
                                />
                            </label>
                            <label>
                                <span className={EXAM_LABEL_CLASS}>
                                    {scoringType === "score"
                                        ? "목표 스코어"
                                        : "목표 포인트"}
                                </span>
                                <input
                                    type="number"
                                    min={scoringType === "score" ? 1 : 0.1}
                                    step={scoringType === "score" ? 1 : 0.1}
                                    inputMode="decimal"
                                    aria-invalid={Boolean(
                                        errors.stages?.[index]?.requiredValue
                                    )}
                                    className={EXAM_INPUT_CLASS}
                                    {...register(
                                        `stages.${index}.requiredValue`,
                                        { valueAsNumber: true }
                                    )}
                                />
                                <ExamFieldError
                                    message={
                                        errors.stages?.[index]?.requiredValue
                                            ?.message
                                    }
                                />
                            </label>
                        </div>
                    </article>
                ))}

                {stages.length === 0 ? (
                    <div className="border-border text-caption flex min-h-24 items-center justify-center rounded-md border border-dashed">
                        과제곡을 추가해주세요.
                    </div>
                ) : null}
            </div>
            <ExamFieldError message={error} />
        </section>
    );
}
