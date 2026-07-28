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
import type {
    PeerJudgementComparison,
    PeerNoteRateComparison,
} from "@/lib/music/peerScoreComparison";
import {
    useLocale,
    useTranslations,
    type MessageKey,
} from "@/components/i18n/localeProvider";

interface JudgementBreakdownProps {
    counts: JudgementCounts;
    noteRates: NoteSuccessRates;
    peerComparison?: PeerJudgementComparison | null;
    peerNoteRates?: PeerNoteRateComparison | null;
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

const noteRows: {
    key: keyof NoteSuccessRates;
    labelKey: MessageKey;
}[] = [
    { key: "note_rate_standard", labelKey: "music.filter.standard" },
    { key: "note_rate_tenuto", labelKey: "music.filter.tenuto" },
    { key: "note_rate_glissando", labelKey: "music.filter.glissando" },
    { key: "note_rate_trill", labelKey: "music.filter.trill" },
] as const;

export default function JudgementBreakdown({
    counts,
    noteRates,
    peerComparison,
    peerNoteRates,
}: JudgementBreakdownProps) {
    const locale = useLocale();
    const t = useTranslations();
    const hasData = hasJudgementData(counts);
    const total = getJudgementTotal(counts);

    if (!hasData) {
        return (
            <div className="text-text-disabled flex min-h-24 items-center justify-center px-4 text-center text-sm">
                {t("music.judgement.syncRequired")}
            </div>
        );
    }

    return (
        <div className="mt-3 flex flex-col gap-4">
            <div className={peerComparison ? "space-y-3" : "space-y-2.5"}>
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
                            <span className="flex flex-col items-end tabular-nums">
                                <span className="text-caption flex items-baseline justify-end gap-2">
                                    <strong className="text-text-primary min-w-0 text-right font-semibold">
                                        {count === null
                                            ? "-"
                                            : formatToComma(count)}
                                    </strong>
                                    <span className="text-micro text-text-disabled w-8 shrink-0 text-right">
                                        {formatMetricPercentage(percentage) ??
                                            "-"}
                                    </span>
                                </span>
                                {peerComparison ? (
                                    <span className="text-micro text-text-disabled mt-0.5 whitespace-nowrap">
                                        {t("music.judgement.average", {
                                            value:
                                                formatMetricPercentage(
                                                    peerComparison.averages[
                                                        row.key
                                                    ]
                                                ) ?? "-",
                                        })}
                                    </span>
                                ) : null}
                            </span>
                        </div>
                    );
                })}
                {peerComparison ? (
                    <p className="text-micro text-right tabular-nums">
                        {t("music.judgement.peerBasis", {
                            count: peerComparison.sampleCount.toLocaleString(
                                locale
                            ),
                        })}
                    </p>
                ) : null}
            </div>

            <div className="border-divider border-t pt-3">
                <h3 className="text-label mb-2">
                    {t("music.judgement.noteSuccess")}
                </h3>
                <dl className="grid grid-cols-2 gap-2">
                    {noteRows.map((row) => (
                        <div
                            key={row.key}
                            className="bg-surface-muted rounded-md px-3 py-2"
                        >
                            <dt className="text-caption">{t(row.labelKey)}</dt>
                            <dd className="mt-0.5 tabular-nums">
                                <strong className="text-label block">
                                    {formatNoteSuccessRate(noteRates[row.key])}
                                </strong>
                                {peerNoteRates ? (
                                    <span className="text-micro text-text-disabled mt-0.5 block font-normal">
                                        {t("music.judgement.average", {
                                            value: formatNoteSuccessRate(
                                                peerNoteRates.averages[row.key]
                                            ),
                                        })}
                                    </span>
                                ) : null}
                            </dd>
                        </div>
                    ))}
                </dl>
            </div>
        </div>
    );
}
