"use client";

import { ChevronDown, ChevronRight, Info } from "lucide-react";

import { useTranslations } from "@/components/i18n/localeProvider";
import type { MessageKey } from "@/components/i18n/localeProvider";
import { BarListSkeleton } from "@/components/ui/barList";
import Disclosure from "@/components/ui/disclosure";
import { judgementLabels } from "@/components/ui/judgementMarker";
import ScalePicker from "@/components/ui/scalePicker";
import { SegmentedControl } from "@/components/ui/segmentedControl";
import { SkeletonText } from "@/components/ui/skeleton";
import { StatStripSkeleton } from "@/components/ui/statStrip";
import { PATTERN_AXES } from "@/features/music/schemas/communitySchema";
import ChartLeaderboard from "./chartLeaderboard";
import { CommunityOpinionRowSkeleton } from "./communityOpinionRow";
import { MusicRecordGuest } from "./musicRecordPanel";

const noop = () => {};
const judgements = [
    ["judge_sjust", judgementLabels.sjust],
    ["judge_just", judgementLabels.just],
    ["judge_good", judgementLabels.good],
    ["judge_miss", judgementLabels.miss],
] as const;
const noteLabels: MessageKey[] = [
    "music.filter.standard",
    "music.filter.tenuto",
    "music.filter.glissando",
    "music.filter.trill",
];
const scopes = [
    { mode: "basic", goal: "s" },
    { mode: "basic", goal: "990k" },
    { mode: "basic", goal: "pianist" },
    { mode: "recital", goal: null },
] as const;

/**
 * 악곡 상세 탭 불러오기(2026-09-19 로딩 시안 S1) — 탭마다 실제 패널과 같은 구역 · 클래스 · 순서.
 * 고정 부분(구역 제목 · 항목 이름 · 척도 · 세그먼트 · 순위표 머리)은 실제 글자와 부품, 값 · 막대 · 그래프 · 줄만 스켈레톤.
 * 곡마다 있거나 없는 구역(서열 변경 이력 · 해금 조건 · 의견 작성 칸)은 그리지 않는다. 안내 문장은 탭의 상태 문장이 맡는다
 */
export default function MusicDetailLoading({
    tab,
    signedIn,
    musicIndex,
    difficulty,
}: {
    tab: "detail" | "record" | "ranking" | "tier";
    signedIn: boolean;
    musicIndex: string;
    difficulty: string;
}) {
    if (tab === "record" && !signedIn)
        return (
            <MusicRecordGuest musicIndex={musicIndex} difficulty={difficulty} />
        );
    if (tab === "record") return <RecordLoading />;
    if (tab === "ranking") return <RankingLoading signedIn={signedIn} />;
    if (tab === "tier") return <CommunityLoading signedIn={signedIn} />;
    return <OverviewLoading signedIn={signedIn} />;
}

function OverviewLoading({ signedIn }: { signedIn: boolean }) {
    const t = useTranslations();
    return (
        <div className="nl-overview" aria-hidden="true" inert>
            <section className="nl-overview__section">
                <div className="nl-heading-row">
                    <h2 className="nl-section-title">{t("pattern.title")}</h2>
                    <span className="nl-info-trigger">
                        <Info className="nl-icon-small" aria-hidden />
                    </span>
                    <span className="nl-heading-link nl-control">
                        {t("pattern.evaluate")}
                        <ChevronRight aria-hidden />
                    </span>
                </div>
                <div className="nl-overview__card">
                    <BarListSkeleton
                        labels={PATTERN_AXES.map((axis) =>
                            t(`pattern.axis.${axis}`)
                        )}
                    />
                </div>
            </section>
            <section className="nl-overview__section">
                <div className="nl-heading-row">
                    <h2 className="nl-section-title">{t("detail.record")}</h2>
                    {signedIn ? null : (
                        <span className="nl-heading-link nl-control">
                            {t("detail.myBestLogin")}
                            <ChevronRight aria-hidden />
                        </span>
                    )}
                </div>
                {signedIn ? (
                    <StatStripSkeleton
                        labels={[
                            t("music.record.bestScore"),
                            t("rankings.myRank"),
                            t("record.playCount"),
                        ]}
                    />
                ) : null}
            </section>
            <section className="nl-overview__section">
                <h2 className="nl-section-title">{t("detail.chartInfo")}</h2>
                <dl className="nl-facts nl-body-secondary nl-overview__card nl-overview__card--list">
                    {[
                        "BPM",
                        t("music.info.noteCount"),
                        t("detail.duration"),
                        t("music.info.releaseDate"),
                    ].map((label) => (
                        <div key={label}>
                            <dt>{label}</dt>
                            <dd className="nl-metric-value">
                                <SkeletonText
                                    className="nl-metric-value"
                                    sample="0,000"
                                />
                            </dd>
                        </div>
                    ))}
                </dl>
            </section>
        </div>
    );
}

function RecordLoading() {
    const t = useTranslations();
    return (
        <div className="nl-record-panel" aria-hidden="true" inert>
            <div className="nl-record-disclosures">
                <Disclosure heading="section" title={t("record.best")} open>
                    <StatStripSkeleton
                        labels={[
                            t("music.record.bestScore"),
                            t("ranking.grade"),
                            t("music.record.maxCombo"),
                        ]}
                    />
                </Disclosure>
                <Disclosure
                    heading="section"
                    title={t("record.cumulative")}
                    open
                >
                    <StatStripSkeleton
                        labels={[
                            t("record.playCount"),
                            t("music.record.fullCombo"),
                            "Pianist",
                        ]}
                    />
                </Disclosure>
                <Disclosure
                    title={t("record.analysis")}
                    heading="section"
                    className="nl-record-analysis"
                    open
                >
                    <div className="nl-analysis-content">
                        <section className="nl-detail-panel">
                            <div className="nl-heading-row">
                                <h3 className="nl-component-title">
                                    {t("music.judgement.summary")}
                                </h3>
                            </div>
                            <div className="nl-stacked-bar">
                                {[
                                    t("music.judgement.meLabel"),
                                    t("community.mean"),
                                ].map((label) => (
                                    <div
                                        key={label}
                                        className="nl-stacked-bar__row"
                                    >
                                        <span className="nl-metadata nl-muted">
                                            {label}
                                        </span>
                                        <span className="nl-stacked-bar__track nl-skeleton" />
                                    </div>
                                ))}
                            </div>
                        </section>
                        <div className="nl-detail-columns">
                            <section className="nl-detail-panel">
                                <h3 className="nl-component-title">
                                    {t("music.recent.judgement")}
                                </h3>
                                <dl className="nl-facts nl-analysis-values nl-body-secondary">
                                    {judgements.map(([key, label]) => (
                                        <div key={key}>
                                            <dt>
                                                <span
                                                    className="nl-judgement-label"
                                                    data-judgement={key}
                                                >
                                                    {label}
                                                </span>
                                            </dt>
                                            <dd>
                                                <span className="nl-inline">
                                                    <SkeletonText
                                                        className="nl-metric-value"
                                                        sample="0,000"
                                                    />
                                                    <SkeletonText
                                                        className="nl-metric-value"
                                                        sample="00.0%"
                                                    />
                                                </span>
                                            </dd>
                                        </div>
                                    ))}
                                </dl>
                            </section>
                            <section className="nl-detail-panel">
                                <h3 className="nl-component-title">
                                    {t("music.judgement.noteSuccess")}
                                </h3>
                                <dl className="nl-facts nl-analysis-values nl-body-secondary">
                                    {noteLabels.map((label) => (
                                        <div key={label}>
                                            <dt>{t(label)}</dt>
                                            <dd>
                                                <SkeletonText
                                                    className="nl-metric-value"
                                                    sample="00.00%"
                                                />
                                            </dd>
                                        </div>
                                    ))}
                                </dl>
                            </section>
                        </div>
                        <section className="nl-detail-panel">
                            <h3 className="nl-component-title">
                                {t("music.judgement.recentTrend")}
                            </h3>
                            <div className="nl-stack nl-performance-chart">
                                <SegmentedControl
                                    className="nl-performance-selector"
                                    label={t("music.trend.selector")}
                                    value="sjust"
                                    onValueChange={noop}
                                    options={[
                                        {
                                            value: "sjust",
                                            label: judgementLabels.sjust,
                                        },
                                        {
                                            value: "miss",
                                            label: judgementLabels.miss,
                                        },
                                        { value: "timing", label: "FAST/SLOW" },
                                    ]}
                                />
                                <SkeletonText
                                    className="nl-body-secondary"
                                    width="s"
                                />
                                {/* 선 그래프 틀 — 플롯(기본 높이 120) → 날짜 줄 */}
                                <figure className="nl-line-chart">
                                    <div className="nl-line-chart__plot">
                                        <div className="nl-line-chart__area">
                                            <div className="nl-line-chart__series nl-detail-loading__trend nl-skeleton" />
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
                            </div>
                        </section>
                    </div>
                </Disclosure>
                <Disclosure title={t("record.progress")} heading="section" />
                <Disclosure
                    title={t("music.record.recentPlays")}
                    heading="section"
                />
            </div>
        </div>
    );
}

function RankingLoading({ signedIn }: { signedIn: boolean }) {
    const t = useTranslations();
    return (
        <div className="nl-ranking-panel" aria-hidden="true" inert>
            {/* 점수 자(높이 72 = 핀 줄 48 + 8 + 라벨 16) 자리 — 참가자 · 범위가 곡마다 달라 통째로 */}
            <div className="nl-score-scatter">
                <div className="nl-score-scatter__plot">
                    <div className="nl-detail-loading__ruler nl-skeleton" />
                </div>
            </div>
            <section className="nl-ranking-section">
                {signedIn ? null : (
                    <div className="nl-heading-row">
                        <span className="nl-heading-link nl-control">
                            {t("ranking.signIn")}
                            <ChevronRight aria-hidden />
                        </span>
                    </div>
                )}
                <div className="nl-ranking-list nl-stack">
                    <ChartLeaderboard rows={[]} skeletonRows={10} />
                </div>
            </section>
        </div>
    );
}

function CommunityLoading({ signedIn }: { signedIn: boolean }) {
    const t = useTranslations();
    // 「의견 (N)」 — 제목 글자는 그대로, 개수 자리만 스켈레톤
    const [opinionsBefore, opinionsAfter] = t("community.opinions", {
        count: " ",
    }).split(" ");
    return (
        <div className="nl-community-panel" aria-hidden="true" inert>
            <div className="nl-community-columns">
                <div className="nl-community-contribute">
                    <Disclosure
                        className="nl-pattern-form"
                        heading="section"
                        open
                        title={t("community.patternVote")}
                    >
                        <div className="nl-pattern-lock">
                            <div className="nl-pattern-axes">
                                {PATTERN_AXES.map((axis) => (
                                    <div key={axis} className="nl-pattern-axis">
                                        <span
                                            id={`loading-pattern-${axis}`}
                                            className="nl-control"
                                        >
                                            {t(`pattern.axis.${axis}`)}
                                        </span>
                                        <ScalePicker
                                            labelId={`loading-pattern-${axis}`}
                                            value={null}
                                            onChange={noop}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Disclosure>
                    <Disclosure
                        className="nl-community-votes"
                        heading="section"
                        open
                        title={t("community.votes")}
                    >
                        {signedIn ? null : (
                            <div className="nl-heading-row">
                                <span className="nl-heading-link nl-control">
                                    {t("community.voteLoginLink")}
                                    <ChevronRight aria-hidden />
                                </span>
                            </div>
                        )}
                        <div className="nl-vote-list">
                            {scopes.map((scope) => (
                                <button
                                    key={`${scope.mode}-${scope.goal}`}
                                    type="button"
                                    className="nl-vote-row"
                                >
                                    <span
                                        className="nl-body-secondary nl-muted"
                                        lang="en"
                                    >
                                        {scope.goal
                                            ? `Basic · ${t(`community.goal.${scope.goal}`)}`
                                            : "Recital"}
                                    </span>
                                    <span>
                                        <SkeletonText
                                            className="nl-metric-value"
                                            sample="0.0"
                                        />
                                        <SkeletonText
                                            className="nl-metadata"
                                            sample={t("community.voteCount", {
                                                count: 0,
                                            })}
                                        />
                                        <ChevronDown
                                            className="nl-icon nl-disclosure__chevron"
                                            aria-hidden
                                        />
                                    </span>
                                </button>
                            ))}
                        </div>
                    </Disclosure>
                </div>
                <Disclosure
                    className="nl-opinions"
                    heading="section"
                    open
                    title={
                        <>
                            {opinionsBefore}
                            <SkeletonText
                                className="nl-section-title"
                                sample="0"
                            />
                            {opinionsAfter}
                        </>
                    }
                >
                    {signedIn ? null : (
                        <div className="nl-heading-row">
                            <span className="nl-heading-link nl-control">
                                {t("community.opinionLoginAction")}
                                <ChevronRight aria-hidden />
                            </span>
                        </div>
                    )}
                    <div className="nl-opinions__body">
                        <div className="nl-opinions__list">
                            {[0, 1].map((index) => (
                                <CommunityOpinionRowSkeleton key={index} />
                            ))}
                        </div>
                    </div>
                </Disclosure>
            </div>
        </div>
    );
}
