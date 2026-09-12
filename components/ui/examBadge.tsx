import { useTranslations } from "@/components/i18n/localeProvider";
import { getExamTier, isExamGrade } from "@/features/exams/examGrades";

export { isExamGrade };

export default function ExamBadge({
    mode,
    exam,
}: {
    mode: "basic" | "recital";
    exam: number | null;
}) {
    const t = useTranslations();
    if (!isExamGrade(exam)) return null;
    const name = mode === "basic" ? "Basic" : "Recital";
    return (
        <span
            className="nl-exam-badge"
            role="img"
            data-mode={mode}
            data-tier={getExamTier(exam)}
            aria-label={t("rankings.examBadge", { mode: name, exam })}
        >
            {mode === "recital" ? (
                <>
                    <span
                        className="nl-exam-badge__arc nl-exam-badge__arc--inner"
                        aria-hidden
                    />
                    <span
                        className="nl-exam-badge__arc nl-exam-badge__arc--outer"
                        aria-hidden
                    />
                </>
            ) : null}
            <span className="nl-exam-badge__mode" aria-hidden>
                <span className="nl-exam-badge__full">
                    {name.toUpperCase()}
                </span>
                <span className="nl-exam-badge__short">{name[0]}</span>
            </span>
            <span className="nl-exam-badge__divider" aria-hidden />
            <span className="nl-exam-badge__grade" aria-hidden>
                {t("rankings.examGrade", { exam })}
            </span>
        </span>
    );
}
