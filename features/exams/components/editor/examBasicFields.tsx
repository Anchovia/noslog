import type { FieldErrors, UseFormRegister } from "react-hook-form";

import type {
    ExamEditorFormValues,
    ExamMode,
} from "@/features/exams/schemas/examEditorSchema";
import { cn } from "@/lib/utils";

import ExamFieldError from "./examFieldError";
import {
    EXAM_INPUT_CLASS,
    EXAM_LABEL_CLASS,
    getExamModeLabel,
} from "./examEditorTypes";

interface ExamBasicFieldsProps {
    errors: FieldErrors<ExamEditorFormValues>;
    mode: ExamMode;
    onGradeChange: (grade: number) => void;
    onModeChange: (mode: ExamMode) => void;
    register: UseFormRegister<ExamEditorFormValues>;
}

export default function ExamBasicFields({
    errors,
    mode,
    onGradeChange,
    onModeChange,
    register,
}: ExamBasicFieldsProps) {
    return (
        <section>
            <h2 className="text-section mb-3 font-bold">기본 정보</h2>
            <input type="hidden" {...register("mode")} />
            <div className="grid grid-cols-3 gap-2">
                {(["basic", "recital", "event"] as const).map((value) => (
                    <button
                        key={value}
                        type="button"
                        aria-pressed={mode === value}
                        onClick={() => onModeChange(value)}
                        className={cn(
                            "bg-surface text-text-secondary h-10 rounded-md text-sm font-semibold",
                            mode === value && "bg-text-primary text-bg"
                        )}
                    >
                        {getExamModeLabel(value)}
                    </button>
                ))}
            </div>
            <ExamFieldError message={errors.mode?.message} />

            <div className="mt-3 grid grid-cols-2 gap-3">
                {mode !== "event" ? (
                    <label>
                        <span className={EXAM_LABEL_CLASS}>급수</span>
                        <input
                            type="number"
                            min={1}
                            max={10}
                            inputMode="numeric"
                            aria-invalid={Boolean(errors.grade)}
                            className={EXAM_INPUT_CLASS}
                            {...register("grade", {
                                setValueAs: (value) =>
                                    value === "" ? null : Number(value),
                                onChange: (event) =>
                                    onGradeChange(Number(event.target.value)),
                            })}
                        />
                        <ExamFieldError message={errors.grade?.message} />
                    </label>
                ) : (
                    <label>
                        <span className={EXAM_LABEL_CLASS}>채점 방식</span>
                        <select
                            aria-invalid={Boolean(errors.scoringType)}
                            className={EXAM_INPUT_CLASS}
                            {...register("scoringType")}
                        >
                            <option value="score">스코어</option>
                            <option value="recital_point">
                                리사이틀 포인트
                            </option>
                        </select>
                        <ExamFieldError message={errors.scoringType?.message} />
                    </label>
                )}
                <label>
                    <span className={EXAM_LABEL_CLASS}>식별자</span>
                    <input
                        aria-invalid={Boolean(errors.slug)}
                        className={EXAM_INPUT_CLASS}
                        {...register("slug")}
                    />
                    <ExamFieldError message={errors.slug?.message} />
                </label>
            </div>

            <label className="mt-3 block">
                <span className={EXAM_LABEL_CLASS}>선택 라벨</span>
                <input
                    placeholder="예: 7th KAC"
                    aria-invalid={Boolean(errors.shortLabel)}
                    className={EXAM_INPUT_CLASS}
                    {...register("shortLabel")}
                />
                <ExamFieldError message={errors.shortLabel?.message} />
            </label>
            <label className="mt-3 block">
                <span className={EXAM_LABEL_CLASS}>검정명</span>
                <input
                    placeholder="예: The 7th KAC 스페셜 검정"
                    aria-invalid={Boolean(errors.title)}
                    className={EXAM_INPUT_CLASS}
                    {...register("title")}
                />
                <ExamFieldError message={errors.title?.message} />
            </label>
            <label className="mt-3 block">
                <span className={EXAM_LABEL_CLASS}>설명</span>
                <textarea
                    rows={3}
                    aria-invalid={Boolean(errors.description)}
                    className="border-border bg-surface text-body w-full resize-none rounded-md border p-3 outline-none"
                    {...register("description")}
                />
                <ExamFieldError message={errors.description?.message} />
            </label>
            <div className="mt-3 grid grid-cols-2 gap-3">
                <label>
                    <span className={EXAM_LABEL_CLASS}>요구 Grd.</span>
                    <input
                        type="number"
                        min={0}
                        inputMode="numeric"
                        aria-invalid={Boolean(errors.requiredGrade)}
                        className={EXAM_INPUT_CLASS}
                        {...register("requiredGrade", { valueAsNumber: true })}
                    />
                    <ExamFieldError message={errors.requiredGrade?.message} />
                </label>
                <label>
                    <span className={EXAM_LABEL_CLASS}>검정료 (nos)</span>
                    <input
                        type="number"
                        min={0}
                        inputMode="numeric"
                        aria-invalid={Boolean(errors.feeNos)}
                        className={EXAM_INPUT_CLASS}
                        {...register("feeNos", { valueAsNumber: true })}
                    />
                    <ExamFieldError message={errors.feeNos?.message} />
                </label>
            </div>
        </section>
    );
}
