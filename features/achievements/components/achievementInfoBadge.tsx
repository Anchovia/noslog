"use client";

import { useLocale, useTranslations } from "@/components/i18n/localeProvider";
import TermHelp from "@/components/ui/termHelp";
import {
    achievementSteps,
    getAchievementDefinition,
} from "@/features/achievements/achievementDefinitions";
import AchievementHex from "@/features/achievements/components/achievementHex";
import { formatAchievementDate } from "@/features/achievements/components/profileAchievements";
import { useAchievementText } from "@/features/achievements/components/useAchievementText";
import type { MessageKey } from "@/lib/i18n/messageTypes";

/**
 * 누르거나 올리면 정보 카드가 뜨는 업적 배지(2026-09-25 M1) — 프로필 머리 진열 · 업적 페이지 촘촘한 격자가 같이 쓴다.
 * 카드 = osu! 메달 창 순서: 분류 → 큰 육각 → 제목 → 조건 → 구분선 → 달성 인원 · 달성일. 창 동작은 `TermHelp`.
 * 못 얻은 업적은 흐린 육각 · 첫 단계 조건만(달성 정보 없음).
 */
export default function AchievementInfoBadge({
    achievementKey,
    tier,
    achievedAt,
    recipients,
    size,
}: {
    achievementKey: string;
    /** 0 = 아직 없음 */
    tier: number;
    achievedAt?: string;
    recipients?: number;
    size: "inline" | "row";
}) {
    const t = useTranslations();
    const locale = useLocale();
    const text = useAchievementText();
    const definition = getAchievementDefinition(achievementKey);
    const conditionTier =
        tier || (definition ? achievementSteps(definition)[0]?.tier : 0) || 1;
    const facts = [
        tier && recipients
            ? t("achievement.recipients", {
                  count: recipients.toLocaleString(locale),
              })
            : null,
        tier && achievedAt
            ? t("achievement.achievedOn", {
                  date: formatAchievementDate(achievedAt, locale),
              })
            : null,
    ].filter(Boolean);
    const card = (
        <div className="nl-achievement-card">
            {definition ? (
                <span className="nl-metadata nl-muted">
                    {t(
                        `achievement.category.${definition.category}` as MessageKey
                    )}
                </span>
            ) : null}
            <AchievementHex
                achievementKey={achievementKey}
                tier={tier}
                size="large"
            />
            <strong className="nl-section-title">
                {text.titled(achievementKey, tier)}
            </strong>
            <p className="nl-body-secondary">
                {text.condition(achievementKey, conditionTier)}
            </p>
            {facts.length ? (
                <div className="nl-achievement-card__facts">
                    {facts.map((fact) => (
                        <p key={fact} className="nl-metadata nl-muted">
                            {fact}
                        </p>
                    ))}
                </div>
            ) : null}
        </div>
    );
    return (
        <TermHelp
            plain
            ariaLabel={text.aria(achievementKey, tier)}
            content={card}
            popoverClassName="nl-achievement-card-popover"
        >
            <AchievementHex
                achievementKey={achievementKey}
                tier={tier}
                size={size}
            />
        </TermHelp>
    );
}
