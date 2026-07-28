import Link from "next/link";

import { formatNoteSuccessRate } from "@/lib/music/judgementStats";
import { cn, formatToComma } from "@/lib/utils";

import type { ExamStageResult } from "./examDashboardTypes";
import {
    formatExamValue,
    getDifficultyBadge,
    getStageLabel,
} from "./examDashboardUtils";

interface ExamStageTableProps {
    stages: ExamStageResult[];
    scoringType: string;
    showBest?: boolean;
}

function getRecordBadge(stage: ExamStageResult) {
    const record = stage.bestRecord;
    if (!record) return null;
    if (record.score >= 1_000_000 || record.fcType === 3) return "Pianist";
    if (record.fcType >= 2) return "FC";
    return record.rank;
}

function StageCard({
    stage,
    index,
    length,
    scoringType,
    showBest,
}: {
    stage: ExamStageResult;
    index: number;
    length: number;
    scoringType: string;
    showBest: boolean;
}) {
    const firstChart = stage.charts[0];
    const record = stage.bestRecord;
    const missNear =
        record?.judgeMiss !== null &&
        record?.judgeMiss !== undefined &&
        record.judgeNear !== null
            ? record.judgeMiss + record.judgeNear
            : null;
    const recordBadge = getRecordBadge(stage);
    const content = (
        <article className="bg-surface hover:bg-surface-muted rounded-card p-3 transition-colors">
            <header className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2">
                    <span className="text-caption shrink-0 font-semibold">
                        {getStageLabel(stage, index, length)}
                    </span>
                    <span className="flex min-w-0 items-center gap-1">
                        {stage.charts.map((chart) => (
                            <span
                                key={chart.chartId}
                                className={cn(
                                    "flex h-5 min-w-5 shrink-0 items-center justify-center rounded px-1 text-[10px] leading-none font-bold",
                                    getDifficultyBadge(chart.difficulty)
                                )}
                                title={`${chart.difficulty} ${chart.level}`}
                            >
                                {chart.level}
                            </span>
                        ))}
                    </span>
                </div>
                {showBest ? (
                    <span
                        className={cn(
                            "text-xs font-semibold",
                            stage.isPassed
                                ? "text-success"
                                : "text-text-disabled"
                        )}
                    >
                        {stage.isPassed ? "누적 통과" : "점수 부족"}
                    </span>
                ) : null}
            </header>

            <h3 className="text-body mt-2 truncate font-semibold">
                {stage.title}
            </h3>
            {stage.artist ? (
                <p className="text-caption mt-0.5 truncate">{stage.artist}</p>
            ) : null}

            {showBest ? (
                <>
                    <dl className="mt-3 grid grid-cols-2 gap-2">
                        <div className="bg-bg rounded-md px-3 py-2">
                            <dt className="text-micro">연습 기준</dt>
                            <dd className="text-label mt-0.5 tabular-nums">
                                {formatExamValue(
                                    stage.individualTargetValue,
                                    scoringType
                                )}
                            </dd>
                        </div>
                        <div className="bg-bg rounded-md px-3 py-2">
                            <dt className="text-micro">내 베스트</dt>
                            <dd
                                className={cn(
                                    "text-label mt-0.5 tabular-nums",
                                    !stage.bestValue && "text-text-disabled"
                                )}
                            >
                                {stage.bestValue
                                    ? formatExamValue(
                                          stage.bestValue,
                                          scoringType
                                      )
                                    : "기록 없음"}
                            </dd>
                        </div>
                    </dl>
                    <div className="text-caption mt-2 flex flex-wrap items-center gap-x-2 gap-y-1">
                        {stage.individualGapValue > 0 ? (
                            <span className="text-score tabular-nums">
                                연습 기준까지{" "}
                                {formatToComma(stage.individualGapValue)}점
                            </span>
                        ) : (
                            <span className="text-success">연습 기준 달성</span>
                        )}
                        {recordBadge ? <span>{recordBadge}</span> : null}
                        {record ? (
                            <span className="tabular-nums">
                                최대 콤보{" "}
                                {record.maxCombo.toLocaleString("ko-KR")}
                            </span>
                        ) : null}
                        {missNear !== null ? (
                            <span className="tabular-nums">
                                Miss/Near {missNear.toLocaleString("ko-KR")}
                            </span>
                        ) : null}
                    </div>
                    {stage.weakestNote && stage.weakestNote.rate < 9000 ? (
                        <p className="text-caption mt-1">
                            약한 음표{" "}
                            <strong className="text-text-primary">
                                {stage.weakestNote.label}{" "}
                                {formatNoteSuccessRate(stage.weakestNote.rate)}
                            </strong>
                        </p>
                    ) : null}
                    {stage.requirementType === "cumulative" ? (
                        <p className="text-micro mt-2 tabular-nums">
                            현재 누적{" "}
                            {formatExamValue(
                                stage.comparisonValue,
                                scoringType
                            )}{" "}
                            / 통과{" "}
                            {formatExamValue(stage.requiredValue, scoringType)}
                        </p>
                    ) : null}
                </>
            ) : (
                <p className="text-caption mt-2 tabular-nums">
                    통과 조건{" "}
                    {formatExamValue(stage.requiredValue, scoringType)}
                </p>
            )}
        </article>
    );

    return firstChart ? (
        <Link
            href={`/music/${stage.musicIndex}/${firstChart.difficulty.toLowerCase()}`}
            className="focus-visible:ring-focus/40 rounded-card focus-visible:ring-2 focus-visible:outline-none"
        >
            {content}
        </Link>
    ) : (
        content
    );
}

// 과제곡별 권장 점수, 현재 기록과 판정 약점을 모바일 카드로 표시함
export default function ExamStageTable({
    stages,
    scoringType,
    showBest = true,
}: ExamStageTableProps) {
    return (
        <section>
            <div className="mb-2 flex items-center justify-between">
                <h2 className="text-section">과제곡</h2>
                <span className="text-caption">
                    {stages.length}곡 ·{" "}
                    {showBest ? "누적 합격선 기준" : "공식 조건"}
                </span>
            </div>
            <div className="flex flex-col gap-2">
                {stages.map((stage, index) => (
                    <StageCard
                        key={stage.id}
                        stage={stage}
                        index={index}
                        length={stages.length}
                        scoringType={scoringType}
                        showBest={showBest}
                    />
                ))}
            </div>
        </section>
    );
}
