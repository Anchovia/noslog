import { ChevronDown } from "lucide-react";
import type { ReactNode } from "react";

import { useTranslations } from "@/components/i18n/localeProvider";
import type { MessageKey } from "@/lib/i18n/messages";
import type { ExamDashboardItem } from "./examDashboardTypes";
import { canEnterExam } from "./examDashboardUtils";

interface ExamSelectorProps {
    exams: ExamDashboardItem[];
    selectedExamId: number | null;
    onChange: (examId: number) => void;
    children: ReactNode;
}

function getExamStatusKey(exam: ExamDashboardItem): MessageKey {
    if (exam.isAchieved) return "exams.status.completed";
    if (exam.submissionStatus === "pending") return "exams.status.pending";
    if (exam.submissionStatus === "rejected") return "exams.status.rejected";
    if (!canEnterExam(exam)) return "exams.status.locked";
    return "exams.status.available";
}

// 한 번에 하나의 검정을 명확하게 선택하고 상세 영역을 이어서 표시함
export default function ExamSelector({
    exams,
    selectedExamId,
    onChange,
    children,
}: ExamSelectorProps) {
    const t = useTranslations();
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
                        {t("exams.select")}
                    </label>
                    {selectedExam ? (
                        <span className="text-caption">
                            {t(getExamStatusKey(selectedExam))}
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
