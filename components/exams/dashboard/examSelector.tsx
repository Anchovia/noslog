import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

import type { ExamDashboardItem } from "./examDashboardTypes";
import { canEnterExam, getModeText } from "./examDashboardUtils";

interface ExamSelectorProps {
    exams: ExamDashboardItem[];
    selectedExamId: number | undefined;
    onChange: (examId: number) => void;
}

// 현재 모드의 검정 선택 상태를 한곳에서 관리함
export default function ExamSelector({
    exams,
    selectedExamId,
    onChange,
}: ExamSelectorProps) {
    return (
        <div className="flex h-14 items-center gap-1.5 overflow-x-auto">
            {exams.map((exam) => {
                const selected = selectedExamId === exam.id;
                const locked = !exam.isAchieved && !canEnterExam(exam);

                return (
                    <button
                        key={exam.id}
                        type="button"
                        onClick={() => onChange(exam.id)}
                        className={cn(
                            "bg-surface flex h-12 max-w-24 min-w-11 shrink-0 flex-col items-center justify-center rounded-lg px-2 font-bold",
                            selected && "ring-text-primary ring-2",
                            !selected && getModeText(exam.mode),
                            !selected && locked && "opacity-35"
                        )}
                    >
                        <span className="max-w-full truncate text-xs">
                            {exam.shortLabel}
                        </span>
                        <span
                            className={cn(
                                "mt-0.5 flex items-center gap-0.5 text-[10px] leading-none font-normal",
                                exam.isAchieved && "text-success",
                                locked && "text-danger",
                                !exam.isAchieved &&
                                    !locked &&
                                    "text-text-secondary"
                            )}
                        >
                            {exam.isAchieved ? (
                                <>
                                    <Check className="size-3" /> 완료
                                </>
                            ) : locked ? (
                                "잠김"
                            ) : (
                                "가능"
                            )}
                        </span>
                    </button>
                );
            })}
        </div>
    );
}
