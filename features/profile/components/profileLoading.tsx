"use client";

import { ChevronDown } from "lucide-react";

import { useTranslations } from "@/components/i18n/localeProvider";
import PageContainer from "@/components/layout/pageContainer";
import { foundationButtonClass } from "@/components/ui/Button";
import JudgementMarker, {
    judgementLabels,
} from "@/components/ui/judgementMarker";
import { MetricSummarySkeleton } from "@/components/ui/metricSummary";
import MetricSwitch from "@/components/ui/metricSwitch";
import { SegmentedControl } from "@/components/ui/segmentedControl";
import { LoadingStatus, SkeletonText } from "@/components/ui/skeleton";
import { ProfilePlayListSkeleton } from "./profilePlayRow";

const noop = () => {};

/**
 * 프로필 불러오기(2026-09-19 로딩 시안 S1) — 실제 프로필과 같은 구역 · 클래스 · 순서.
 * 고정 부분(모드 · 지표 탭 · 기간 · 구역 제목 · 수치 라벨 · 판정 이름 · 「더 보기」)은 실제 부품과 글자 그대로,
 * 이름 · 수치 · 그래프 · 목록 · 막대 자리만 스켈레톤. 안내 문장은 화면 읽기에만
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
        <PageContainer className="nl-profile" aria-busy="true">
            <LoadingStatus label={t("profile.loading")} />
            <section className="nl-profile-identity" aria-hidden="true" inert>
                <div className="nl-profile-identity__row">
                    <span
                        className="nl-avatar nl-profile-identity__avatar nl-skeleton"
                        style={{
                            width: "var(--nl-profile-avatar-size)",
                            height: "var(--nl-profile-avatar-size)",
                        }}
                    />
                    <div className="nl-profile-identity__name-stack">
                        <SkeletonText className="nl-page-title" width="m" />
                        <SkeletonText className="nl-metadata" width="s" />
                    </div>
                </div>
            </section>
            <section
                className="nl-profile-competitive"
                aria-hidden="true"
                inert
            >
                <div>
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
                <dl className="nl-profile-summary">
                    <MetricSummarySkeleton
                        prominent
                        label={t("rankings.metric.grade")}
                    />
                    <MetricSummarySkeleton
                        prominent
                        label={t("rankings.metric.rating")}
                    />
                    <MetricSummarySkeleton
                        prominent
                        label={t("profile.globalRank")}
                    />
                    <MetricSummarySkeleton
                        prominent
                        label={t("profile.countryPosition")}
                    />
                </dl>
            </section>
            <div className="nl-profile-body" aria-hidden="true" inert>
                <section className="nl-profile-section nl-profile-progress">
                    <div className="nl-profile-progress__header">
                        <h2 className="nl-section-title">
                            {t("profile.progress")}
                        </h2>
                        <div className="nl-profile-progress__controls">
                            <MetricSwitch
                                label={t("profile.progress")}
                                value="grade"
                                options={metricOptions}
                                onValueChange={noop}
                            />
                            {/* 셀렉트 값은 스크립트가 돈 뒤 채워져 빈 칸으로 보이므로 같은 모양의 정적 트리거로 */}
                            <span className="nl-input nl-select">
                                <span>{t("profile.range.90")}</span>
                                <ChevronDown className="nl-icon" aria-hidden />
                            </span>
                        </div>
                    </div>
                    <div className="nl-profile-progress__content">
                        {/* 선 그래프 틀과 같은 구조 — 플롯(폭의 16:9, 상한 344) →16→ 날짜 줄 */}
                        <figure className="nl-line-chart">
                            <div className="nl-line-chart__plot">
                                <div className="nl-line-chart__area">
                                    <div className="nl-line-chart__series nl-profile-loading__plot nl-skeleton" />
                                    <div className="nl-line-chart__x nl-metadata">
                                        <SkeletonText
                                            className="nl-metadata"
                                            sample="2026. 09. 10."
                                        />
                                        <SkeletonText
                                            className="nl-metadata"
                                            sample="2026. 09. 10."
                                        />
                                    </div>
                                </div>
                            </div>
                        </figure>
                        <dl className="nl-profile-progress__summary nl-body-secondary">
                            {(["start", "current", "change"] as const).map(
                                (key) => (
                                    <div key={key}>
                                        <dt className="nl-muted">
                                            {t(`profile.${key}`)}
                                        </dt>
                                        <dd className="nl-metric-value">
                                            <SkeletonText
                                                className="nl-metric-value"
                                                sample="0,000.00"
                                            />
                                        </dd>
                                    </div>
                                )
                            )}
                        </dl>
                    </div>
                </section>
                {plays("best", t("profile.bestPlays"))}
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
                {plays("recent", t("profile.recentPlays"))}
            </div>
        </PageContainer>
    );
}
