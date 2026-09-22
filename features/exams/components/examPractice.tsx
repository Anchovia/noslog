"use client";

import { Target } from "lucide-react";
import { useTranslations, useLocale } from "@/components/i18n/localeProvider";
import type { ExamDashboardItem } from "@/components/exams/dashboard/examDashboardTypes";
import { getStageLabel } from "@/components/exams/dashboard/examDashboardUtils";
import { getExamPractice } from "@/features/exams/examPractice";

/**
 * 합격까지(2026-09-22 P2-a) — 내 베스트를 곡별 조각(차트 범주 색 1 · 2 · 3)으로 쌓은 막대 위에
 * 공식 합격선 눈금(1차 · 2차 · 합격)을 긋는다. 색만으로 구분하지 않게 아래에 「색 · 곡 · 점수」 범례를 늘 둔다
 */
export default function ExamPractice({ exam }: { exam: ExamDashboardItem }) {
    const t = useTranslations();
    const locale = useLocale();
    const practice = getExamPractice(exam.stages);
    const target = exam.stages.at(-1)?.requiredValue ?? 0;
    const scale = Math.max(target, practice.availableTotal) || 1;
    const complete = practice.missingCount === 0;
    const remaining = Math.max(0, target - practice.availableTotal);
    const percent = (value: number) => `${(value / scale) * 100}%`;
    const ticks = exam.stages
        .map((stage, index) => ({ stage, index }))
        .filter(
            ({ stage, index }) =>
                index === 0 || stage.requirementType === "cumulative"
        );
    const priority = practice.rows
        .map((row, index) => ({ row, index }))
        .filter(({ row }) => row.gap !== null && row.gap > 0)
        .sort((a, b) => (b.row.gap ?? 0) - (a.row.gap ?? 0))[0];
    const segments = exam.stages.reduce<
        { id: number; series: number; left: number; value: number }[]
    >((list, stage, index) => {
        if (stage.bestValue === null) return list;
        const last = list.at(-1);
        return [
            ...list,
            {
                id: stage.id,
                series: (index % 5) + 1,
                left: last ? last.left + last.value : 0,
                value: stage.bestValue,
            },
        ];
    }, []);
    return (
        <section
            className="nl-exam-practice"
            aria-labelledby="exam-practice-title"
        >
            <div className="nl-exam-practice__head">
                <h3 id="exam-practice-title" className="nl-component-title">
                    {!complete
                        ? t("exams.progress.title")
                        : remaining > 0
                          ? t("exams.progress.remaining", {
                                value: remaining.toLocaleString(locale),
                            })
                          : t("exams.progress.reached")}
                </h3>
                <span className="nl-metadata nl-muted">
                    {t("exams.progress.basis")}
                </span>
            </div>
            <div className="nl-exam-progress" aria-hidden>
                <div className="nl-exam-progress__track">
                    {segments.map((segment) => (
                        <span
                            key={segment.id}
                            className="nl-exam-progress__segment"
                            data-series={segment.series}
                            style={{
                                left: percent(segment.left),
                                width: percent(segment.value),
                            }}
                        />
                    ))}
                </div>
                {ticks.map(({ stage }) => (
                    <span
                        key={stage.id}
                        className="nl-exam-progress__tick"
                        style={{ left: percent(stage.requiredValue) }}
                    />
                ))}
            </div>
            <ol
                className="nl-exam-progress__labels"
                aria-label={t("exams.progress.lines")}
            >
                {ticks.map(({ stage, index }) => (
                    <li
                        key={stage.id}
                        className="nl-metadata nl-muted"
                        style={{ left: percent(stage.requiredValue) }}
                    >
                        <span>
                            {index === exam.stages.length - 1
                                ? t("exams.progress.pass")
                                : t("exams.progress.line", {
                                      count: index + 1,
                                  })}
                        </span>
                        <span className="nl-metric-value">
                            {stage.requiredValue.toLocaleString(locale)}
                        </span>
                    </li>
                ))}
            </ol>
            <ul className="nl-exam-progress__legend">
                {exam.stages.map((stage, index) => (
                    <li key={stage.id} className="nl-metadata nl-muted">
                        <span
                            className="nl-exam-progress__swatch"
                            data-series={(index % 5) + 1}
                            aria-hidden
                        />
                        {getStageLabel(stage, index, exam.stages.length)}
                        <span className="nl-metric-value">
                            {stage.bestValue === null
                                ? t("exams.stage.noRecord")
                                : stage.bestValue.toLocaleString(locale)}
                        </span>
                    </li>
                ))}
            </ul>
            {priority && !(complete && remaining === 0) ? (
                <p className="nl-exam-practice__priority nl-metadata nl-muted">
                    <Target className="nl-icon-small" aria-hidden />
                    {t("exams.simulation.practiceFirst", {
                        stage: `${getStageLabel(
                            exam.stages[priority.index],
                            priority.index,
                            exam.stages.length
                        )} ${exam.stages[priority.index].title}`,
                    })}{" "}
                    ·{" "}
                    {t("exams.stage.gap", {
                        value: (priority.row.gap ?? 0).toLocaleString(locale),
                    })}
                </p>
            ) : null}
            {practice.missingCount > 0 ? (
                <p className="nl-metadata nl-muted">
                    {t("exams.practice.partial")}
                </p>
            ) : null}
            <p className="nl-metadata nl-muted">
                {t("exams.practice.limitation")}
            </p>
        </section>
    );
}
