import { ArrowDown, ArrowUp, Check, Plus, Trash2 } from "lucide-react";
import type { FieldErrors, UseFormRegister } from "react-hook-form";

import { foundationButtonClass } from "@/components/ui/button";
import type {
    ExamEditorFormValues,
    ExamStageEditor,
    ScoringType,
} from "@/features/exams/schemas/exam-editor-schema";

import { EXAM_INPUT_CLASS, EXAM_LABEL_CLASS } from "./exam-editor-types";
import ExamFieldError from "./exam-field-error";

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
            <div className="mb-nl-12 flex items-center justify-between">
                <div>
                    <h2 className="nl-component-title text-nl-content">
                        과제곡
                    </h2>
                    <p className="nl-metadata mt-nl-4 text-nl-subdued">
                        곡별 허용 난이도와 통과 조건을 설정합니다.
                    </p>
                </div>
                <button
                    type="button"
                    onClick={onAdd}
                    disabled={stages.length >= 3}
                    className={foundationButtonClass({ size: "icon-sm" })}
                    aria-label="과제곡 추가"
                >
                    <Plus className="nl-icon-small" />
                </button>
            </div>

            <div className="flex flex-col gap-nl-8">
                {stages.map((stage, index) => (
                    <article
                        key={stage.id ?? stage.musicIndex}
                        className="rounded-nl-container bg-nl-surface p-nl-12"
                    >
                        <div className="flex items-start gap-nl-8">
                            <span className="nl-metadata mt-nl-4 w-nl-32 shrink-0 text-nl-subdued">
                                {getStageLabel(index)}
                            </span>
                            <div className="min-w-0 flex-1">
                                <p className="nl-emphasis-label truncate text-nl-content">
                                    {stage.title}
                                </p>
                                <p className="nl-metadata truncate text-nl-subdued">
                                    {stage.artist ?? "아티스트 정보 없음"}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => onMove(index, -1)}
                                disabled={index === 0}
                                className={foundationButtonClass({
                                    variant: "ghost",
                                    size: "icon-sm",
                                })}
                                aria-label="과제곡 위로 이동"
                            >
                                <ArrowUp className="nl-icon-small" />
                            </button>
                            <button
                                type="button"
                                onClick={() => onMove(index, 1)}
                                disabled={index === stages.length - 1}
                                className={foundationButtonClass({
                                    variant: "ghost",
                                    size: "icon-sm",
                                })}
                                aria-label="과제곡 아래로 이동"
                            >
                                <ArrowDown className="nl-icon-small" />
                            </button>
                            <button
                                type="button"
                                onClick={() => onRemove(index)}
                                className={foundationButtonClass({
                                    variant: "ghost",
                                    size: "icon-sm",
                                })}
                                aria-label="과제곡 삭제"
                            >
                                <Trash2 className="nl-icon-small" />
                            </button>
                        </div>

                        <div className="mt-nl-12 flex flex-wrap gap-nl-8">
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
                                        className="nl-chip nl-control capitalize"
                                        data-tone={chart.difficulty.toLowerCase()}
                                    >
                                        {selected ? (
                                            <Check
                                                className="nl-icon-small"
                                                aria-hidden
                                            />
                                        ) : null}
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

                        <div className="mt-nl-12 grid grid-cols-2 gap-nl-8">
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
                    <div className="nl-metadata rounded-nl-field border-nl-stroke border-dashed border-nl-border py-nl-32 text-center text-nl-subdued">
                        과제곡을 추가해주세요.
                    </div>
                ) : null}
            </div>
            <ExamFieldError message={error} />
        </section>
    );
}
