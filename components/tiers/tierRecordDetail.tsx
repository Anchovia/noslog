import { ChevronRight } from "lucide-react";
import Link from "next/link";

import {
    formatMetricPercentage,
    formatNoteSuccessRate,
    getJudgementPercentage,
    getJudgementTotal,
} from "@/lib/music/judgementStats";
import type { PublicTierBandEntry, TierRecord } from "@/lib/tiers";
import { cn, formatToComma } from "@/lib/utils";

interface TierRecordDetailProps {
    entry: PublicTierBandEntry;
    panelId: string;
}

const noteRows = [
    { key: "note_rate_standard", label: "일반" },
    { key: "note_rate_tenuto", label: "테누토" },
    { key: "note_rate_glissando", label: "글리산도" },
    { key: "note_rate_trill", label: "트릴" },
] as const;

function getClearRate(record: TierRecord) {
    if (
        !record.play_count ||
        record.clear_count === null ||
        record.clear_count === undefined
    ) {
        return null;
    }
    return ((record.clear_count ?? 0) / record.play_count) * 100;
}

function getTimingBias(record: TierRecord) {
    const fast = record.latestPlay?.fast_count;
    const slow = record.latestPlay?.slow_count;
    if (
        fast === null ||
        fast === undefined ||
        slow === null ||
        slow === undefined
    ) {
        return null;
    }
    if (fast === slow) return { label: "균형", value: 0 };
    return fast > slow
        ? { label: "FAST", value: fast - slow }
        : { label: "SLOW", value: slow - fast };
}

export default function TierRecordDetail({
    entry,
    panelId,
}: TierRecordDetailProps) {
    const record = entry.record;
    const detailHref = `/music/${entry.chart.music.index}/${entry.chart.difficulty.toLowerCase()}?tab=record`;

    if (!record || record.score <= 0) {
        return (
            <section
                id={panelId}
                aria-label={`${entry.chart.music.title} 내 기록 상세`}
                className="bg-surface-muted border-border col-span-3 rounded-md border p-3"
            >
                <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                        <h3 className="text-label truncate">
                            {entry.chart.music.title}
                        </h3>
                        <p className="text-caption mt-1">
                            아직 연동된 플레이 기록이 없습니다.
                        </p>
                    </div>
                    <Link
                        href={detailHref}
                        className="text-caption text-text-secondary focus-visible:ring-focus flex min-h-11 shrink-0 items-center gap-0.5 rounded-sm px-1 font-semibold focus-visible:ring-2 focus-visible:outline-none"
                    >
                        악곡 보기
                        <ChevronRight aria-hidden className="size-4" />
                    </Link>
                </div>
            </section>
        );
    }

    const judgementCounts = {
        judge_sjust: record.judge_sjust ?? null,
        judge_just: record.judge_just ?? null,
        judge_good: record.judge_good ?? null,
        judge_miss: record.judge_miss ?? null,
        judge_near: record.judge_near ?? null,
    };
    const judgementTotal = getJudgementTotal(judgementCounts);
    const sjustRate = getJudgementPercentage(
        judgementCounts.judge_sjust,
        judgementTotal
    );
    const missNear =
        record.judge_miss === undefined || record.judge_near === undefined
            ? null
            : (record.judge_miss ?? 0) + (record.judge_near ?? 0);
    const clearRate = getClearRate(record);
    const timingBias = getTimingBias(record);

    const stats = [
        {
            label: "플레이",
            value:
                record.play_count === undefined
                    ? "-"
                    : formatToComma(record.play_count),
            sub:
                clearRate === null
                    ? "클리어 -"
                    : `클리어 ${formatMetricPercentage(clearRate)}`,
        },
        {
            label: "최대 콤보",
            value:
                record.max_combo === undefined
                    ? "-"
                    : formatToComma(record.max_combo),
            sub: null,
        },
        {
            label: "풀콤보",
            value:
                record.fullcombo_count === undefined
                    ? "-"
                    : formatToComma(record.fullcombo_count),
            sub: null,
        },
        {
            label: "Pianist",
            value:
                record.pianistic_count === undefined
                    ? "-"
                    : formatToComma(record.pianistic_count),
            sub: null,
        },
    ];

    return (
        <section
            id={panelId}
            aria-label={`${entry.chart.music.title} 내 기록 상세`}
            className="bg-surface-muted border-border col-span-3 rounded-md border p-3"
        >
            <header className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <p className="text-micro">내 기록 상세</p>
                    <h3 className="text-label mt-0.5 truncate">
                        {entry.chart.music.title}
                    </h3>
                </div>
                <div className="shrink-0 text-right">
                    <strong className="text-label tabular-nums">
                        {formatToComma(record.score)}
                    </strong>
                    <p className="text-micro mt-0.5">{record.rank}</p>
                </div>
            </header>

            <dl className="mt-3 grid grid-cols-4 gap-1.5 text-center">
                {stats.map((stat) => (
                    <div
                        key={stat.label}
                        className="bg-surface rounded-md px-1 py-2"
                    >
                        <dt className="text-micro truncate">{stat.label}</dt>
                        <dd className="text-caption text-text-primary mt-1 font-bold tabular-nums">
                            {stat.value}
                        </dd>
                        {stat.sub ? (
                            <dd className="text-text-disabled mt-0.5 text-[10px] whitespace-nowrap">
                                {stat.sub}
                            </dd>
                        ) : null}
                    </div>
                ))}
            </dl>

            <dl className="border-divider mt-3 grid grid-cols-3 gap-2 border-t pt-3">
                <div>
                    <dt className="text-micro">S-Just</dt>
                    <dd className="text-caption text-text-primary mt-1 font-bold tabular-nums">
                        {formatMetricPercentage(sjustRate) ?? "-"}
                    </dd>
                </div>
                <div>
                    <dt className="text-micro">Miss/Near</dt>
                    <dd className="text-caption text-text-primary mt-1 font-bold tabular-nums">
                        {missNear === null ? "-" : formatToComma(missNear)}
                    </dd>
                </div>
                <div>
                    <dt className="text-micro">최근 FAST/SLOW</dt>
                    <dd
                        className={cn(
                            "text-caption text-text-primary mt-1 font-bold tabular-nums",
                            timingBias?.label === "FAST" && "text-chart",
                            timingBias?.label === "SLOW" && "text-hard"
                        )}
                    >
                        {timingBias
                            ? timingBias.value === 0
                                ? timingBias.label
                                : `${timingBias.label} +${formatToComma(timingBias.value)}`
                            : "-"}
                    </dd>
                </div>
            </dl>

            <div className="border-divider mt-3 border-t pt-3">
                <h4 className="text-caption font-semibold">음표별 성공률</h4>
                <dl className="mt-2 grid grid-cols-4 gap-1.5">
                    {noteRows.map((row) => (
                        <div key={row.key} className="min-w-0">
                            <dt className="text-micro truncate">{row.label}</dt>
                            <dd className="text-caption text-text-primary mt-1 font-bold tabular-nums">
                                {formatNoteSuccessRate(record[row.key] ?? null)}
                            </dd>
                        </div>
                    ))}
                </dl>
            </div>

            <Link
                href={detailHref}
                className="border-divider text-caption text-text-secondary focus-visible:ring-focus mt-3 flex min-h-11 items-center justify-center gap-0.5 border-t pt-3 font-semibold focus-visible:ring-2 focus-visible:outline-none"
            >
                악곡 내 기록 자세히 보기
                <ChevronRight aria-hidden className="size-4" />
            </Link>
        </section>
    );
}
