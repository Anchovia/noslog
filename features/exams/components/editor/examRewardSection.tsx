import { Plus, X } from "lucide-react";
import type { FieldErrors, UseFormRegister } from "react-hook-form";

import type {
    ExamEditorFormValues,
    ExamRewardEditor,
} from "@/features/exams/schemas/examEditorSchema";

import ExamFieldError from "./examFieldError";

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
            <div className="mb-3 flex items-center justify-between">
                <div>
                    <h2 className="text-section font-bold">합격 보상</h2>
                    <p className="text-caption mt-0.5">
                        악곡 보상은 실제 악곡과 연결합니다.
                    </p>
                </div>
                <button
                    type="button"
                    onClick={onAddMusic}
                    className="border-border flex h-9 items-center gap-1.5 rounded-md border px-3 text-xs font-semibold"
                >
                    <Plus className="size-3.5" /> 악곡
                </button>
            </div>

            <div className="flex flex-col gap-2">
                {rewards.map((reward, index) => (
                    <div key={`${reward.type}-${reward.musicIndex ?? index}`}>
                        <div className="bg-surface flex min-h-12 items-center gap-3 rounded-md px-3 py-2">
                            <span className="text-caption shrink-0">
                                {reward.type === "music_unlock"
                                    ? "악곡"
                                    : "급수"}
                            </span>
                            <input
                                aria-label={`${index + 1}번째 보상 이름`}
                                aria-invalid={Boolean(
                                    errors.rewards?.[index]?.label
                                )}
                                className="text-body min-w-0 flex-1 bg-transparent outline-none"
                                {...register(`rewards.${index}.label`)}
                            />
                            <button
                                type="button"
                                onClick={() => onRemove(index)}
                                className="text-danger p-1"
                                aria-label="보상 삭제"
                            >
                                <X className="size-4" />
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
                    <p className="text-caption">등록된 합격 보상이 없습니다.</p>
                ) : null}
            </div>
            <ExamFieldError message={error} />
        </section>
    );
}
