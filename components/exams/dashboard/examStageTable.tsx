import Link from "next/link";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

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

function StageRow({
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
    const rowClass = cn(
        "border-divider grid h-13 items-center gap-1 border-t px-3",
        showBest
            ? "grid-cols-[2.25rem_minmax(0,1fr)_5.5rem_5.5rem]"
            : "grid-cols-[2.25rem_minmax(0,1fr)_6.5rem]"
    );
    const content: ReactNode = (
        <>
            <span className="text-text-disabled text-xs">
                {getStageLabel(stage, index, length)}
            </span>
            <span className="min-w-0">
                <strong className="block truncate text-sm leading-4 font-semibold">
                    {stage.title}
                </strong>
                <span className="mt-1 flex min-w-0 items-center gap-1">
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
            </span>
            <span className="text-text-secondary text-right text-xs leading-3 tabular-nums">
                {stage.requirementType === "cumulative" && index > 0
                    ? index === length - 1
                        ? "총합 "
                        : "합계 "
                    : ""}
                {formatExamValue(stage.requiredValue, scoringType)}
            </span>
            {showBest ? (
                <span
                    className={cn(
                        "flex items-center justify-end gap-1.5 text-right text-xs tabular-nums",
                        stage.bestValue === null || stage.bestValue === 0
                            ? "text-text-disabled"
                            : stage.isPassed
                              ? "text-success"
                              : "text-danger"
                    )}
                >
                    {stage.bestValue === null ? (
                        "연동 미지원"
                    ) : stage.bestValue > 0 ? (
                        <>
                            <span>{stage.isPassed ? "✓" : "✕"}</span>
                            <span>
                                {formatExamValue(stage.bestValue, scoringType)}
                            </span>
                        </>
                    ) : (
                        "기록 없음"
                    )}
                </span>
            ) : null}
        </>
    );

    return firstChart ? (
        <Link
            href={`/music/${stage.musicIndex}/${firstChart.difficulty.toLowerCase()}`}
            className={`${rowClass} hover:bg-surface-muted focus-visible:ring-text-secondary/30 transition-colors focus-visible:ring-2 focus-visible:outline-none`}
        >
            {content}
        </Link>
    ) : (
        <div className={rowClass}>{content}</div>
    );
}

// 과제곡의 허용 난이도, 통과 조건과 내 기록을 표로 표시함
export default function ExamStageTable({
    stages,
    scoringType,
    showBest = true,
}: ExamStageTableProps) {
    return (
        <section className="bg-surface rounded-card overflow-hidden">
            <div
                className={cn(
                    "bg-surface-muted text-text-secondary grid h-7 items-center gap-1 px-3 text-xs font-semibold",
                    showBest
                        ? "grid-cols-[2.25rem_minmax(0,1fr)_5.5rem_5.5rem]"
                        : "grid-cols-[2.25rem_minmax(0,1fr)_6.5rem]"
                )}
            >
                <span />
                <span>과제곡</span>
                <span className="text-right">통과 조건</span>
                {showBest ? (
                    <span className="text-right">내 베스트</span>
                ) : null}
            </div>
            {stages.map((stage, index) => (
                <StageRow
                    key={stage.id}
                    stage={stage}
                    index={index}
                    length={stages.length}
                    scoringType={scoringType}
                    showBest={showBest}
                />
            ))}
        </section>
    );
}
