import { cn, formatToComma } from "@/lib/utils";
import { Play, ScanSearch } from "lucide-react";
import Link from "next/link";
import type { ChartDetail, Difficulty } from "./musicDetailTypes";
import PatternProfileChart from "./patternProfileChart";

interface MusicInfoTabProps {
    musicIndex: string;
    difficulty: Difficulty;
    chartDetail: ChartDetail;
}

export default function MusicInfoTab({
    musicIndex,
    difficulty,
    chartDetail,
}: MusicInfoTabProps) {
    const bpm =
        chartDetail.bpm_min === null
            ? "-"
            : chartDetail.bpm_max !== null &&
                chartDetail.bpm_max !== chartDetail.bpm_min
              ? `${chartDetail.bpm_min}-${chartDetail.bpm_max}`
              : String(chartDetail.bpm_min);
    const duration =
        chartDetail.duration_seconds === null
            ? "-"
            : `${Math.floor(chartDetail.duration_seconds / 60)}:${String(
                  chartDetail.duration_seconds % 60
              ).padStart(2, "0")}`;
    const releasedAt = chartDetail.released_at
        ? chartDetail.released_at.slice(0, 10).replaceAll("-", ".")
        : "-";
    const maxDistributionCount = Math.max(
        1,
        ...chartDetail.scoreDistribution.map((item) => item.count)
    );

    return (
        <div className="flex flex-col gap-3">
            <dl className="bg-surface rounded-card overflow-hidden text-sm">
                {[
                    ["BPM", bpm],
                    [
                        "노트 수",
                        chartDetail.note_count === null
                            ? "-"
                            : formatToComma(chartDetail.note_count),
                    ],
                    ["곡 길이", duration],
                    ["수록일", releasedAt],
                    ["언락 조건", chartDetail.unlock_condition || "-"],
                ].map(([label, value]) => (
                    <div
                        key={label}
                        className="border-divider flex min-h-10 items-center justify-between gap-4 border-t px-4 first:border-t-0"
                    >
                        <dt className="text-text-secondary shrink-0">
                            {label}
                        </dt>
                        <dd className="text-text-primary min-w-0 text-right">
                            {value}
                        </dd>
                    </div>
                ))}
            </dl>

            <section className="bg-surface rounded-card p-4">
                <header className="flex items-center justify-between gap-3">
                    <h2 className="text-section">패턴 경향</h2>
                    <span className="text-caption">
                        {difficulty} · 투표 {chartDetail.evaluationCount}
                    </span>
                </header>

                {chartDetail.evaluationCount > 0 ? (
                    <div className="mt-2 flex items-center gap-3">
                        <PatternProfileChart
                            values={chartDetail.patternAverages}
                        />
                        <dl className="flex w-1/2 flex-col gap-2">
                            {[
                                ["계단", chartDetail.patternAverages.stairs],
                                [
                                    "연타",
                                    chartDetail.patternAverages.repetition,
                                ],
                                ["폴리리듬", chartDetail.patternAverages.chord],
                                ["즈레", chartDetail.patternAverages.trill],
                                [
                                    "글리산도",
                                    chartDetail.patternAverages.glissando,
                                ],
                            ].map(([label, value]) => (
                                <div
                                    key={label}
                                    className="flex items-center gap-2 text-xs"
                                >
                                    <dt className="text-text-secondary w-14 shrink-0">
                                        {label}
                                    </dt>
                                    <div className="bg-surface-muted h-1.5 min-w-0 flex-1 overflow-hidden rounded-full">
                                        <div
                                            className="bg-chart h-full rounded-full"
                                            style={{
                                                width: `${(Number(value) / 4) * 100}%`,
                                            }}
                                        />
                                    </div>
                                    <dd className="text-text-primary w-6 text-right tabular-nums">
                                        {Number(value).toFixed(1)}
                                    </dd>
                                </div>
                            ))}
                        </dl>
                    </div>
                ) : (
                    <div className="text-text-disabled flex h-32 items-center justify-center text-sm">
                        아직 등록된 패턴 투표가 없습니다.
                    </div>
                )}

                <Link
                    href={`/music/${musicIndex}/${difficulty.toLowerCase()}?tab=tier`}
                    className="text-text-secondary mt-2 block text-right text-xs font-semibold"
                >
                    패턴 투표 →
                </Link>
            </section>

            <section className="bg-surface rounded-card p-4">
                <header className="flex items-center justify-between gap-3">
                    <h2 className="text-section">점수 분포</h2>
                    <span className="text-caption">
                        {difficulty} · 전체 {chartDetail.playerCount}명
                    </span>
                </header>

                {chartDetail.playerCount > 0 ? (
                    <>
                        <div className="mt-4 grid h-20 grid-cols-7 items-end gap-1">
                            {chartDetail.scoreDistribution.map((item) => (
                                <div
                                    key={item.key}
                                    className="flex h-full min-w-0 flex-col justify-end"
                                >
                                    <div
                                        className={cn(
                                            "mx-auto w-full max-w-10 rounded-t-sm",
                                            item.key === "pianist"
                                                ? "bg-score"
                                                : item.key === "990"
                                                  ? "bg-real"
                                                  : "bg-border"
                                        )}
                                        style={{
                                            height:
                                                item.count === 0
                                                    ? 0
                                                    : `${Math.max(4, (item.count / maxDistributionCount) * 56)}px`,
                                        }}
                                        title={`${item.label}: ${item.count}명`}
                                    />
                                    <span
                                        className={cn(
                                            "text-caption mt-1 truncate text-center",
                                            item.key === "pianist"
                                                ? "text-score"
                                                : "text-text-disabled"
                                        )}
                                    >
                                        {item.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <p className="text-caption mt-3">
                            {chartDetail.userTopPercent === null
                                ? "로그인 후 내 위치를 확인할 수 있습니다."
                                : `내 기록 기준 상위 ${chartDetail.userTopPercent}%`}
                        </p>
                    </>
                ) : (
                    <div className="text-text-disabled flex h-24 items-center justify-center text-sm">
                        집계할 플레이 기록이 없습니다.
                    </div>
                )}
            </section>

            <div className="grid grid-cols-2 gap-2">
                {chartDetail.play_video_url ? (
                    <a
                        href={chartDetail.play_video_url}
                        target="_blank"
                        rel="noreferrer"
                        className="border-border rounded-card flex h-10 items-center justify-center gap-2 border text-sm font-semibold"
                    >
                        <Play size={15} aria-hidden /> 플레이 영상
                    </a>
                ) : (
                    <span className="border-border text-text-disabled rounded-card flex h-10 items-center justify-center gap-2 border text-sm font-semibold opacity-60">
                        <Play size={15} aria-hidden /> 플레이 영상
                    </span>
                )}
                {chartDetail.chart_preview_url ? (
                    <a
                        href={chartDetail.chart_preview_url}
                        target="_blank"
                        rel="noreferrer"
                        className="border-border rounded-card flex h-10 items-center justify-center gap-2 border text-sm font-semibold"
                    >
                        <ScanSearch size={15} aria-hidden /> 채보 프리뷰
                    </a>
                ) : (
                    <span className="border-border text-text-disabled rounded-card flex h-10 items-center justify-center gap-2 border text-sm font-semibold opacity-60">
                        <ScanSearch size={15} aria-hidden /> 채보 프리뷰
                    </span>
                )}
            </div>
        </div>
    );
}
