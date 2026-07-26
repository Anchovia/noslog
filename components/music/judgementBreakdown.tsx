import { formatToComma } from "@/lib/utils";
import {
    formatMetricPercentage,
    formatNoteSuccessRate,
    getJudgementPercentage,
    getJudgementTotal,
    hasJudgementData,
    type JudgementCounts,
    type NoteSuccessRates,
} from "@/lib/music/judgementStats";

interface JudgementBreakdownProps {
    counts: JudgementCounts;
    noteRates: NoteSuccessRates;
}

const judgementRows = [
    {
        key: "judge_sjust",
        label: "S-Just",
        color: "bg-score",
    },
    {
        key: "judge_just",
        label: "Just",
        color: "bg-chart",
    },
    {
        key: "judge_good",
        label: "Good",
        color: "bg-normal",
    },
    {
        key: "judge_miss",
        label: "Miss",
        color: "bg-danger",
    },
    {
        key: "judge_near",
        label: "Near",
        color: "bg-hard",
    },
] as const;

const noteRows = [
    { key: "note_rate_standard", label: "일반" },
    { key: "note_rate_tenuto", label: "테누토" },
    { key: "note_rate_glissando", label: "글리산도" },
    { key: "note_rate_trill", label: "트릴" },
] as const;

export default function JudgementBreakdown({
    counts,
    noteRates,
}: JudgementBreakdownProps) {
    const hasData = hasJudgementData(counts);
    const total = getJudgementTotal(counts);

    if (!hasData) {
        return (
            <div className="text-text-disabled flex min-h-24 items-center justify-center px-4 text-center text-sm">
                전체 기록을 다시 연동하면 상세 판정을 확인할 수 있습니다.
            </div>
        );
    }

    return (
        <div className="mt-3 flex flex-col gap-4">
            <div className="space-y-2.5">
                {judgementRows.map((row) => {
                    const count = counts[row.key];
                    const percentage = getJudgementPercentage(count, total);

                    return (
                        <div
                            key={row.key}
                            className="grid grid-cols-[48px_1fr_76px] items-center gap-2"
                        >
                            <span className="text-caption font-semibold">
                                {row.label}
                            </span>
                            <span className="bg-divider h-1.5 overflow-hidden rounded-full">
                                <span
                                    className={`block h-full rounded-full ${row.color}`}
                                    style={{
                                        width: `${percentage ?? 0}%`,
                                    }}
                                />
                            </span>
                            <span className="text-caption flex items-baseline justify-end gap-2 tabular-nums">
                                <strong className="text-text-primary min-w-0 text-right font-semibold">
                                    {count === null
                                        ? "-"
                                        : formatToComma(count)}
                                </strong>
                                <span className="text-micro text-text-disabled w-8 shrink-0 text-right">
                                    {formatMetricPercentage(percentage) ?? "-"}
                                </span>
                            </span>
                        </div>
                    );
                })}
            </div>

            <div className="border-divider border-t pt-3">
                <h3 className="text-label mb-2">음표별 성공률</h3>
                <dl className="grid grid-cols-2 gap-2">
                    {noteRows.map((row) => (
                        <div
                            key={row.key}
                            className="bg-surface-muted rounded-md px-3 py-2"
                        >
                            <dt className="text-caption">{row.label}</dt>
                            <dd className="text-label mt-0.5 font-bold tabular-nums">
                                {formatNoteSuccessRate(noteRates[row.key])}
                            </dd>
                        </div>
                    ))}
                </dl>
            </div>
        </div>
    );
}
