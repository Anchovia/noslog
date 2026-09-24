"use client";

import { useLocale, useTranslations } from "@/components/i18n/localeProvider";
import TermHelp from "@/components/ui/termHelp";
import {
    contributionLevel,
    type NameLabel,
} from "@/features/contributions/contributionLevel";

/**
 * 이름 옆 기여 라벨(2026-09-23 N1 · L2) — 기존 태그 모양 「기여 Lv.N」, 운영자는 강조형 「운영자」.
 * 누르거나 올리면 용어 도움말과 같은 작은 창(점수 · 다음 등급까지). 라벨이 없으면 아무것도 그리지 않는다.
 */
export default function ContributionLabel({
    label,
}: {
    label: NameLabel | null | undefined;
}) {
    const t = useTranslations();
    const locale = useLocale();
    if (!label) return null;
    if (label.kind === "operator") {
        return (
            <TermHelp
                plain
                ariaLabel={t("contribution.label.operator")}
                title={t("contribution.label.operator")}
                description={t("contribution.label.operatorHelp")}
            >
                <span className="nl-tag">
                    {t("contribution.label.operator")}
                </span>
            </TermHelp>
        );
    }
    const value = contributionLevel(label.points);
    const points = value.points.toLocaleString(locale);
    const title = t("contribution.label.level", { level: value.level });
    return (
        <TermHelp
            plain
            ariaLabel={`${title} · ${t("contribution.label.points", { points })}`}
            title={`${title} · ${t("contribution.label.points", { points })}`}
            description={
                value.next === null
                    ? t("contribution.label.helpMax")
                    : t("contribution.label.help", {
                          next: value.level + 1,
                          remaining: (value.next - value.points).toLocaleString(
                              locale
                          ),
                      })
            }
        >
            <span className="nl-tag">
                <span className="nl-contribution-label__prefix">
                    {t("contribution.label.prefix")}
                </span>
                Lv.{value.level}
            </span>
        </TermHelp>
    );
}
