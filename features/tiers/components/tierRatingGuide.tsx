"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "@/components/i18n/localeProvider";
import LineChart from "@/components/ui/lineChart";
import ModalDialog from "@/components/ui/modalDialog";
import { tierListLabel, TIER_BAND_VALUES } from "@/lib/tiers";
import {
    BASIC_RATING_ACTIVE_CURVE,
    BASIC_RATING_CURVES,
    BASIC_RATING_MAX,
    BASIC_RATING_TOP_COUNT,
    getBasicRatingMaxContribution,
} from "@/lib/tiers/basicRating";
import type {
    TierBrowserOverview,
    TierBrowserQuery,
} from "@/features/tiers/schemas/tierBrowserSchema";

/**
 * 서열표 안내 — 제목 아래 메타 글줄 끝 「안내」 글자 링크가 여는 설명 창(2026-09-22 A). 제목 뒤에는 스위처 꺾쇠만 둔다.
 * 이 표의 설명 · 쓰는 법 · 업데이트 날짜 · 목표 기준(Pianist 는 서열 상수별 기여 그래프)
 * 설명 → 핵심 값 줄(달성 기준 · 업데이트, 구분선 · 값 오른쪽 — 2026-09-26 I1) → 쓰는 법
 */
export default function TierRatingGuide({
    query,
    overview,
    open: openProp,
    onOpenChange,
    onCloseAutoFocus,
}: {
    query: TierBrowserQuery;
    overview: TierBrowserOverview;
    /** 제목 줄 ⋯ 메뉴 「서열표 안내」 도 같은 창을 연다(2026-09-22 S7-a) — 주면 열림을 밖에서 쥔다 */
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    onCloseAutoFocus?: (event: Event) => void;
}) {
    const t = useTranslations();
    const locale = useLocale();
    const [openState, setOpenState] = useState(false);
    const open = openProp ?? openState;
    const setOpen = onOpenChange ?? setOpenState;
    const title = t("tiers.guide", {
        goal: tierListLabel(query.mode, query.goal),
    });
    const max = overview.theoreticalMax;
    // S · 990k 는 달성 기준 점수를 이름 → 값 줄로(2026-09-26 I1). Pianist 는 아래 기여 그래프가 기준을 설명한다
    const minScore =
        query.goal === "s" ? 950_000 : query.goal === "990k" ? 990_000 : null;
    const points = max
        ? [...TIER_BAND_VALUES].reverse().map((value) => ({
              id: value,
              dimension: value.toFixed(1),
              shortDimension: String(value),
              value: getBasicRatingMaxContribution(value, max),
          }))
        : [];
    return (
        <ModalDialog
            open={open}
            onOpenChange={setOpen}
            onCloseAutoFocus={onCloseAutoFocus}
            title={title}
            trigger={
                // 보이는 글자(「안내」)는 접근 이름(「S 서열표 안내」) 안에 들어 있다
                <button
                    type="button"
                    className="nl-tier-meta__guide nl-link nl-text-link--underlined"
                    aria-label={title}
                >
                    {t("tiers.guideLink")}
                </button>
            }
        >
            <div className="nl-tier-guide">
                {overview.list?.description ? (
                    <p className="nl-body-secondary">
                        {overview.list.description}
                    </p>
                ) : null}
                {minScore || overview.list ? (
                    <dl className="nl-info-rows nl-info-rows--value">
                        {minScore ? (
                            <div>
                                <dt className="nl-body-secondary nl-muted">
                                    {t("tiers.guideRequirement")}
                                </dt>
                                <dd className="nl-emphasis-label">
                                    {t("tiers.guideMinScore", {
                                        score: minScore.toLocaleString(locale),
                                    })}
                                </dd>
                            </div>
                        ) : null}
                        {overview.list ? (
                            <div>
                                <dt className="nl-body-secondary nl-muted">
                                    {t("tiers.guideUpdated")}
                                </dt>
                                <dd className="nl-body-secondary">
                                    {new Intl.DateTimeFormat(locale, {
                                        year: "numeric",
                                        month: "2-digit",
                                        day: "2-digit",
                                        timeZone: "Asia/Seoul",
                                    }).format(
                                        new Date(overview.list.updatedAt)
                                    )}
                                </dd>
                            </div>
                        ) : null}
                    </dl>
                ) : null}
                <p className="nl-body-secondary nl-muted">
                    {t("tiers.filterHelp")}
                </p>
                {query.goal === "pianist" && max ? (
                    <section className="nl-tier-weight">
                        <div className="nl-tier-weight__heading">
                            <div>
                                <h3 className="nl-component-title">
                                    {t("tiers.weight.title")}
                                </h3>
                                <p className="nl-metadata">
                                    {t("tiers.weight.modePerSong", {
                                        mode:
                                            query.mode === "basic"
                                                ? "Basic"
                                                : "Recital",
                                    })}
                                </p>
                            </div>
                            <span className="nl-control">
                                {t("tiers.weight.total", {
                                    score: BASIC_RATING_MAX.toLocaleString(
                                        locale
                                    ),
                                })}
                            </span>
                        </div>
                        <LineChart
                            points={points}
                            dimensionTickIndices={[
                                0, 20, 40, 60, 80, 100, 120, 135,
                            ]}
                            valueTickCount={5}
                            verticalInset={8}
                            showPoints={false}
                            tableVisibility="screen-reader"
                            label={t("tiers.weight.chartAria")}
                            dimensionLabel={t("tiers.bands")}
                            valueLabel={t("tiers.weight.maxContribution", {
                                goal: "Pianist",
                            })}
                            formatValue={(value) =>
                                value.toLocaleString(locale, {
                                    maximumFractionDigits: 2,
                                })
                            }
                            formatAxis={(value) =>
                                value.toLocaleString(locale, {
                                    maximumFractionDigits: 0,
                                })
                            }
                            domain={[
                                0,
                                Math.ceil(points.at(-1)!.value / 50) * 50,
                            ]}
                            emptyMessage=""
                        />
                        <p className="nl-metadata">
                            {t("tiers.weight.formula", {
                                count: BASIC_RATING_TOP_COUNT,
                                score: BASIC_RATING_MAX.toLocaleString(locale),
                            })}
                        </p>
                        <h4 className="nl-metadata">
                            {t("tiers.weight.scoreRatio")}
                        </h4>
                        <dl className="nl-tier-weight__ratios">
                            {BASIC_RATING_CURVES[
                                BASIC_RATING_ACTIVE_CURVE
                            ].anchors.map(([score, value]) => (
                                <div key={score}>
                                    <dt className="nl-metadata">
                                        {score === 1_000_000
                                            ? "Pianist"
                                            : score.toLocaleString(locale)}
                                    </dt>
                                    <dd className="nl-control">
                                        {Math.round(value * 100)}%
                                    </dd>
                                </div>
                            ))}
                        </dl>
                    </section>
                ) : null}
            </div>
        </ModalDialog>
    );
}
