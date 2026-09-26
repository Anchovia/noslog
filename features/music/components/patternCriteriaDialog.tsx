"use client";

import { Info } from "lucide-react";
import { useState } from "react";

import { useTranslations } from "@/components/i18n/localeProvider";
import ModalDialog from "@/components/ui/modalDialog";
import { PATTERN_AXES } from "@/features/music/schemas/communitySchema";

const LEVELS = [0, 1, 2, 3, 4] as const;

/**
 * 「패턴 경향 기준」 ⓘ + 창 — 개요 제목 줄과 평가 탭 패턴 투표 기준 줄이 같은 창을 연다.
 * 기준 = 모든 곡 대비 세기(곡 안 비중 아님) · 단계 이름 0–4 는 막대 단계 색 네모와 함께 (2026-09-23 A1 + B2)
 * 안 = 소제목 「단계」 · 「항목」 + 구분선 줄 목록(2026-09-26 I1)
 */
export default function PatternCriteriaDialog() {
    const t = useTranslations();
    const [open, setOpen] = useState(false);
    return (
        <ModalDialog
            open={open}
            onOpenChange={setOpen}
            title={t("pattern.criteria")}
            trigger={
                <button
                    type="button"
                    className="nl-info-trigger"
                    aria-label={t("pattern.criteria")}
                >
                    <Info className="nl-icon-small" aria-hidden />
                </button>
            }
        >
            <p className="nl-body-secondary">{t("pattern.basis")}</p>
            <section className="nl-info-section">
                <h3 className="nl-metadata">{t("pattern.levels")}</h3>
                <ul className="nl-info-rows nl-pattern-steps">
                    {LEVELS.map((level) => (
                        <li key={level}>
                            <span className="nl-info-rows__lead">
                                <span
                                    className="nl-pattern-steps__swatch"
                                    data-level={level}
                                    aria-hidden
                                />
                                <span className="nl-emphasis-label">
                                    {level}
                                </span>
                            </span>
                            <span className="nl-body-secondary">
                                {t(`pattern.level.${level}`)}
                            </span>
                        </li>
                    ))}
                </ul>
            </section>
            <section className="nl-info-section">
                <h3 className="nl-metadata">{t("pattern.axes")}</h3>
                <dl className="nl-info-rows">
                    {PATTERN_AXES.map((axis) => (
                        <div key={axis}>
                            <dt className="nl-emphasis-label">
                                {t(`pattern.axis.${axis}`)}
                            </dt>
                            <dd className="nl-body-secondary nl-muted">
                                {t(`pattern.definition.${axis}`)}
                            </dd>
                        </div>
                    ))}
                </dl>
            </section>
            <p className="nl-metadata">{t("pattern.scale")}</p>
        </ModalDialog>
    );
}
