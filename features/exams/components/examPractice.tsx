"use client";

import { useTranslations, useLocale } from "@/components/i18n/localeProvider";
import Disclosure from "@/components/ui/disclosure";
import type { ExamDashboardItem } from "@/components/exams/dashboard/examDashboardTypes";
import { getStageLabel } from "@/components/exams/dashboard/examDashboardUtils";
import { getExamPractice } from "@/features/exams/examPractice";

export default function ExamPractice({
    exam,
    open,
    onOpenChange,
}: {
    exam: ExamDashboardItem;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    const t = useTranslations();
    const locale = useLocale();
    const practice = getExamPractice(exam.stages);
    const target = exam.stages.at(-1)?.requiredValue;
    return (
        <Disclosure
            className="nl-exam-practice"
            title={t("exams.practice.title")}
            open={open}
            onToggle={(event) => onOpenChange(event.currentTarget.open)}
        >
            <p className="nl-body-secondary nl-muted">
                {t("exams.practice.limitation")}
            </p>
            <dl className="nl-exam-practice__rows">
                {practice.rows.map((row, index) => (
                    <div key={row.id}>
                        <dt className="nl-metadata nl-muted">
                            {getStageLabel(
                                exam.stages[index],
                                index,
                                exam.stages.length
                            )}
                        </dt>
                        <dd className="nl-body-secondary">
                            {row.best === null
                                ? t("exams.stage.noRecord")
                                : `${t("exams.stage.myBest")} ${row.best.toLocaleString(locale)}`}
                        </dd>
                        {row.gap !== null ? (
                            <dd className="nl-metadata nl-muted">
                                {row.gap === 0
                                    ? t("exams.stage.targetMet")
                                    : t("exams.stage.gap", {
                                          value: row.gap.toLocaleString(locale),
                                      })}
                            </dd>
                        ) : null}
                    </div>
                ))}
            </dl>
            {practice.missingCount > 0 ? (
                <p className="nl-metadata nl-muted">
                    {t("exams.practice.partial")}
                </p>
            ) : null}
            <p className="nl-exam-practice__total nl-body-secondary">
                <span>{t("exams.practice.total")}</span>
                <span>
                    {practice.missingCount === exam.stages.length
                        ? t("exams.stage.noRecord")
                        : practice.availableTotal.toLocaleString(locale)}
                    {target !== undefined
                        ? ` / ${target.toLocaleString(locale)}`
                        : ""}
                </span>
            </p>
        </Disclosure>
    );
}
