"use client";

import { useLocale, useTranslations } from "@/components/i18n/localeProvider";
import Link from "next/link";
import { StatusMessage } from "@/components/ui/statusMessage";
import AchievementHex from "@/features/achievements/components/achievementHex";
import { useAchievementText } from "@/features/achievements/components/useAchievementText";
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

function SyncMetrics({
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

/** 새 업적 한 줄(2026-09-24 E1) — 3개까지 이름, 넘치면 「외 N개」, 끝에 「업적 보기」 */
const NEW_ACHIEVEMENTS_SHOWN = 3;

function SyncNewAchievements({
    items,
    href,
}: {
    items: SyncAttempt["newAchievements"];
    href?: string;
}) {
    const t = useTranslations();
    const text = useAchievementText();
    if (!items.length) return null;
    const rest = items.length - NEW_ACHIEVEMENTS_SHOWN;
    return (
        <p className="nl-sync-achievements">
            <span className="nl-metadata nl-muted">
                {t("achievement.sync.new")}
            </span>
            {items.slice(0, NEW_ACHIEVEMENTS_SHOWN).map((item) => (
                <span
                    key={`${item.key}-${item.tier}`}
                    className="nl-sync-achievements__item"
                >
                    <AchievementHex
                        achievementKey={item.key}
                        tier={item.tier}
                        size="inline"
                    />
                    <span className="nl-body-secondary">
                        {text.titled(item.key, item.tier)}
                    </span>
                </span>
            ))}
            {rest > 0 ? (
                <span className="nl-body-secondary nl-muted">
                    {t("achievement.sync.more", { count: rest })}
                </span>
            ) : null}
            {href ? (
                <Link
                    href={href}
                    className="nl-body-secondary nl-link nl-text-link--underlined"
                >
                    {t("achievement.sync.view")}
                </Link>
            ) : null}
        </p>
    );
}

export default function SyncAttemptSummary({
    attempt,
    compact = false,
    achievementsHref,
}: {
    attempt: SyncAttempt;
    compact?: boolean;
    /** 새 업적 줄의 「업적 보기」 — 내 업적 페이지 */
    achievementsHref?: string;
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
                    // 새 업적 칸(2026-09-24 E1) — 없으면 칸도 두지 않는다
                    ...(attempt.newAchievements.length
                        ? [
                              {
                                  label: t("achievement.sync.new"),
                                  value: attempt.newAchievements.length,
                              },
                          ]
                        : []),
                ]}
            />
            <SyncNewAchievements
                items={attempt.newAchievements}
                href={achievementsHref}
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
