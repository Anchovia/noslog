import { Plus, X } from "lucide-react";
import type { FieldErrors, UseFormRegister } from "react-hook-form";

import { foundationButtonClass } from "@/components/ui/button";
import type {
    ExamEditorFormValues,
    ExamRewardEditor,
} from "@/features/exams/schemas/exam-editor-schema";

import ExamFieldError from "./exam-field-error";

interface ExamRewardSectionProps {
    error?: string;
    errors: FieldErrors<ExamEditorFormValues>;
    onAddMusic: () => void;
    onRemove: (index: number) => void;
    register: UseFormRegister<ExamEditorFormValues>;
    rewards: ExamRewardEditor[];
}

export default function ExamRewardSection({
    error,
    errors,
    onAddMusic,
    onRemove,
    register,
    rewards,
}: ExamRewardSectionProps) {
    return (
        <section>
            <div className="mb-nl-12 flex items-center justify-between">
                <div>
                    <h2 className="nl-component-title text-nl-content">
                        합격 보상
                    </h2>
                    <p className="nl-metadata mt-nl-4 text-nl-subdued">
                        악곡 보상은 실제 악곡과 연결합니다.
                    </p>
                </div>
                <button
                    type="button"
                    onClick={onAddMusic}
                    className={foundationButtonClass({
                        variant: "secondary",
                        size: "sm",
                    })}
                >
                    <Plus className="nl-icon-small" /> 악곡
                </button>
            </div>

            <div className="flex flex-col gap-nl-8">
                {rewards.map((reward, index) => (
                    <div key={`${reward.type}-${reward.musicIndex ?? index}`}>
                        <div className="flex min-h-nl-48 items-center gap-nl-12 rounded-nl-control bg-nl-surface px-nl-12 py-nl-8">
                            <span className="nl-metadata shrink-0 text-nl-subdued">
                                {reward.type === "music_unlock"
                                    ? "악곡"
                                    : "급수"}
                            </span>
                            <input
                                aria-label={`${index + 1}번째 보상 이름`}
                                aria-invalid={Boolean(
                                    errors.rewards?.[index]?.label
                                )}
                                className="nl-control min-w-0 flex-1 bg-transparent text-nl-content outline-none"
                                {...register(`rewards.${index}.label`)}
                            />
                            <button
                                type="button"
                                onClick={() => onRemove(index)}
                                className="p-nl-4 text-nl-error"
                                aria-label="보상 삭제"
                            >
                                <X className="nl-icon-small" />
                            </button>
                        </div>
                        <ExamFieldError
                            message={
                                errors.rewards?.[index]?.label?.message ??
                                errors.rewards?.[index]?.musicIndex?.message
                            }
                        />
                    </div>
                ))}

                {rewards.length === 0 ? (
                    <p className="nl-metadata text-nl-subdued">
                        등록된 합격 보상이 없습니다.
                    </p>
                ) : null}
            </div>
            <ExamFieldError message={error} />
        </section>
    );
}
