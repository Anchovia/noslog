import { useTranslations } from "@/components/i18n/localeProvider";

export default function ExamBadge({
    mode,
    exam,
}: {
    mode: "basic" | "recital";
    exam: number | null;
}) {
    const t = useTranslations();
    if (!exam || exam < 1 || exam > 10) return null;
    const tier =
        exam === 1
            ? "peak"
            : exam === 2
              ? "top"
              : exam <= 4
                ? "high"
                : exam <= 7
                  ? "mid"
                  : "low";
    return (
        <span
            className="nl-exam-badge"
            role="img"
            data-tier={tier}
            aria-label={t("rankings.examBadge", {
                mode: mode === "basic" ? "Basic" : "Recital",
                exam,
            })}
        >
            <span className="nl-exam-badge__band" aria-hidden />
            <span className="nl-exam-badge__mode" aria-hidden>
                {mode === "basic" ? "B" : "R"}
            </span>
            <span aria-hidden>{t("rankings.examGrade", { exam })}</span>
        </span>
    );
}
