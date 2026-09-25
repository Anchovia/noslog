"use client";

import { ChevronDown } from "lucide-react";
import { useId, useState } from "react";

import { useLocale, useTranslations } from "@/components/i18n/localeProvider";
import PageContainer from "@/components/layout/pageContainer";
import BackLink from "@/components/ui/backLink";
import FilterChips from "@/components/ui/filterChips";
import IconButton from "@/components/ui/iconButton";
import {
    ACHIEVEMENT_CATEGORIES,
    achievementProgress,
    achievementStepTotal,
    achievementSteps,
    highestAchievementTiers,
    recipientKey,
    summarizeAchievements,
    visibleAchievementDefinitions,
    type AchievementCategory,
    type AchievementDefinition,
    type AchievementMetrics,
    type AchievementRecords,
} from "@/features/achievements/achievementDefinitions";
import AchievementHex from "@/features/achievements/components/achievementHex";
import { formatAchievementDate } from "@/features/achievements/components/profileAchievements";
import { useAchievementText } from "@/features/achievements/components/useAchievementText";
import type { MessageKey } from "@/lib/i18n/messageTypes";

type CategoryFilter = "all" | AchievementCategory;

/** 진행 막대 — 쫓는 다음 등급의 색(2026-09-25) · ⑯ 그래프 움직임(나타날 때 드러남 · 값이 바뀌면 옮겨 감) */
function ProgressBar({ ratio, tier }: { ratio: number; tier: number }) {
    return (
        <span className="nl-bar-list__track" aria-hidden>
            <span
                className="nl-bar-list__fill nl-achievement-progress nl-chart-reveal nl-chart-bar"
                data-tier={tier}
                style={{ width: `${Math.round(ratio * 100)}%` }}
            />
        </span>
    );
}

function AchievementRow({
    definition,
    records,
    metrics,
    recipients,
}: {
    definition: AchievementDefinition;
    records: AchievementRecords;
    metrics: AchievementMetrics | null;
    recipients: Record<string, number>;
}) {
    const t = useTranslations();
    const locale = useLocale();
    const text = useAchievementText();
    const [open, setOpen] = useState(false);
    const detailId = useId();
    const key = definition.key;
    const tier = highestAchievementTiers(records.earned).get(key) ?? 0;
    const achievedAt = (step: number) =>
        records.earned.find((item) => item.key === key && item.tier === step)
            ?.achievedAt;
    // 진행(K1)은 본인에게만 — 남에게는 조건 · 얻은 날짜만(기록 값은 보이지 않는다)
    const progress = metrics
        ? achievementProgress(definition, metrics[definition.metric], tier)
        : null;
    const showNumbers = definition.unit !== "exam";
    const number = (value: number) => value.toLocaleString(locale);
    const steps = achievementSteps(definition);
    const shownTier = progress?.nextTier ?? (tier || steps[0]?.tier || 1);
    const earnedDate = tier ? achievedAt(tier) : undefined;
    return (
        <li className="nl-achievement-row" data-earned={tier > 0}>
            <div className="nl-achievement-row__main">
                <AchievementHex
                    achievementKey={key}
                    tier={tier}
                    label={text.aria(key, tier)}
                />
                <div className="nl-achievement-row__text">
                    <span className="nl-achievement-row__title">
                        <span className="nl-emphasis-label nl-achievement-row__name">
                            {text.titled(key, tier)}
                        </span>
                    </span>
                    <span className="nl-metadata nl-muted nl-achievement-row__number">
                        {progress?.nextTier && progress.target !== null
                            ? showNumbers
                                ? `${text.condition(key, shownTier)} — ${t(
                                      "achievement.progress",
                                      {
                                          current: number(progress.current),
                                          target: number(progress.target),
                                      }
                                  )}`
                                : text.condition(key, shownTier)
                            : earnedDate
                              ? `${text.condition(key, tier)} · ${t(
                                    "achievement.achievedOn",
                                    {
                                        date: formatAchievementDate(
                                            earnedDate,
                                            locale
                                        ),
                                    }
                                )}`
                              : text.condition(key, shownTier)}
                    </span>
                    {progress?.nextTier ? (
                        <ProgressBar
                            ratio={progress.ratio}
                            tier={progress.nextTier}
                        />
                    ) : null}
                </div>
                <div className="nl-achievement-row__actions">
                    <IconButton
                        size="compact"
                        label={`${text.name(key)} · ${t("achievement.detail")}`}
                        aria-expanded={open}
                        aria-controls={detailId}
                        onClick={() => setOpen((value) => !value)}
                    >
                        <ChevronDown
                            aria-hidden
                            style={open ? { rotate: "180deg" } : undefined}
                        />
                    </IconButton>
                </div>
            </div>
            {/* 상세(D1) — 단계 사다리 · 달성 인원(명단 없음) */}
            <ol id={detailId} className="nl-achievement-ladder" hidden={!open}>
                {steps.map(({ tier: step }) => {
                    const date = achievedAt(step);
                    const stepProgress =
                        metrics && !date
                            ? achievementProgress(
                                  definition,
                                  metrics[definition.metric],
                                  step - 1
                              )
                            : null;
                    return (
                        <li key={step} className="nl-achievement-ladder__step">
                            <AchievementHex
                                achievementKey={key}
                                tier={date ? step : 0}
                                size="inline"
                            />
                            <div>
                                <span className="nl-body-secondary">
                                    {text.roman(step)} ·{" "}
                                    {text.condition(key, step)}
                                </span>
                                <span className="nl-metadata nl-muted nl-achievement-row__number">
                                    {[
                                        date
                                            ? t("achievement.achievedOn", {
                                                  date: formatAchievementDate(
                                                      date,
                                                      locale
                                                  ),
                                              })
                                            : stepProgress?.target != null &&
                                                showNumbers
                                              ? t("achievement.progress", {
                                                    current: number(
                                                        stepProgress.current
                                                    ),
                                                    target: number(
                                                        stepProgress.target
                                                    ),
                                                })
                                              : null,
                                        t("achievement.recipients", {
                                            count: number(
                                                recipients[
                                                    recipientKey(key, step)
                                                ] ?? 0
                                            ),
                                        }),
                                    ]
                                        .filter(Boolean)
                                        .join(" · ")}
                                </span>
                            </div>
                        </li>
                    );
                })}
            </ol>
        </li>
    );
}

/**
 * 업적 페이지(2026-09-24 C1 · L2 · K1 · D1) — 머리(돌아가기 · 제목 · 수) → 분류 칩 → 목록.
 * 본인: 진행 막대. 남: 얻은 단계 · 날짜 · 조건만. 머리 진열은 설정 「프로필」 탭에서 고른다(2026-09-25 D1).
 */
export default function AchievementsPage({
    userName,
    profileHref,
    records,
    metrics,
    recipients,
    scoresHidden,
}: {
    userName: string;
    profileHref: string;
    records: AchievementRecords;
    metrics: AchievementMetrics | null;
    recipients: Record<string, number>;
    scoresHidden: boolean;
}) {
    const t = useTranslations();
    const locale = useLocale();
    const [category, setCategory] = useState<CategoryFilter>("all");
    const definitions = visibleAchievementDefinitions(scoresHidden);
    const summary = summarizeAchievements(records, scoresHidden);
    const categories = ACHIEVEMENT_CATEGORIES.filter((item) =>
        definitions.some((definition) => definition.category === item)
    );
    const shown = definitions.filter(
        (definition) => category === "all" || definition.category === category
    );
    // 칩 수 = 얻은 단계 수 / 가진 단계 수(업적마다 단계 수가 다르다)
    const inCategory = (item: CategoryFilter) =>
        definitions.filter(
            (definition) => item === "all" || definition.category === item
        );
    const earnedIn = (item: CategoryFilter) => {
        const keys = new Set(
            inCategory(item).map((definition) => definition.key)
        );
        return summary.earnedRecords.filter((record) => keys.has(record.key))
            .length;
    };
    const totalIn = (item: CategoryFilter) =>
        achievementStepTotal(inCategory(item));

    return (
        <PageContainer width="reading" className="nl-achievements-page">
            <div className="nl-achievements-page__head">
                <BackLink href={profileHref}>{userName}</BackLink>
                <h1 className="nl-page-title">{t("achievement.title")}</h1>
                <p className="nl-body-secondary nl-muted">
                    {t("achievement.count", {
                        earned: summary.earned.toLocaleString(locale),
                        total: summary.total.toLocaleString(locale),
                    })}
                </p>
                {scoresHidden ? (
                    <p className="nl-metadata nl-muted">
                        {t("achievement.scoresHidden")}
                    </p>
                ) : null}
            </div>
            <FilterChips
                row
                multiple={false}
                label={t("achievement.categoryLabel")}
                value={[category]}
                onValueChange={(values) => setCategory(values[0] ?? "all")}
                options={(["all", ...categories] as CategoryFilter[]).map(
                    (item) => ({
                        value: item,
                        label: t(`achievement.category.${item}` as MessageKey),
                        count: `${earnedIn(item)}/${totalIn(item)}`,
                    })
                )}
            />
            <ul className="nl-achievement-list">
                {shown.map((definition) => (
                    <AchievementRow
                        key={definition.key}
                        definition={definition}
                        records={records}
                        metrics={metrics}
                        recipients={recipients}
                    />
                ))}
            </ul>
        </PageContainer>
    );
}
