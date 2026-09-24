"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";

import {
    useLocale,
    useLocalizedHref,
    useTranslations,
} from "@/components/i18n/localeProvider";
import type { AchievementSummary } from "@/features/achievements/achievementDefinitions";
import AchievementHex from "@/features/achievements/components/achievementHex";
import { useAchievementText } from "@/features/achievements/components/useAchievementText";

export function formatAchievementDate(value: string, locale: string) {
    return new Date(value).toLocaleDateString(locale, {
        timeZone: "Asia/Seoul",
    });
}

/**
 * 프로필 「업적」 구역(2026-09-24 C1) — 넓은 화면은 오른쪽 열(최근 플레이 아래 · 기여 위), 폰은 기여 위.
 * 얻은 단계 수 · 금은동 수 → 최근 달성 3줄, 머리 오른쪽 「모두 보기」 → 업적 페이지.
 * 남의 프로필에서 얻은 업적이 없으면 구역을 두지 않는다.
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
    const [bronze, silver, gold] = summary.byTier;
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
                >
                    {t("achievement.all")}
                    <ChevronRight aria-hidden />
                </Link>
            </div>
            <div className="nl-profile-achievements__summary">
                <span className="nl-emphasis-label">
                    {t("achievement.count", {
                        earned: summary.earned.toLocaleString(locale),
                        total: summary.total.toLocaleString(locale),
                    })}
                </span>
                <span className="nl-metadata nl-muted nl-profile-achievements__tiers">
                    {t("achievement.byTier", { gold, silver, bronze })}
                </span>
            </div>
            {summary.recent.length ? (
                <>
                    <p className="nl-metadata nl-muted">
                        {t("achievement.recent")}
                    </p>
                    <ul className="nl-achievement-list">
                        {summary.recent.map((item) => (
                            <li
                                key={`${item.key}-${item.tier}`}
                                className="nl-achievement-row"
                            >
                                <div className="nl-achievement-row__main">
                                    <AchievementHex
                                        achievementKey={item.key}
                                        tier={item.tier}
                                    />
                                    <div className="nl-achievement-row__text">
                                        <span className="nl-emphasis-label nl-achievement-row__name">
                                            {text.titled(item.key, item.tier)}
                                        </span>
                                        <span className="nl-metadata nl-muted">
                                            {text.condition(
                                                item.key,
                                                item.tier
                                            )}{" "}
                                            ·{" "}
                                            {t("achievement.achievedOn", {
                                                date: formatAchievementDate(
                                                    item.achievedAt,
                                                    locale
                                                ),
                                            })}
                                        </span>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
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
