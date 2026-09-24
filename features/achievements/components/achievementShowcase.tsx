"use client";

import { useLocale, useTranslations } from "@/components/i18n/localeProvider";
import TermHelp from "@/components/ui/termHelp";
import {
    getAchievementDefinition,
    type AchievementSummary,
} from "@/features/achievements/achievementDefinitions";
import AchievementHex from "@/features/achievements/components/achievementHex";
import { formatAchievementDate } from "@/features/achievements/components/profileAchievements";
import { useAchievementText } from "@/features/achievements/components/useAchievementText";
import type { MessageKey } from "@/lib/i18n/messageTypes";

/**
 * 프로필 머리 진열(2026-09-24 P5 · B1, 2026-09-25 개수 글자 삭제) — 명판 · 기여 라벨 뒤에 고른 업적(없으면 자동) 3개.
 * 배지마다 올리거나 누르면 osu! 메달 창처럼 정보 카드(2026-09-25 M1) — 분류 → 큰 육각 → 제목 → 조건 → 달성 인원 · 달성일.
 * 창 동작(올림 · 누름 · 포커스)은 기여 라벨과 같은 `TermHelp`.
 * 업적 페이지 입구는 프로필 「업적」 구역의 「모두 보기」. 얻은 업적이 없으면 그리지 않는다.
 */
export default function AchievementShowcase({
    summary,
}: {
    userId: number;
    summary: AchievementSummary;
    isOwner: boolean;
}) {
    const t = useTranslations();
    const locale = useLocale();
    const text = useAchievementText();
    if (!summary.showcase.length) return null;
    return (
        <span className="nl-achievement-showcase">
            {summary.showcase.map((item) => {
                const category = getAchievementDefinition(item.key)?.category;
                const facts = [
                    item.recipients
                        ? t("achievement.recipients", {
                              count: item.recipients.toLocaleString(locale),
                          })
                        : null,
                    item.achievedAt
                        ? t("achievement.achievedOn", {
                              date: formatAchievementDate(
                                  item.achievedAt,
                                  locale
                              ),
                          })
                        : null,
                ].filter(Boolean);
                const card = (
                    <div className="nl-achievement-card">
                        {category ? (
                            <span className="nl-metadata nl-muted">
                                {t(
                                    `achievement.category.${category}` as MessageKey
                                )}
                            </span>
                        ) : null}
                        <AchievementHex
                            achievementKey={item.key}
                            tier={item.tier}
                            size="large"
                        />
                        <strong className="nl-section-title">
                            {text.titled(item.key, item.tier)}
                        </strong>
                        <p className="nl-body-secondary">
                            {text.condition(item.key, item.tier)}
                        </p>
                        {facts.length ? (
                            <div className="nl-achievement-card__facts">
                                {facts.map((fact) => (
                                    <p
                                        key={fact}
                                        className="nl-metadata nl-muted"
                                    >
                                        {fact}
                                    </p>
                                ))}
                            </div>
                        ) : null}
                    </div>
                );
                return (
                    <TermHelp
                        key={item.key}
                        plain
                        ariaLabel={text.aria(item.key, item.tier)}
                        content={card}
                        popoverClassName="nl-achievement-card-popover"
                    >
                        <AchievementHex
                            achievementKey={item.key}
                            tier={item.tier}
                            size="inline"
                        />
                    </TermHelp>
                );
            })}
        </span>
    );
}
