"use client";

import { ChevronDown } from "lucide-react";

import { useTranslations } from "@/components/i18n/localeProvider";
import { foundationButtonClass } from "@/components/ui/Button";
import JudgementMarker, {
    judgementLabels,
} from "@/components/ui/judgementMarker";
import MetricSwitch from "@/components/ui/metricSwitch";
import { SegmentedControl } from "@/components/ui/segmentedControl";
import { LoadingStatus, SkeletonText } from "@/components/ui/skeleton";
import { ProfilePlayListSkeleton } from "./profilePlayRow";
import { ProfileProgressSkeleton } from "./profileProgress";

const noop = () => {};

/**
 * 프로필 머리 + 구역 탭 스켈레톤(2026-09-25 D2) — 레이아웃이 머리를 불러오는 동안. 실제 머리와 같은 클래스 · 격자:
 * 아바타 · 이름 · 명판 줄 · 메타 줄 · 모드 세그먼트(실제 부품) · 수치 자리 → 탭 줄(실제 글자)
 */
export function ProfileHeaderSkeleton() {
    const t = useTranslations();
    return (
        <>
            <LoadingStatus label={t("profile.loading")} />
            <section className="nl-profile-identity" aria-hidden="true" inert>
                <div className="nl-profile-identity__row">
                    <span className="nl-avatar nl-profile-identity__avatar nl-skeleton" />
                    <div className="nl-profile-identity__name-stack">
                        <div className="nl-profile-identity__name">
                            <SkeletonText className="nl-page-title" width="m" />
                        </div>
                        <SkeletonText className="nl-metadata" width="s" />
                    </div>
                    <div className="nl-profile-identity__meta nl-metadata">
                        <SkeletonText className="nl-metadata" width="m" />
                    </div>
                    <div className="nl-profile-identity__mode">
                        <SegmentedControl
                            label={t("profile.modeAria")}
                            value="basic"
                            onValueChange={noop}
                            options={[
                                { value: "basic", label: "Basic" },
                                { value: "recital", label: "Recital" },
                            ]}
                        />
                    </div>
                    <div className="nl-profile-headline">
                        <div className="nl-profile-headline__values">
                            <div className="nl-profile-headline__grade">
                                <SkeletonText
                                    className="nl-metadata"
                                    width="s"
                                />
                                <SkeletonText
                                    className="nl-metric-display"
                                    sample="0,000.00"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <nav className="nl-tabs nl-tabs--primary" aria-hidden="true">
                {(["overview", "achievements"] as const).map((key, index) => (
                    <span
                        key={key}
                        className="nl-tabs__item nl-control"
                        aria-current={index ? undefined : "page"}
                    >
                        {t(`profile.tabs.${key}`)}
                    </span>
                ))}
            </nav>
        </>
    );
}

/**
 * 「개요」 탭 스켈레톤(2026-09-19 로딩 시안 S1 · 2026-09-25 D2) — 실제 개요와 같은 구역 · 클래스 · 순서.
 * 고정 부분(지표 · 기간 · 구역 제목 · 판정 이름 · 「더 보기」)은 실제 부품과 글자 그대로, 값 · 그래프 · 목록 자리만 스켈레톤
 */
export default function ProfileLoading() {
    const t = useTranslations();
    const metricOptions = [
        {
            value: "grade",
            label: t("rankings.metric.grade"),
            shortLabel: "Grd",
        },
        {
            value: "rating",
            label: t("rankings.metric.rating"),
            shortLabel: "Rating",
        },
    ] as const;
    const judgementKeys = Object.keys(
        judgementLabels
    ) as (keyof typeof judgementLabels)[];
    const plays = (kind: "best" | "recent", title: string) => (
        <section
            className="nl-profile-section nl-profile-plays"
            data-kind={kind}
        >
            <div className="nl-profile-section__header">
                <h2 className="nl-section-title">{title}</h2>
                {kind === "best" ? (
                    <MetricSwitch
                        label={title}
                        value="grade"
                        options={metricOptions}
                        onValueChange={noop}
                    />
                ) : null}
            </div>
            <div className="nl-profile-plays__content">
                <ProfilePlayListSkeleton />
            </div>
            <div className="nl-profile-list-actions">
                <span
                    className={foundationButtonClass({ variant: "secondary" })}
                >
                    {t("profile.more")}
                </span>
            </div>
        </section>
    );
    return (
        <div className="nl-profile-body" aria-busy="true">
            <LoadingStatus label={t("profile.loading")} />
            <div className="nl-profile-main" aria-hidden="true" inert>
                <section className="nl-profile-section nl-profile-progress">
                    <div className="nl-profile-progress__header">
                        <div className="nl-profile-progress__title">
                            <h2 className="nl-section-title">
                                {t("profile.progress")}
                            </h2>
                        </div>
                        <div className="nl-profile-progress__controls">
                            <SegmentedControl
                                label={t("profile.progressMetric")}
                                value="grade"
                                onValueChange={noop}
                                options={[
                                    { value: "grade", label: "Grd" },
                                    {
                                        value: "rating",
                                        label: t("profile.ratingShort"),
                                    },
                                ]}
                            />
                            {/* 셀렉트 값은 스크립트가 돈 뒤 채워져 빈 칸으로 보이므로 같은 모양의 정적 트리거로 */}
                            <span className="nl-input nl-select">
                                <span>{t("profile.range.90")}</span>
                                <ChevronDown className="nl-icon" aria-hidden />
                            </span>
                        </div>
                    </div>
                    <div className="nl-profile-progress__content">
                        <ProfileProgressSkeleton />
                    </div>
                </section>
                {plays("best", t("profile.bestPlays"))}
                {plays("recent", t("profile.recentPlays"))}
            </div>
            <div className="nl-profile-side" aria-hidden="true" inert>
                <section className="nl-profile-section nl-profile-overview">
                    <h2 className="nl-section-title">
                        {t("profile.recordOverview")}
                    </h2>
                    <h3 className="nl-control nl-muted">
                        {t("profile.rankDistribution")}
                    </h3>
                    <dl className="nl-profile-distribution">
                        {[0, 1, 2, 3].map((index) => (
                            <div key={index}>
                                <dt>
                                    <span className="nl-score-grade nl-skeleton" />
                                </dt>
                                <dd className="nl-profile-distribution__track" />
                                <dd className="nl-metric-value">
                                    <SkeletonText
                                        className="nl-metric-value"
                                        sample="000"
                                    />
                                </dd>
                            </div>
                        ))}
                    </dl>
                    <span className="nl-profile-disclosure nl-control">
                        {t("profile.showAllRanks")}
                        <ChevronDown aria-hidden />
                    </span>
                    <div className="nl-profile-judgement-header">
                        <h3 className="nl-control nl-muted">
                            {t("profile.judgementSummary")}
                        </h3>
                    </div>
                    <div className="nl-profile-judgement-stack nl-skeleton" />
                    <dl className="nl-profile-judgements">
                        {judgementKeys.map((key) => (
                            <div key={key}>
                                <dt>
                                    <JudgementMarker judgement={key} />
                                </dt>
                                <dd className="nl-metric-value">
                                    <SkeletonText
                                        className="nl-metric-value"
                                        sample="000,000"
                                    />
                                </dd>
                            </div>
                        ))}
                    </dl>
                </section>
            </div>
        </div>
    );
}

/** 「업적」 탭 스켈레톤 — 얻은 수 줄 →16→ 목록 줄(육각 44 × 48 + 이름 · 조건) */
export function ProfileAchievementsTabSkeleton() {
    const t = useTranslations();
    return (
        <div className="nl-achievements-page" aria-busy="true">
            <LoadingStatus label={t("profile.loading")} />
            <div className="nl-achievements-page__head" aria-hidden="true">
                <SkeletonText className="nl-emphasis-label" sample="00 / 00" />
            </div>
            <ul className="nl-achievement-list" aria-hidden="true">
                {[0, 1, 2, 3, 4].map((index) => (
                    <li key={index} className="nl-achievement-row">
                        <div className="nl-achievement-row__main">
                            <span
                                className="nl-achievement-hex nl-skeleton"
                                data-size="row"
                            />
                            <div className="nl-achievement-row__text">
                                <SkeletonText
                                    className="nl-emphasis-label"
                                    width="m"
                                />
                                <SkeletonText
                                    className="nl-metadata"
                                    width="l"
                                />
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
