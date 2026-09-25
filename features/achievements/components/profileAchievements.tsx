"use client";

import { ChevronRight } from "lucide-react";
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

/** 한 줄에 놓는 육각 수 — 옆 열(약 370)에 44 × 7 + 사이 8 × 6 = 356 이 들어간다 */
const STRIP_LIMIT = 7;

/**
 * 프로필 「업적」 구역(2026-09-25 A2) — 넓은 화면은 옆 열(기록 개요 아래 · 기여 위), 폰은 기여 위.
 * 제목 줄 오른쪽 「얻은 수 / 전체 ›」 = 업적 탭 · 얻은 업적 육각 한 줄(높은 단계 → 최근 순, 7개까지) · 「최근 · 이름 …」 한 줄.
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
    if (!summary.earned && !isOwner) return null;
    const latest = new Map(
        summary.earnedRecords.map((item) => [item.key, item.achievedAt])
    );
    const strip = [...highestAchievementTiers(summary.earnedRecords)]
        .sort(
            ([keyA, tierA], [keyB, tierB]) =>
                tierB - tierA ||
                String(latest.get(keyB) ?? "").localeCompare(
                    String(latest.get(keyA) ?? "")
                )
        )
        .slice(0, STRIP_LIMIT);
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
                    <ul className="nl-profile-achievements__strip">
                        {strip.map(([key, tier]) => (
                            <li key={key}>
                                <AchievementHex
                                    achievementKey={key}
                                    tier={tier}
                                    label={text.titled(key, tier)}
                                />
                            </li>
                        ))}
                    </ul>
                    {summary.recent.length ? (
                        <p className="nl-metadata nl-muted">
                            {t("achievement.recent")} ·{" "}
                            {summary.recent
                                .map((item) => text.titled(item.key, item.tier))
                                .join(" · ")}
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
