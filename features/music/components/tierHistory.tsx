"use client";

import { useState } from "react";

import { useLocale, useTranslations } from "@/components/i18n/localeProvider";
import ActionButton from "@/components/ui/actionButton";
import Disclosure from "@/components/ui/disclosure";
import type { ChartDetail } from "@/components/music/musicDetailTypes";

/** 서열 변경 이력 — 개요 탭 맨 아래 구역 펼침(요약 줄 48 · 구역 제목).
 * 날짜 묶음 하나 = 카드 하나(기본 접힘) — 구역 · 날짜 · 항목 세 단계를 상자로 가른다 (2026-09-16 개요로 이동 · 09-18 C1) */
export default function TierHistory({
    history,
}: {
    history: ChartDetail["tierHistory"];
}) {
    const t = useTranslations();
    const locale = useLocale();
    const [visible, setVisible] = useState(5);
    if (!history.length) return null;
    const date = (value: string) =>
        new Date(value).toLocaleDateString(locale, {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            timeZone: "Asia/Seoul",
        });
    const events = history.slice(0, visible);
    const dates = [...new Set(events.map((event) => date(event.effectiveAt)))];
    return (
        <Disclosure
            heading="section"
            title={t("community.history")}
            meta={`${t("community.latestChange")} ${date(history[0].effectiveAt)}`}
        >
            <div className="nl-tier-history">
                {/* 날짜 묶음 = 보조 펼침, 기본 접힘 — 이력이 길어져도 펼친 높이가 늘지 않게 (2026-09-16) */}
                <div className="nl-tier-history__days">
                    {dates.map((day) => (
                        <Disclosure
                            key={day}
                            compact
                            card
                            title={day}
                            className="nl-tier-history__day"
                        >
                            <ul>
                                {events
                                    .filter(
                                        (event) =>
                                            date(event.effectiveAt) === day
                                    )
                                    .map((event) => (
                                        <li
                                            key={event.id}
                                            className="nl-body-secondary"
                                        >
                                            <span>
                                                {event.mode === "basic"
                                                    ? `Basic ${t(`community.goal.${event.goal}`)}`
                                                    : "Recital"}
                                            </span>
                                            <span className="nl-metric-value">
                                                {event.previousValue?.toFixed(
                                                    1
                                                ) ??
                                                    t(
                                                        "community.not-listed"
                                                    )}{" "}
                                                →{" "}
                                                {event.value?.toFixed(1) ??
                                                    t("community.removed")}
                                            </span>
                                        </li>
                                    ))}
                            </ul>
                        </Disclosure>
                    ))}
                </div>
                {history.length > visible ? (
                    <ActionButton
                        variant="ghost"
                        size="sm"
                        onClick={() => setVisible((count) => count + 5)}
                    >
                        {t("community.olderChanges")}
                    </ActionButton>
                ) : null}
                <span className="sr-only" role="status">
                    {t("community.historyCount", { count: events.length })}
                </span>
            </div>
        </Disclosure>
    );
}
