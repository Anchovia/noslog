"use client";

import { CircleCheck, CircleX } from "lucide-react";
import Link from "next/link";
import { Fragment, useRef, useState } from "react";
import { useLocale, useTranslations } from "@/components/i18n/localeProvider";
import MusicJacket from "@/components/music/musicJacket";
import ModalDialog from "@/components/ui/modalDialog";
import type {
    ExamDashboardItem,
    ExamStageItem,
} from "@/components/exams/dashboard/examDashboardTypes";
import { getStageLabel } from "@/components/exams/dashboard/examDashboardUtils";
import { getExamPractice } from "@/features/exams/examPractice";
import { localizePath } from "@/lib/i18n/routing";

function StageRow({
    stage,
    index,
    exam,
    personal,
}: {
    stage: ExamStageItem;
    index: number;
    exam: ExamDashboardItem;
    personal: boolean;
}) {
    const locale = useLocale();
    const t = useTranslations();
    const [open, setOpen] = useState(false);
    const trigger = useRef<HTMLButtonElement>(null);
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
            {personal ? (
                <span className="nl-exam-stage__condition">
                    <span className="nl-metadata nl-muted">
                        {t("exams.stage.myBest")}
                    </span>
                    <span className="nl-metric-value">
                        {stage.bestValue === null
                            ? t("exams.stage.noRecord")
                            : stage.bestValue.toLocaleString(locale)}
                    </span>
                </span>
            ) : null}
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

/**
 * 통과선 줄(2026-09-22 T7) — 곡 카드 사이에 공식 합격선(이 곡 · 누적)과, 내 기록이 있으면 여유(±).
 * 누적은 앞 곡 기록이 모두 있어야 비교한다(미플레이는 0점이 아님). ± 는 부호 + ✓/✗ 아이콘 — 색만으로 알리지 않는다
 */
function PassLine({
    stage,
    index,
    exam,
    comparison,
}: {
    stage: ExamStageItem;
    index: number;
    exam: ExamDashboardItem;
    comparison: number | null;
}) {
    const locale = useLocale();
    const t = useTranslations();
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
    const margin =
        comparison === null ? null : comparison - stage.requiredValue;
    const amount =
        margin === null ? "" : Math.abs(margin).toLocaleString(locale);
    return (
        <li className="nl-exam-passline">
            <span className="nl-exam-passline__mark">
                {margin === null ? null : margin >= 0 ? (
                    <CircleCheck
                        className="nl-icon-small"
                        data-tone="success"
                        aria-hidden
                    />
                ) : (
                    <CircleX
                        className="nl-icon-small"
                        data-tone="danger"
                        aria-hidden
                    />
                )}
            </span>
            <span className="nl-metadata nl-muted">
                {scope} {stage.requiredValue.toLocaleString(locale)}
            </span>
            {margin === null ? null : (
                <span
                    className="nl-metric-value"
                    aria-label={t(
                        margin >= 0
                            ? "exams.margin.ahead"
                            : "exams.margin.behind",
                        { value: amount }
                    )}
                >
                    {margin >= 0 ? "+" : "−"}
                    {amount}
                </span>
            )}
        </li>
    );
}

export default function ExamStages({
    exam,
    personal = false,
}: {
    exam: ExamDashboardItem;
    /** 내 베스트 · 여유를 보일지 — 로그인한 점수형(Basic · 이벤트) 검정만 */
    personal?: boolean;
}) {
    const t = useTranslations();
    const practice = personal ? getExamPractice(exam.stages) : null;
    return (
        <section className="nl-exam-stages" aria-labelledby="exam-stages-title">
            <h3 id="exam-stages-title" className="nl-section-title">
                {t("exams.stage.title")}
            </h3>
            <ol>
                {exam.stages.map((stage, index) => (
                    <Fragment key={stage.id}>
                        <StageRow
                            stage={stage}
                            index={index}
                            exam={exam}
                            personal={personal}
                        />
                        <PassLine
                            stage={stage}
                            index={index}
                            exam={exam}
                            comparison={
                                practice?.rows[index]?.comparison ?? null
                            }
                        />
                    </Fragment>
                ))}
            </ol>
        </section>
    );
}
