"use client";

import {
    ArrowUpDown,
    Check,
    ChevronDown,
    ChevronRight,
    Globe,
    Grid3x3,
    List,
} from "lucide-react";

import { useTranslations } from "@/components/i18n/locale-provider";
import { foundationButtonClass } from "@/components/ui/button";
import JudgementMarker, {
    judgementLabels,
} from "@/components/ui/judgement-marker";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { LoadingStatus, SkeletonText } from "@/components/ui/skeleton";
import StackedBar from "@/components/ui/stacked-bar";
import { StatStripSkeleton } from "@/components/ui/stat-strip";
import { ACHIEVEMENT_CATEGORIES } from "@/features/achievements/achievement-definitions";
import { PROFILE_TIER_KEYS } from "@/features/profile/schemas/profile-stats-schema";
import { cn } from "@/lib/cn";
import useWideLayout from "@/lib/hooks/use-wide-layout";

import {
    PROFILE_TIER_COLORS,
    profileLevelDifficultyOptions,
    profileTierLabel,
} from "./profile-levels";
import { ProfilePlayListSkeleton } from "./profile-play-row";
import { ProfileProgressSkeleton } from "./profile-progress";

const noop = () => {};

/** 정렬 메뉴 트리거(SortMenu 고스트)와 같은 모양의 정적 자리 — 글자는 기본 정렬 */
function SortTriggerSkeleton({ label, size }: { label: string; size?: "sm" }) {
    return (
        <span
            className={cn(
                foundationButtonClass({ variant: "ghost", size }),
                "nl-filter-trigger"
            )}
        >
            <ArrowUpDown className="nl-icon-small" aria-hidden />
            <span className="nl-filter-trigger__label">{label}</span>
            <ChevronDown className="nl-icon-small" aria-hidden />
        </span>
    );
}

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
                        {/* 명판 줄 = 검정 명판 24 틀(실제는 늘 명판 또는 「검정 기록 없음」) */}
                        <div className="nl-profile-identity__exams">
                            <span className="nl-exam-badge" data-tier="none">
                                <SkeletonText
                                    className="nl-metadata"
                                    sample={t("rankings.examNone")}
                                />
                            </span>
                        </div>
                    </div>
                    {/* 정보 두 줄 — 활동 줄 →4→ 계정 줄 */}
                    <div className="nl-profile-identity__meta nl-body-secondary nl-muted">
                        <p className="nl-profile-identity__line">
                            <SkeletonText
                                className="nl-body-secondary"
                                width="m"
                            />
                        </p>
                        <p className="nl-profile-identity__line">
                            <SkeletonText
                                className="nl-body-secondary"
                                width="m"
                            />
                        </p>
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
                        <dl className="nl-profile-headline__cells">
                            <div className="nl-profile-headline__grade">
                                {/* 지표 고르기(CompactSelect M) — 값은 스크립트 뒤에 채워져 같은 모양의 정적 트리거로 */}
                                <dt>
                                    <span className="nl-compact-select nl-control nl-compact-select--compact">
                                        <span>Grade</span>
                                        <ChevronDown aria-hidden />
                                    </span>
                                </dt>
                                <dd className="nl-metric-display">
                                    <SkeletonText
                                        className="nl-metric-display"
                                        sample="0,000.00"
                                    />
                                </dd>
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
                                    {/* 국가 칸의 국기는 나라를 모르는 동안 지구본 자리 */}
                                    <dt className="nl-control nl-muted">
                                        <Globe aria-hidden />
                                        {t(label)}
                                    </dt>
                                    <dd className="nl-component-title">
                                        <SkeletonText
                                            className="nl-component-title"
                                            sample="#00"
                                        />
                                    </dd>
                                </div>
                            ))}
                        </dl>
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

/**
 * 레벨별 달성 스켈레톤 — 제목 · (통계 탭) 난이도 세그먼트 · 레벨 이름(「1–8」 묶음 + 9 이상 + REAL) + 빈 트랙 · 값 자리 ·
 * 「전체 레벨 보기」 · 범례(실제 글자)
 */
function ProfileLevelsSkeleton({ variant }: { variant: "summary" | "full" }) {
    const t = useTranslations();
    const labels = ["1–8", "9", "10", "11", "12", "REAL 1", "REAL 2", "REAL 3"];
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
            {variant === "full" ? (
                <SegmentedControl
                    size="sm"
                    className="nl-profile-levels__difficulty"
                    label={t("profile.levels.difficultyLabel")}
                    value="all"
                    onValueChange={noop}
                    options={profileLevelDifficultyOptions(t)}
                />
            ) : null}
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
            <span className="nl-profile-disclosure nl-control">
                {t("profile.showAllLevels")}
                <ChevronDown aria-hidden />
            </span>
            <div className="nl-profile-legend nl-metadata nl-muted">
                {PROFILE_TIER_KEYS.map((key) => (
                    <span key={key} className="nl-profile-legend__item">
                        <i style={{ background: PROFILE_TIER_COLORS[key] }} />
                        {profileTierLabel(key, t)}
                    </span>
                ))}
            </div>
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
                    <SkeletonText className="nl-metadata" width="m" />
                </div>
                <StackedBar rows={[{ key: "judgement", segments: [] }]} />
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
                            <dd className="nl-body-secondary nl-muted">
                                <SkeletonText
                                    className="nl-body-secondary"
                                    sample="00.0%"
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
                            <dd className="nl-bar-list__track nl-profile-distribution__track" />
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
            <section
                className="nl-profile-section nl-profile-calendar"
                aria-hidden="true"
            >
                <h2 className="nl-section-title">
                    {t("profile.tabs.activity")}
                </h2>
                <StatStripSkeleton
                    labels={[
                        t("profile.activity.year"),
                        t("profile.activity.month"),
                        t("profile.activity.currentStreak"),
                        t("profile.activity.longestStreak"),
                    ]}
                />
                <div className="nl-profile-calendar__body">
                    <div className="nl-profile-calendar__skeleton nl-skeleton" />
                    <div className="nl-profile-calendar__foot nl-metadata nl-muted">
                        <span className="nl-profile-calendar__hint">
                            {t("profile.activity.scrollHint")}
                        </span>
                        <ul className="nl-profile-legend">
                            <li>{t("profile.activity.less")}</li>
                            {[0, 1, 2, 3, 4, 5, 6].map((level) => (
                                <li key={level}>
                                    <i
                                        className="nl-profile-calendar__cell"
                                        data-level={level}
                                    />
                                </li>
                            ))}
                            <li>{t("profile.activity.more")}</li>
                        </ul>
                    </div>
                </div>
            </section>
            <section
                className="nl-profile-section nl-profile-plays"
                data-kind="recent"
                aria-hidden="true"
            >
                <div className="nl-profile-section__header">
                    <div className="nl-heading-row">
                        <h2 className="nl-section-title">
                            {t("profile.recentPlays")}
                        </h2>
                    </div>
                </div>
                <div className="nl-profile-plays__content">
                    <ProfilePlayListSkeleton count={8} />
                </div>
            </section>
        </div>
    );
}

/**
 * 「업적」 탭 스켈레톤 — 실제 업적 페이지(프로필 탭 안)와 같은 순서: 구역 제목(얻은 수) → 분류 칩 → 결과 줄(정렬 · 보기 전환) →
 * 목록 줄(육각 44 × 48 + 이름 entity-title · 조건 body-secondary + 펼치기)
 */
export function ProfileAchievementsTabSkeleton() {
    const t = useTranslations();
    const wide = useWideLayout();
    return (
        <div className="nl-achievements-page" aria-busy="true">
            <LoadingStatus label={t("profile.loading")} />
            <div className="nl-achievements-page__head" aria-hidden="true">
                <h2 className="nl-section-title">
                    <SkeletonText
                        className="nl-section-title"
                        sample={t("achievement.count", {
                            earned: "00",
                            total: "00",
                        })}
                    />
                </h2>
            </div>
            <div className="nl-chips nl-chips--row" aria-hidden="true">
                {(["all", ...ACHIEVEMENT_CATEGORIES] as const).map(
                    (item, index) => (
                        <span
                            key={item}
                            className="nl-chip nl-control"
                            aria-pressed={index === 0}
                        >
                            {index === 0 ? (
                                <Check className="nl-icon-small" aria-hidden />
                            ) : null}
                            <span>{t(`achievement.category.${item}`)}</span>
                            <SkeletonText
                                className="nl-chip__count nl-metadata"
                                sample="00/00"
                            />
                        </span>
                    )
                )}
            </div>
            <div className="nl-achievements-page__results" aria-hidden="true">
                <SortTriggerSkeleton
                    label={t("achievement.sort.category")}
                    size={wide ? undefined : "sm"}
                />
                <SegmentedControl
                    label={t("discovery.view")}
                    value="list"
                    onValueChange={noop}
                    iconOnly
                    size={wide ? undefined : "sm"}
                    options={[
                        {
                            value: "list",
                            label: t("discovery.list"),
                            icon: <List aria-hidden />,
                        },
                        {
                            value: "dense",
                            label: t("discovery.denseGrid"),
                            icon: <Grid3x3 aria-hidden />,
                        },
                    ]}
                />
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
                                <span className="nl-achievement-row__title">
                                    <SkeletonText
                                        className="nl-entity-title"
                                        width="m"
                                    />
                                </span>
                                <SkeletonText
                                    className="nl-body-secondary"
                                    width="l"
                                />
                            </div>
                            <div className="nl-achievement-row__actions">
                                <span
                                    className={foundationButtonClass({
                                        variant: "ghost",
                                        size: "icon-sm",
                                    })}
                                >
                                    <ChevronDown aria-hidden />
                                </span>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

/** 「기록」 탭 스켈레톤 — 도구 줄(세그먼트 M 「최고 기록 · 모든 기록」 | 고스트 정렬 M) →16→ 표 줄 */
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
                <SegmentedControl
                    size="sm"
                    label={t("profile.records.viewLabel")}
                    value="best"
                    onValueChange={noop}
                    options={(["best", "all"] as const).map((key) => ({
                        value: key,
                        label: t(`profile.records.${key}`, { count: "" }),
                    }))}
                />
                <SortTriggerSkeleton
                    label={t("profile.records.sort.value")}
                    size="sm"
                />
            </div>
            <div className="nl-profile-plays__content" aria-hidden="true">
                <ProfilePlayListSkeleton count={8} />
            </div>
        </section>
    );
}
