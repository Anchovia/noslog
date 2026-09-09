"use client";

import { useLocale, useTranslations } from "@/components/i18n/localeProvider";
import { StatusMessage } from "@/components/ui/statusMessage";
import type { SyncAttempt } from "@/features/sync/schemas/syncStatusSchema";

export function syncDateLabel(instant: string) {
    const parts = new Intl.DateTimeFormat("en", {
        timeZone: "Asia/Seoul",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23",
    }).formatToParts(new Date(instant));
    const part = (key: string) =>
        parts.find((value) => value.type === key)?.value ?? "";
    return `${part("year")}-${part("month")}-${part("day")} ${part("hour")}:${part("minute")}`;
}

export function SyncMetrics({
    items,
}: {
    items: Array<{ label: string; value: number }>;
}) {
    const locale = useLocale();
    return (
        <dl className="nl-sync-metrics">
            {items.map(({ label, value }) => (
                <div key={label}>
                    <dt className="nl-body-secondary nl-muted">{label}</dt>
                    <dd className="nl-metric-value">
                        {value.toLocaleString(locale)}
                    </dd>
                </div>
            ))}
        </dl>
    );
}

export default function SyncAttemptSummary({
    attempt,
    compact = false,
}: {
    attempt: SyncAttempt;
    compact?: boolean;
}) {
    const t = useTranslations();
    const locale = useLocale();
    const seconds = attempt.completedAt
        ? Math.max(
              0,
              Math.round(
                  (Date.parse(attempt.completedAt) -
                      Date.parse(attempt.startedAt)) /
                      1000
              )
          )
        : null;
    const duration =
        seconds === null
            ? null
            : seconds < 1
              ? t("sync.lessThanSecond")
              : seconds < 60
                ? t("sync.seconds", { count: seconds })
                : t("sync.minutesSeconds", {
                      minutes: Math.floor(seconds / 60),
                      seconds: seconds % 60,
                  });
    if (compact)
        return (
            <p className="nl-metadata nl-muted nl-sync-history-facts">
                <span>
                    {t(
                        attempt.scope === "full"
                            ? "sync.scope.full"
                            : "sync.scope.recent"
                    )}
                </span>
                {duration ? <span>{duration}</span> : null}
                <span>
                    <span className="sr-only">{t("sync.received")}: </span>
                    {attempt.receivedPlays.toLocaleString(locale)} ·{" "}
                    <span className="sr-only">{t("sync.newPlays")}: </span>
                    {attempt.insertedPlays.toLocaleString(locale)} ·{" "}
                    <span className="sr-only">{t("sync.changedCharts")}: </span>
                    {attempt.changedRecords.toLocaleString(locale)}
                </span>
            </p>
        );
    return (
        <>
            <div className="nl-sync-pair">
                <span className="nl-emphasis-label">
                    {t(
                        attempt.scope === "full"
                            ? "sync.scope.full"
                            : "sync.scope.recent"
                    )}
                </span>
                {duration ? (
                    <span className="nl-body-secondary nl-muted">
                        {duration}
                    </span>
                ) : null}
            </div>
            <SyncMetrics
                items={[
                    { label: t("sync.received"), value: attempt.receivedPlays },
                    { label: t("sync.newPlays"), value: attempt.insertedPlays },
                    {
                        label: t("sync.changedCharts"),
                        value: attempt.changedRecords,
                    },
                ]}
            />
            {attempt.scope === "recent" ? (
                <p className="nl-body-secondary nl-muted">
                    {t("sync.recentHelp")}
                </p>
            ) : null}
            {attempt.status === "partial" ? (
                <StatusMessage severity="info" title={t("sync.excludedTitle")}>
                    <p>
                        {t("sync.notice")}
                        {attempt.excludedCount !== null
                            ? ` ${t("sync.excludedCount", { count: attempt.excludedCount })}`
                            : ""}
                    </p>
                </StatusMessage>
            ) : null}
        </>
    );
}
