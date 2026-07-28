"use client";

import type { LatestSyncSummary } from "@/app/(nevigation)/bookmarklet/data";
import { useLocale, useTranslations } from "@/components/i18n/localeProvider";
import { format } from "date-fns";
import { ChevronDown } from "lucide-react";

function formatDuration(
    startedAt: Date,
    completedAt: Date | null,
    t: ReturnType<typeof useTranslations>
) {
    if (!completedAt) return null;

    const milliseconds = Math.max(
        0,
        completedAt.getTime() - startedAt.getTime()
    );
    if (milliseconds < 1_000) return t("sync.lessThanSecond");

    const seconds = Math.round(milliseconds / 1_000);
    if (seconds < 60) return t("sync.seconds", { count: seconds });

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return remainingSeconds > 0
        ? t("sync.minutesSeconds", {
              minutes,
              seconds: remainingSeconds,
          })
        : t("sync.minutes", { count: minutes });
}

function statusPresentation(
    status: string,
    t: ReturnType<typeof useTranslations>
) {
    if (status === "completed") {
        return {
            label: t("sync.status.completed"),
            className: "bg-success/10 text-success",
        };
    }
    if (status === "failed") {
        return {
            label: t("sync.status.failed"),
            className: "bg-danger/10 text-danger",
        };
    }
    return {
        label: t("sync.status.processing"),
        className: "bg-score/10 text-score",
    };
}

export default function SyncResultSummary({
    summary,
}: {
    summary: LatestSyncSummary;
}) {
    const locale = useLocale();
    const t = useTranslations();
    const status = statusPresentation(summary.status, t);
    const duration = formatDuration(summary.startedAt, summary.completedAt, t);
    const syncDate = summary.completedAt ?? summary.startedAt;
    const numberLocale =
        locale === "ja" ? "ja-JP" : locale === "en" ? "en-US" : "ko-KR";

    return (
        <details className="bg-surface rounded-card group overflow-hidden">
            <summary className="hover:bg-surface-muted flex cursor-pointer list-none items-start justify-between gap-3 p-4 transition-colors [&::-webkit-details-marker]:hidden">
                <span className="min-w-0">
                    <h2 className="text-section">{t("sync.latestResult")}</h2>
                    <span className="text-caption mt-1 block">
                        {format(syncDate, "yyyy.MM.dd HH:mm")} ·{" "}
                        {summary.syncScope === "full"
                            ? t("sync.scope.full")
                            : t("sync.scope.recent")}
                        {duration ? ` · ${duration}` : ""}
                    </span>
                </span>
                <span className="flex shrink-0 items-center gap-2">
                    <span
                        className={`${status.className} rounded-full px-2 py-1 text-xs font-semibold whitespace-nowrap`}
                    >
                        {status.label}
                    </span>
                    <ChevronDown className="text-text-disabled size-4 transition-transform group-open:rotate-180" />
                </span>
            </summary>

            <div className="border-divider flex flex-col gap-4 border-t px-4 pt-4 pb-4">
                <dl className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-bg rounded-md px-2 py-3">
                        <dt className="text-micro text-text-secondary">
                            {t("sync.received")}
                        </dt>
                        <dd className="text-label mt-1 tabular-nums">
                            {summary.receivedPlays.toLocaleString(numberLocale)}
                        </dd>
                    </div>
                    <div className="bg-bg rounded-md px-2 py-3">
                        <dt className="text-micro text-text-secondary">
                            {t("sync.newPlays")}
                        </dt>
                        <dd className="text-label mt-1 tabular-nums">
                            {summary.insertedPlays.toLocaleString(numberLocale)}
                        </dd>
                    </div>
                    <div className="bg-bg rounded-md px-2 py-3">
                        <dt className="text-micro text-text-secondary">
                            {t("sync.changedCharts")}
                        </dt>
                        <dd className="text-label mt-1 tabular-nums">
                            {summary.changedRecords.toLocaleString(
                                numberLocale
                            )}
                        </dd>
                    </div>
                </dl>

                <div className="border-divider border-t pt-4">
                    <h3 className="text-label mb-3">{t("sync.analytics")}</h3>
                    <dl className="flex flex-col gap-3">
                        <div className="flex items-center justify-between gap-3">
                            <div>
                                <dt className="text-body">
                                    {t("sync.judgementDetails")}
                                </dt>
                                <dd className="text-caption mt-0.5">
                                    {t("sync.playedCharts")}
                                </dd>
                            </div>
                            <strong className="text-label shrink-0 tabular-nums">
                                {t("sync.chartRatio", {
                                    current:
                                        summary.judgementChartCount.toLocaleString(
                                            numberLocale
                                        ),
                                    total: summary.playedChartCount.toLocaleString(
                                        numberLocale
                                    ),
                                })}
                            </strong>
                        </div>
                        <div className="flex items-center justify-between gap-3">
                            <div>
                                <dt className="text-body">FAST/SLOW</dt>
                                <dd className="text-caption mt-0.5">
                                    {t("sync.recentAnalysis")}
                                </dd>
                            </div>
                            <strong className="text-label shrink-0 tabular-nums">
                                {t("sync.chartCount", {
                                    count: summary.timingChartCount.toLocaleString(
                                        numberLocale
                                    ),
                                })}
                            </strong>
                        </div>
                    </dl>
                </div>

                {summary.status === "completed" && summary.hasNotice ? (
                    <p className="border-score/30 bg-score/5 text-score rounded-md border px-3 py-2 text-xs">
                        {t("sync.notice")}
                    </p>
                ) : null}
            </div>
        </details>
    );
}
