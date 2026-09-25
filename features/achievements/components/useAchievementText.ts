"use client";

import { useLocale, useTranslations } from "@/components/i18n/localeProvider";
import {
    achievementSteps,
    examGradeFromScore,
    getAchievementDefinition,
    type AchievementTier,
} from "@/features/achievements/achievementDefinitions";
import type { MessageKey } from "@/lib/i18n/messageTypes";

const ROMAN = ["", "I", "II", "III", "IV", "V"] as const;

/** 카테고리 업적의 조건 글에 넣는 이름(고유명사라 번역하지 않는다) */
const CATEGORY_NAMES: Record<string, string> = {
    "category-bm": "BEMANI",
    "category-org": "ORIGINAL",
    "category-cljz": "CLASSIC · JAZZ",
    "category-var": "VARIETY",
};

/** 업적 이름 · 단계 · 조건 글 — 목록 · 머리 · 동기화 결과가 같은 말을 쓴다 */
export function useAchievementText() {
    const t = useTranslations();
    const locale = useLocale();
    const name = (key: string) => t(`achievement.name.${key}` as MessageKey);
    const roman = (tier: number) => ROMAN[tier] ?? "";
    /** 「피아니스트 III」 */
    const titled = (key: string, tier: number) =>
        tier ? `${name(key)} ${roman(tier)}` : name(key);
    /** 그 단계의 조건 — 「S 이상 200곡」 */
    const condition = (key: string, tier: number) => {
        const definition = getAchievementDefinition(key);
        if (!definition) return "";
        // 그 등급의 기준 — 이 업적에 없는 등급이면 첫 단계 기준
        const threshold =
            definition.thresholds[tier as AchievementTier] ??
            achievementSteps(definition)[0]?.threshold ??
            0;
        if (definition.unit === "ratio")
            return t("achievement.condition.category", {
                category: CATEGORY_NAMES[key] ?? key,
                percent: Math.round(threshold * 100),
            });
        if (definition.unit === "exam")
            return t("achievement.condition.exam", {
                mode: key === "exam-recital" ? "Recital" : "Basic",
                grade: examGradeFromScore(threshold),
            });
        return t(`achievement.condition.${key}` as MessageKey, {
            count: threshold.toLocaleString(locale),
        });
    };
    /** 그림 접근 이름 — 「피아니스트 3단계 · 금」, 없으면 「· 아직 얻지 않음」 */
    const aria = (key: string, tier: number) =>
        tier
            ? t("achievement.tierAria", {
                  name: name(key),
                  tier,
                  metal: t(`achievement.tier.${tier}` as MessageKey),
              })
            : t("achievement.lockedAria", { name: name(key) });
    return { name, roman, titled, condition, aria };
}
