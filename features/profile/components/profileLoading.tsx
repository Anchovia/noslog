"use client";

import { ChevronDown, ChevronRight } from "lucide-react";

import { useTranslations } from "@/components/i18n/localeProvider";
import { foundationButtonClass } from "@/components/ui/Button";
import JudgementMarker, {
    judgementLabels,
} from "@/components/ui/judgementMarker";
import { SegmentedControl } from "@/components/ui/segmentedControl";
import { LoadingStatus, SkeletonText } from "@/components/ui/skeleton";
import StackedBar from "@/components/ui/stackedBar";
import { StatStripSkeleton } from "@/components/ui/statStrip";
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
                        <div className="nl-profile-headline__cells">
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
                            {(
                                [
                                    "profile.headlineWorld",
                                    "profile.headlineCountry",
                                ] as const
                            ).map((label) => (
                                <div
                                    key={label}
                                    className="nl-profile-headline__rank"
                                >
                                    <span className="nl-metadata nl-muted">
                                        {t(label)}
                                    </span>
                                    <SkeletonText
                                        className="nl-metric-value"
                                        sample="#00"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
            <nav className="nl-tabs nl-tabs--primary" aria-hidden="true">
                {(
                    [
                        "overview",
                        "records",
                        "stats",
                        "achievements",
                        "activity",
                    ] as const
                ).map((key, index) => (
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
        { value: "grade", label: "Grade" },
        { value: "rating", label: "Rating" },
    ] as const;
    const plays = (kind: "best" | "recent", title: string) => (
        <section
            className="nl-profile-section nl-profile-plays"
            data-kind={kind}
        >
            <div className="nl-profile-section__header" data-linked>
                <div className="nl-heading-row">
                    <h2 className="nl-section-title">{title}</h2>
                    <span className="nl-heading-link nl-control">
                        {t("achievement.all")}
                        <ChevronRight aria-hidden />
                    </span>
                </div>
                {kind === "best" ? (
                    <SegmentedControl
                        size="sm"
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
                <ProgressSkeleton />
                {plays("best", t("profile.bestPlays"))}
                {plays("recent", t("profile.recentPlays"))}
            </div>
            <div className="nl-profile-side" aria-hidden="true" inert>
                <ProfileLevelsSkeleton variant="summary" />
            </div>
        </div>
    );
}

/** 성장 추이 스켈레톤 — 제목 · 지표 세그먼트 · 기간(실제 글자) + 그래프 자리 */
function ProgressSkeleton() {
    const t = useTranslations();
    return (
        <section
            className="nl-profile-section nl-profile-progress"
            aria-hidden="true"
        >
            <div className="nl-profile-progress__header">
                <div className="nl-profile-progress__title">
                    <h2 className="nl-section-title">
                        {t("profile.progress")}
                    </h2>
                </div>
                <div className="nl-profile-progress__controls">
                    <SegmentedControl
                        size="sm"
                        label={t("profile.progressMetric")}
                        value="grade"
                        onValueChange={noop}
                        options={[
                            { value: "grade", label: "Grade" },
                            {
                                value: "rating",
                                label: "Rating",
                            },
                        ]}
                    />
                    {/* 셀렉트 값은 스크립트가 돈 뒤 채워져 빈 칸으로 보이므로 같은 모양의 정적 트리거로 */}
                    <span className="nl-compact-select nl-control nl-compact-select--outlined nl-compact-select--compact">
                        <span>{t("profile.range.90")}</span>
                        <ChevronDown aria-hidden />
                    </span>
                </div>
            </div>
            <div className="nl-profile-progress__content">
                <ProfileProgressSkeleton />
            </div>
        </section>
    );
}

/** 레벨별 달성 스켈레톤 — 제목 · 레벨 이름(요약 = 9 이상 + REAL) + 빈 트랙 · 값 자리 */
function ProfileLevelsSkeleton({ variant }: { variant: "summary" | "full" }) {
    const t = useTranslations();
    const labels = [
        ...(variant === "summary" ? [] : ["1–8"]),
        "9",
        "10",
        "11",
        "12",
        "REAL 1",
        "REAL 2",
        "REAL 3",
    ];
    return (
        <section
            className="nl-profile-section nl-profile-levels"
            data-variant={variant}
            aria-hidden="true"
        >
            <div className="nl-heading-row">
                <h2 className="nl-section-title">
                    {t("profile.levels.title")}
                </h2>
                {variant === "summary" ? (
                    <span className="nl-heading-link nl-control">
                        {t("achievement.all")}
                        <ChevronRight aria-hidden />
                    </span>
                ) : null}
            </div>
            <StackedBar
                rows={labels.map((label) => ({
                    key: label,
                    label,
                    segments: [],
                    value: (
                        <SkeletonText
                            className="nl-metric-value"
                            sample="00%"
                        />
                    ),
                }))}
            />
        </section>
    );
}

/** 「통계」 탭 스켈레톤 — 실제 탭과 같은 구역 · 순서(성장 추이 · 레벨별 달성 · 판정 · 랭크) */
export function ProfileStatsTabSkeleton() {
    const t = useTranslations();
    const judgementKeys = Object.keys(
        judgementLabels
    ) as (keyof typeof judgementLabels)[];
    return (
        <div className="nl-profile-stats" aria-busy="true">
            <LoadingStatus label={t("profile.loading")} />
            <ProgressSkeleton />
            <ProfileLevelsSkeleton variant="full" />
            <section
                className="nl-profile-section nl-profile-judgement"
                aria-hidden="true"
            >
                <div className="nl-profile-judgement-header">
                    <h2 className="nl-section-title">
                        {t("profile.judgementSummary")}
                    </h2>
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
            <section
                className="nl-profile-section nl-profile-ranks"
                aria-hidden="true"
            >
                <h2 className="nl-section-title">
                    {t("profile.rankDistribution")}
                </h2>
                <dl className="nl-profile-distribution">
                    {[0, 1, 2, 3, 4].map((index) => (
                        <div key={index}>
                            <dt className="nl-full-combo-slot">
                                {index === 4 ? (
                                    <span className="nl-full-combo nl-metadata">
                                        {t("profile.fullComboShort")}
                                    </span>
                                ) : (
                                    <span className="nl-score-grade nl-skeleton" />
                                )}
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
            </section>
        </div>
    );
}

/** 「활동」 탭 스켈레톤 — 요약 띠(라벨 실제 글자) · 달력 자리 · 최근 플레이 줄 */
export function ProfileActivityTabSkeleton() {
    const t = useTranslations();
    return (
        <div className="nl-profile-activity" aria-busy="true">
            <LoadingStatus label={t("profile.loading")} />
            <section className="nl-profile-section" aria-hidden="true">
                <StatStripSkeleton
                    labels={[
                        t("profile.activity.year"),
                        t("profile.activity.month"),
                        t("profile.activity.currentStreak"),
                        t("profile.activity.longestStreak"),
                    ]}
                />
                <div className="nl-profile-calendar__skeleton nl-skeleton" />
            </section>
            <section
                className="nl-profile-section nl-profile-plays"
                data-kind="recent"
                aria-hidden="true"
            >
                <h2 className="nl-section-title">{t("profile.recentPlays")}</h2>
                <div className="nl-profile-plays__content">
                    <ProfilePlayListSkeleton count={8} />
                </div>
            </section>
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

/** 「기록」 탭 스켈레톤 — 도구 줄(2단 탭 · 검색 · 필터 · 정렬 자리) →16→ 표 줄 */
export function ProfileRecordsTabSkeleton() {
    const t = useTranslations();
    return (
        <section
            className="nl-profile-section nl-profile-records"
            data-kind="best"
            aria-busy="true"
        >
            <LoadingStatus label={t("profile.loading")} />
            <div className="nl-profile-records__toolbar" aria-hidden="true">
                <SkeletonText className="nl-control" width="m" />
            </div>
            <div className="nl-profile-plays__content" aria-hidden="true">
                <ProfilePlayListSkeleton count={8} />
            </div>
        </section>
    );
}
