import { cn } from "@/lib/utils";

import {
    EXAM_INPUT_CLASS,
    EXAM_LABEL_CLASS,
    type ExamEditorData,
    type ExamMode,
    getExamModeLabel,
    type ScoringType,
} from "./examEditorTypes";

interface ExamBasicFieldsProps {
    exam: ExamEditorData;
    onChange: (changes: Partial<ExamEditorData>) => void;
    onModeChange: (mode: ExamMode) => void;
    onGradeChange: (grade: number) => void;
}

// 검정 종류와 기본 입력 필드를 한곳에서 관리함
export default function ExamBasicFields({
    exam,
    onChange,
    onModeChange,
    onGradeChange,
}: ExamBasicFieldsProps) {
    return (
        <section>
            <h2 className="text-section mb-3 font-bold">기본 정보</h2>
            <div className="grid grid-cols-3 gap-2">
                {(["basic", "recital", "event"] as const).map((mode) => (
                    <button
                        key={mode}
                        type="button"
                        onClick={() => onModeChange(mode)}
                        className={cn(
                            "bg-surface text-text-secondary h-10 rounded-md text-sm font-semibold",
                            exam.mode === mode && "bg-text-primary text-bg"
                        )}
                    >
                        {getExamModeLabel(mode)}
                    </button>
                ))}
            </div>

            <div className="mt-3 grid grid-cols-2 gap-3">
                {exam.mode !== "event" ? (
                    <label>
                        <span className={EXAM_LABEL_CLASS}>급수</span>
                        <input
                            type="number"
                            min={1}
                            max={10}
                            value={exam.grade ?? 10}
                            onChange={(event) =>
                                onGradeChange(Number(event.target.value))
                            }
                            className={EXAM_INPUT_CLASS}
                        />
                    </label>
                ) : (
                    <label>
                        <span className={EXAM_LABEL_CLASS}>채점 방식</span>
                        <select
                            value={exam.scoringType}
                            onChange={(event) =>
                                onChange({
                                    scoringType: event.target
                                        .value as ScoringType,
                                })
                            }
                            className={EXAM_INPUT_CLASS}
                        >
                            <option value="score">스코어</option>
                            <option value="recital_point">
                                리사이틀 포인트
                            </option>
                        </select>
                    </label>
                )}
                <label>
                    <span className={EXAM_LABEL_CLASS}>식별자</span>
                    <input
                        value={exam.slug}
                        onChange={(event) =>
                            onChange({ slug: event.target.value })
                        }
                        className={EXAM_INPUT_CLASS}
                    />
                </label>
            </div>

            <label className="mt-3 block">
                <span className={EXAM_LABEL_CLASS}>선택 라벨</span>
                <input
                    value={exam.shortLabel}
                    onChange={(event) =>
                        onChange({ shortLabel: event.target.value })
                    }
                    placeholder="예: 7th KAC"
                    className={EXAM_INPUT_CLASS}
                />
            </label>
            <label className="mt-3 block">
                <span className={EXAM_LABEL_CLASS}>검정명</span>
                <input
                    value={exam.title}
                    onChange={(event) =>
                        onChange({ title: event.target.value })
                    }
                    placeholder="예: The 7th KAC 스페셜 검정"
                    className={EXAM_INPUT_CLASS}
                />
            </label>
            <label className="mt-3 block">
                <span className={EXAM_LABEL_CLASS}>설명</span>
                <textarea
                    value={exam.description}
                    onChange={(event) =>
                        onChange({ description: event.target.value })
                    }
                    rows={3}
                    className="border-border bg-surface text-body w-full resize-none rounded-md border p-3 outline-none"
                />
            </label>
            <div className="mt-3 grid grid-cols-2 gap-3">
                <label>
                    <span className={EXAM_LABEL_CLASS}>요구 Grd.</span>
                    <input
                        type="number"
                        min={0}
                        value={exam.requiredGrade}
                        onChange={(event) =>
                            onChange({
                                requiredGrade: Number(event.target.value),
                            })
                        }
                        className={EXAM_INPUT_CLASS}
                    />
                </label>
                <label>
                    <span className={EXAM_LABEL_CLASS}>검정료 (nos)</span>
                    <input
                        type="number"
                        min={0}
                        value={exam.feeNos}
                        onChange={(event) =>
                            onChange({ feeNos: Number(event.target.value) })
                        }
                        className={EXAM_INPUT_CLASS}
                    />
                </label>
            </div>
        </section>
    );
}
