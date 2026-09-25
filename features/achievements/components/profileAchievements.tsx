"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronRight, Ellipsis } from "lucide-react";
import Link from "next/link";

import {
    useLocale,
    useLocalizedHref,
    useTranslations,
} from "@/components/i18n/localeProvider";
import {
    highestAchievementTiers,
    type AchievementSummary,
} from "@/features/achievements/achievementDefinitions";
import AchievementHex from "@/features/achievements/components/achievementHex";
import { useAchievementText } from "@/features/achievements/components/useAchievementText";

export function formatAchievementDate(value: string, locale: string) {
    return new Date(value).toLocaleDateString(locale, {
        timeZone: "Asia/Seoul",
    });
}

/** 한 줄 칸(육각 44 · 사이 8) — 칸 수는 구역 폭으로 정한다(2026-09-26 A1). 처음 그릴 때는 옆 열 · 폰 폭(356 = 7칸) 기준 */
const HEX_WIDTH = 44;
const HEX_GAP = 8;
const DEFAULT_SLOTS = 7;
const slotsFor = (width: number) =>
    Math.max(1, Math.floor((width + HEX_GAP) / (HEX_WIDTH + HEX_GAP)));

/**
 * 프로필 「업적」 구역(2026-09-25 A2) — 넓은 화면은 옆 열(기록 개요 아래 · 기여 위), 폰은 기여 위.
 * 제목 줄 오른쪽 「얻은 수 / 전체 ›」 = 업적 탭 · 얻은 업적 육각 늘 한 줄(높은 단계 → 최근 순, 구역 폭에 들어가는 만큼 —
 * 더 있으면 마지막 칸 「⋯」) · 「최근 달성 · 이름」 한 줄(가장 최근 하나, 2026-09-26).
 * 금 · 은 · 동 개수는 두지 않는다(2026-09-25). 남의 프로필에서 얻은 업적이 없으면 구역을 두지 않는다.
 */
export default function ProfileAchievements({
    userId,
    summary,
    isOwner,
}: {
    userId: number;
    summary: AchievementSummary;
    isOwner: boolean;
}) {
    const t = useTranslations();
    const locale = useLocale();
    const href = useLocalizedHref();
    const text = useAchievementText();
    const stripRef = useRef<HTMLUListElement>(null);
    const [slots, setSlots] = useState(DEFAULT_SLOTS);
    useEffect(() => {
        const element = stripRef.current;
        if (!element) return;
        const observer = new ResizeObserver(([entry]) =>
            setSlots(slotsFor(entry.contentRect.width))
        );
        observer.observe(element);
        return () => observer.disconnect();
    }, []);
    if (!summary.earned && !isOwner) return null;
    const latest = new Map(
        summary.earnedRecords.map((item) => [item.key, item.achievedAt])
    );
    const strip = [...highestAchievementTiers(summary.earnedRecords)].sort(
        ([keyA, tierA], [keyB, tierB]) =>
            tierB - tierA ||
            String(latest.get(keyB) ?? "").localeCompare(
                String(latest.get(keyA) ?? "")
            )
    );
    // 늘 한 줄 — 들어가는 칸보다 많으면 육각 (칸 − 1)개 + 마지막 칸 「⋯」, 다 들어가면 모두
    const more = strip.length > slots;
    const shown = strip.slice(0, more ? slots - 1 : slots);
    return (
        <section
            id="profile-achievements"
            className="nl-profile-section nl-profile-achievements"
            aria-labelledby="profile-achievements-title"
        >
            <div className="nl-profile-section__header">
                <h2
                    id="profile-achievements-title"
                    className="nl-section-title"
                >
                    {t("achievement.title")}
                </h2>
                <Link
                    href={href(`/profile/${userId}/achievements`)}
                    className="nl-heading-link nl-control"
                    aria-label={`${t("achievement.all")} · ${t(
                        "achievement.count",
                        {
                            earned: summary.earned.toLocaleString(locale),
                            total: summary.total.toLocaleString(locale),
                        }
                    )}`}
                >
                    {summary.earned.toLocaleString(locale)} /{" "}
                    {summary.total.toLocaleString(locale)}
                    <ChevronRight aria-hidden />
                </Link>
            </div>
            {strip.length ? (
                <>
                    <ul
                        ref={stripRef}
                        className="nl-profile-achievements__strip"
                    >
                        {shown.map(([key, tier]) => (
                            <li key={key}>
                                <AchievementHex
                                    achievementKey={key}
                                    tier={tier}
                                    label={text.titled(key, tier)}
                                />
                            </li>
                        ))}
                        {more ? (
                            <li className="nl-profile-achievements__more">
                                <Link
                                    href={href(
                                        `/profile/${userId}/achievements`
                                    )}
                                    aria-label={t("achievement.all")}
                                >
                                    <Ellipsis aria-hidden />
                                </Link>
                            </li>
                        ) : null}
                    </ul>
                    {summary.recent.length ? (
                        <p className="nl-metadata nl-muted">
                            {t("achievement.recent")} ·{" "}
                            {/* 가장 최근 하나만(2026-09-26, 사용자) */}
                            {text.titled(
                                summary.recent[0].key,
                                summary.recent[0].tier
                            )}
                        </p>
                    ) : null}
                </>
            ) : (
                <p className="nl-body-secondary nl-muted">
                    {isOwner
                        ? t("achievement.emptyOwner")
                        : t("achievement.empty")}
                </p>
            )}
        </section>
    );
}
