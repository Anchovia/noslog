import { ChevronDown } from "lucide-react";
import type { ReactNode } from "react";

import type { ExamDashboardItem } from "./examDashboardTypes";
import { canEnterExam } from "./examDashboardUtils";

interface ExamSelectorProps {
    exams: ExamDashboardItem[];
    selectedExamId: number | null;
    onChange: (examId: number) => void;
    children: ReactNode;
}

function getExamStatus(exam: ExamDashboardItem) {
    if (exam.isAchieved) return "완료";
    if (exam.submissionStatus === "pending") return "심사 중";
    if (exam.submissionStatus === "rejected") return "반려";
    if (!canEnterExam(exam)) return "잠김";
    return "응시 가능";
}

// 한 번에 하나의 검정을 명확하게 선택하고 상세 영역을 이어서 표시함
export default function ExamSelector({
    exams,
    selectedExamId,
    onChange,
    children,
}: ExamSelectorProps) {
    const selectedExam =
        exams.find((exam) => exam.id === selectedExamId) ?? exams[0];

    return (
        <div className="flex flex-col gap-3">
            <section className="bg-surface rounded-card p-3">
                <div className="mb-2 flex items-center justify-between gap-3">
                    <label
                        htmlFor="exam-selector"
                        className="text-label font-semibold"
                    >
                        검정 선택
                    </label>
                    {selectedExam ? (
                        <span className="text-caption">
                            {getExamStatus(selectedExam)}
                        </span>
                    ) : null}
                </div>
                <div className="relative">
                    <select
                        id="exam-selector"
                        value={selectedExamId ?? ""}
                        onChange={(event) =>
                            onChange(Number(event.target.value))
                        }
                        className="border-border bg-bg text-text-primary focus:border-focus h-11 w-full appearance-none rounded-md border px-3 pr-10 text-sm font-semibold outline-none"
                    >
                        {exams.map((exam) => (
                            <option key={exam.id} value={exam.id}>
                                {exam.shortLabel}
                            </option>
                        ))}
                    </select>
                    <ChevronDown className="text-text-secondary pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2" />
                </div>
            </section>
            {selectedExam ? (
                <div className="flex flex-col gap-3">{children}</div>
            ) : null}
        </div>
    );
}
