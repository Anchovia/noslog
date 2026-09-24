"use client";

import Link from "next/link";

import {
    useLocale,
    useLocalizedHref,
    useTranslations,
} from "@/components/i18n/localeProvider";
import type { AchievementSummary } from "@/features/achievements/achievementDefinitions";
import AchievementHex from "@/features/achievements/components/achievementHex";
import { useAchievementText } from "@/features/achievements/components/useAchievementText";

/**
 * 프로필 머리 진열(2026-09-24 P5 · B1) — 명판 · 기여 라벨 뒤에 건 업적(없으면 자동) 3개 + 「업적 n / N」.
 * 숫자를 누르면 업적 페이지. 남의 프로필에서 얻은 업적이 없으면 그리지 않는다.
 */
export default function AchievementShowcase({
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
    return (
        <span className="nl-achievement-showcase">
            {summary.showcase.map((item) => (
                <AchievementHex
                    key={item.key}
                    achievementKey={item.key}
                    tier={item.tier}
                    size="inline"
                    label={text.aria(item.key, item.tier)}
                />
            ))}
            <Link
                href={href(`/profile/${userId}/achievements`)}
                className="nl-achievement-showcase__count nl-body-secondary nl-link nl-text-link--underlined"
                aria-label={t("achievement.countAria", {
                    earned: summary.earned.toLocaleString(locale),
                    total: summary.total.toLocaleString(locale),
                })}
            >
                {t("achievement.count", {
                    earned: summary.earned.toLocaleString(locale),
                    total: summary.total.toLocaleString(locale),
                })}
            </Link>
        </span>
    );
}
