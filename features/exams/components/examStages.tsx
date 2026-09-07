"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { useLocale, useTranslations } from "@/components/i18n/localeProvider";
import MusicJacket from "@/components/music/musicJacket";
import ModalDialog from "@/components/ui/modalDialog";
import type {
    ExamDashboardItem,
    ExamStageItem,
} from "@/components/exams/dashboard/examDashboardTypes";
import { getStageLabel } from "@/components/exams/dashboard/examDashboardUtils";
import { localizePath } from "@/lib/i18n/routing";

function StageRow({
    stage,
    index,
    exam,
}: {
    stage: ExamStageItem;
    index: number;
    exam: ExamDashboardItem;
}) {
    const locale = useLocale();
    const t = useTranslations();
    const [open, setOpen] = useState(false);
    const trigger = useRef<HTMLButtonElement>(null);
    const scope =
        stage.requirementType !== "cumulative"
            ? t("exams.scope.single")
            : index === exam.stages.length - 1
              ? t("exams.scope.total", { count: index + 1 })
              : t("exams.scope.cumulative", {
                    stages: exam.stages
                        .slice(0, index + 1)
                        .map((item, i) =>
                            getStageLabel(item, i, exam.stages.length)
                        )
                        .join("+"),
                });
    const chartHref = (difficulty: string) =>
        localizePath(
            `/music/${stage.musicIndex}/${difficulty.toLowerCase()}`,
            locale
        );
    const content = (
        <>
            <MusicJacket
                index={stage.musicIndex}
                background={null}
                title={stage.title}
                appearance="foundation"
                className="nl-exam-stage__jacket"
                fallback={<span />}
            />
            <span className="nl-exam-stage__identity">
                <span className="nl-exam-stage__head">
                    <span className="nl-metadata nl-muted">
                        {getStageLabel(stage, index, exam.stages.length)}
                    </span>
                    <span className="nl-exam-stage__charts">
                        {stage.charts.map((chart) => (
                            <span
                                className={`nl-metric-value nl-level--${chart.difficulty.toLowerCase()}`}
                                key={chart.chartId}
                            >
                                {chart.difficulty} {chart.level}
                            </span>
                        ))}
                    </span>
                </span>
                <span className="nl-entity-title">{stage.title}</span>
                {exam.mode === "recital" && stage.artist ? (
                    <span className="nl-metadata nl-muted">{stage.artist}</span>
                ) : null}
            </span>
            <span className="nl-exam-stage__condition">
                <span className="nl-metadata nl-muted">{scope}</span>
                <span className="nl-metric-value">
                    {stage.requiredValue.toLocaleString(locale)}
                </span>
            </span>
        </>
    );
    return (
        <li className="nl-exam-stage">
            {stage.charts.length === 1 ? (
                <Link
                    className="nl-exam-stage__row"
                    href={chartHref(stage.charts[0].difficulty)}
                >
                    {content}
                </Link>
            ) : stage.charts.length > 1 ? (
                <button
                    className="nl-exam-stage__row"
                    ref={trigger}
                    type="button"
                    onClick={() => setOpen(true)}
                    aria-haspopup="dialog"
                >
                    {content}
                </button>
            ) : (
                <div className="nl-exam-stage__row">{content}</div>
            )}
            <ModalDialog
                open={open}
                onOpenChange={setOpen}
                title={t("exams.chooseChart")}
                description={stage.title}
                onCloseAutoFocus={(event) => {
                    event.preventDefault();
                    trigger.current?.focus();
                }}
            >
                <ul className="nl-exam-chart-options">
                    {stage.charts.map((chart) => (
                        <li key={chart.chartId}>
                            <Link
                                className="nl-button nl-button--secondary"
                                href={chartHref(chart.difficulty)}
                            >
                                {chart.difficulty} {chart.level}
                            </Link>
                        </li>
                    ))}
                </ul>
            </ModalDialog>
        </li>
    );
}

export default function ExamStages({ exam }: { exam: ExamDashboardItem }) {
    const t = useTranslations();
    return (
        <section className="nl-exam-stages" aria-labelledby="exam-stages-title">
            <h3 id="exam-stages-title" className="nl-section-title">
                {t("exams.stage.title")}
            </h3>
            <ol>
                {exam.stages.map((stage, index) => (
                    <StageRow
                        key={stage.id}
                        stage={stage}
                        index={index}
                        exam={exam}
                    />
                ))}
            </ol>
        </section>
    );
}
