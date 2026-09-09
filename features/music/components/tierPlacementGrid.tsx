"use client";

import { useId, useState } from "react";
import { useLocale, useTranslations } from "@/components/i18n/localeProvider";
import ActionButton from "@/components/ui/actionButton";
import Disclosure from "@/components/ui/disclosure";
import type { CommunityData } from "@/features/music/schemas/communitySchema";
import { TIER_GOALS, TIER_MODES } from "@/lib/tiers";

export default function TierPlacementGrid({
    data,
    busy = false,
}: {
    data?: CommunityData;
    busy?: boolean;
}) {
    const t = useTranslations();
    const locale = useLocale();
    const id = useId();
    const [visible, setVisible] = useState(5);
    const date = (value: string) =>
        new Date(value).toLocaleDateString(locale, {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            timeZone: "Asia/Seoul",
        });
    const events = data?.history.slice(0, visible) ?? [];
    const dates = [...new Set(events.map((event) => date(event.effectiveAt)))];
    return (
        <section
            className="nl-tier-placements"
            aria-label={t("community.placements")}
            aria-busy={busy}
        >
            {TIER_MODES.map((mode) => (
                <section
                    key={mode}
                    className="nl-tier-mode"
                    aria-labelledby={`${id}-${mode}`}
                >
                    <h2
                        id={`${id}-${mode}`}
                        className="nl-component-title"
                        lang="en"
                    >
                        {mode === "basic" ? "Basic" : "Recital"}
                    </h2>
                    <dl className="nl-tier-placements__cells">
                        {TIER_GOALS.map((goal) => {
                            const scope = data?.scopes.find(
                                (item) =>
                                    item.mode === mode && item.goal === goal
                            );
                            return (
                                <div key={goal} className="nl-tier-placement">
                                    <dt className="nl-control nl-muted">
                                        {t(`community.goal.${goal}`)}
                                    </dt>
                                    <dd
                                        className={
                                            scope?.placement === "published"
                                                ? "nl-metric-value"
                                                : "nl-body-secondary nl-muted"
                                        }
                                    >
                                        {scope
                                            ? scope.placement === "published"
                                                ? (scope.officialValue?.toFixed(
                                                      1
                                                  ) ?? "—")
                                                : t(
                                                      `community.${scope.placement}`
                                                  )
                                            : "—"}
                                    </dd>
                                </div>
                            );
                        })}
                    </dl>
                </section>
            ))}
            {data ? (
                data.history.length ? (
                    <Disclosure
                        compact
                        title={t("community.history")}
                        meta={`${t("community.latestChange")} ${date(data.history[0].effectiveAt)}`}
                    >
                        <div className="nl-tier-history">
                            {dates.map((day) => (
                                <section key={day}>
                                    <h3 className="nl-control">{day}</h3>
                                    <ul>
                                        {events
                                            .filter(
                                                (event) =>
                                                    date(event.effectiveAt) ===
                                                    day
                                            )
                                            .map((event) => (
                                                <li
                                                    key={event.id}
                                                    className="nl-body-secondary"
                                                >
                                                    <span>
                                                        {event.mode === "basic"
                                                            ? "Basic"
                                                            : "Recital"}{" "}
                                                        {t(
                                                            `community.goal.${event.goal}`
                                                        )}
                                                    </span>
                                                    <span>
                                                        {event.previousValue?.toFixed(
                                                            1
                                                        ) ??
                                                            t(
                                                                "community.not-listed"
                                                            )}{" "}
                                                        →{" "}
                                                        {event.value?.toFixed(
                                                            1
                                                        ) ??
                                                            t(
                                                                "community.removed"
                                                            )}
                                                    </span>
                                                </li>
                                            ))}
                                    </ul>
                                </section>
                            ))}
                        </div>
                        {visible < data.history.length ? (
                            <ActionButton
                                variant="secondary"
                                onClick={() =>
                                    setVisible((count) => count + 10)
                                }
                            >
                                {t("community.olderChanges")}
                            </ActionButton>
                        ) : null}
                        <span className="sr-only" role="status">
                            {t("community.historyCount", {
                                count: events.length,
                            })}
                        </span>
                    </Disclosure>
                ) : (
                    <p className="nl-body-secondary nl-muted">
                        {t("community.noHistory")}
                    </p>
                )
            ) : busy ? (
                <div
                    className="nl-tier-history-placeholder nl-skeleton"
                    aria-hidden
                />
            ) : null}
        </section>
    );
}
