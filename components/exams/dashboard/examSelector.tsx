import { Check, ChevronDown } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

import type { ExamDashboardItem } from "./examDashboardTypes";
import { canEnterExam, getModeText } from "./examDashboardUtils";

interface ExamSelectorProps {
    exams: ExamDashboardItem[];
    selectedExamId: number | null;
    onChange: (examId: number) => void;
    children: ReactNode;
}

// 검정 목록과 선택한 검정의 상세 영역을 아코디언으로 관리함
export default function ExamSelector({
    exams,
    selectedExamId,
    onChange,
    children,
}: ExamSelectorProps) {
    return (
        <div className="flex flex-col gap-2">
            {exams.map((exam) => {
                const selected = selectedExamId === exam.id;
                const locked = !exam.isAchieved && !canEnterExam(exam);
                const pending = exam.submissionStatus === "pending";
                const rejected = exam.submissionStatus === "rejected";

                return (
                    <section key={exam.id}>
                        <button
                            type="button"
                            aria-expanded={selected}
                            onClick={() => onChange(exam.id)}
                            className={cn(
                                "bg-surface rounded-card flex h-14 w-full items-center gap-3 px-3 text-left",
                                selected && "ring-border ring-1",
                                !selected && locked && "opacity-50"
                            )}
                        >
                            <span className="min-w-0 flex-1">
                                <strong
                                    className={cn(
                                        "block truncate text-sm",
                                        getModeText(exam.mode)
                                    )}
                                >
                                    {exam.shortLabel}
                                </strong>
                                <span className="text-text-secondary mt-0.5 block truncate text-xs">
                                    {exam.title}
                                </span>
                            </span>
                            <span
                                className={cn(
                                    "flex shrink-0 items-center gap-1 text-xs font-semibold",
                                    exam.isAchieved && "text-success",
                                    pending && "text-chart",
                                    rejected && "text-danger",
                                    locked && "text-text-disabled",
                                    !exam.isAchieved &&
                                        !pending &&
                                        !rejected &&
                                        !locked &&
                                        "text-text-secondary"
                                )}
                            >
                                {exam.isAchieved ? (
                                    <>
                                        <Check className="size-3.5" /> 완료
                                    </>
                                ) : pending ? (
                                    "심사 중"
                                ) : rejected ? (
                                    "반려"
                                ) : locked ? (
                                    "잠김"
                                ) : (
                                    "응시 가능"
                                )}
                            </span>
                            <ChevronDown
                                className={cn(
                                    "text-text-secondary size-5 shrink-0 transition-transform",
                                    selected && "rotate-180"
                                )}
                            />
                        </button>
                        {selected ? (
                            <div className="mt-3 flex flex-col gap-3">
                                {children}
                            </div>
                        ) : null}
                    </section>
                );
            })}
        </div>
    );
}
