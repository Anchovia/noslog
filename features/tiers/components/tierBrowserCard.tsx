"use client";

/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import {
    useLocale,
    useLocalizedHref,
    useTranslations,
} from "@/components/i18n/localeProvider";
import MusicJacket from "@/components/music/musicJacket";
import { FullComboMark } from "@/features/music/components/chartLeaderboard";
import { serializeTierBrowserQuery } from "@/features/tiers/schemas/tierBrowserSchema";
import { isTierGoalAchieved } from "@/lib/tiers";
import type {
    TierBrowserEntry,
    TierBrowserQuery,
} from "@/features/tiers/schemas/tierBrowserSchema";

const ranks: Record<string, string> = {
    P: "p",
    S: "s",
    "A+": "a2",
    A: "a",
    "B+": "b2",
    B: "b",
    C: "c",
    D: "d",
};

export default function TierBrowserCard({
    entry,
    query,
    signedIn,
    pending,
}: {
    entry: TierBrowserEntry;
    query: TierBrowserQuery;
    signedIn: boolean;
    pending: boolean;
}) {
    const locale = useLocale();
    const href = useLocalizedHref();
    const t = useTranslations();
    const { chart, record } = entry;
    const pianist = Boolean(
        record && (record.fc_type === 3 || record.score >= 1_000_000)
    );
    const fc = Boolean(record && record.fc_type >= 2 && !pianist);
    const rank = record
        ? pianist
            ? "p"
            : ranks[record.rank.toUpperCase()]
        : undefined;
    const score = record
        ? record.score.toLocaleString(locale)
        : t("tiers.unplayed");
    // 이 표 기준(S · 990k · Pianist)을 달성했는가 — 테두리와 점수가 그 표의 기준 색을 쓴다
    const goalAchieved = signedIn && isTierGoalAchieved(record, query.goal);
    // 테두리: 달성 + FC = 초록 → 기준 색 그라데이션 · 달성 = 기준 색(Pianist 는 퍼펙트라 FC 여도 기준 색 하나).
    // 달성 못 한 FC 는 테두리 없음(2026-09-17 사용자 결정)
    const achievement = goalAchieved ? (fc ? "goal-fc" : "goal") : undefined;
    const params = new URLSearchParams({
        tab: "tier",
        source: "tiers",
        mode: query.mode,
        goal: query.goal,
        returnTo: href(`/tiers?${serializeTierBrowserQuery(query)}`),
    });
    return (
        <Link
            className="nl-tier-card"
            data-detailed={query.detailed}
            data-goal={query.goal}
            aria-disabled={pending || undefined}
            tabIndex={pending ? -1 : undefined}
            href={href(
                `/music/${encodeURIComponent(chart.music.index)}/${chart.difficulty.toLowerCase()}?${params}`
            )}
            aria-label={`${chart.music.title} · ${chart.difficulty} ${chart.level} · ${t("detail.tier")}${signedIn ? ` · ${score}${pianist ? " · Pianist" : fc ? " · Full Combo" : ""}${goalAchieved ? ` · ${t("tiers.goalAchieved")}` : ""}` : ""}`}
            onClick={(event) => {
                if (pending) event.preventDefault();
            }}
        >
            <MusicJacket
                appearance="foundation"
                {...chart.music}
                className="nl-tier-card__jacket"
            >
                <span
                    className="nl-tier-card__outline"
                    data-achievement={achievement}
                    aria-hidden
                />
                {/* 기본 보기 자켓 위에는 오른쪽 아래 난이도 판만 — 같은 구간에 한 곡의 여러 난이도가 있어도 구분되게.
                    등급 메달·FC 마크는 테두리와 점수 색이 대신한다. 상세 보기는 점수 띠에 메달·FC 그대로 */}
                {signedIn && rank && query.detailed ? (
                    <img
                        className="nl-tier-card__rank"
                        src={`/grade/grade_${rank}.png`}
                        alt=""
                    />
                ) : null}
                {!query.detailed ? (
                    <span
                        className="nl-tier-card__difficulty nl-metadata"
                        data-difficulty={chart.difficulty.toLowerCase()}
                        aria-hidden
                    >
                        {chart.difficulty} {chart.level}
                    </span>
                ) : null}
                {signedIn && query.detailed ? (
                    <span className="nl-tier-card__score-band nl-metric-value">
                        {fc && record ? (
                            <FullComboMark fcType={record.fc_type} />
                        ) : null}
                        <span>{score}</span>
                    </span>
                ) : null}
            </MusicJacket>
            {signedIn && !query.detailed ? (
                <span
                    className="nl-tier-card__score nl-metric-value"
                    data-achieved={goalAchieved || undefined}
                >
                    {score}
                </span>
            ) : null}
            {query.detailed ? (
                <>
                    <span className="nl-component-title">
                        {chart.music.title}
                    </span>
                    {chart.music.localizedTitle ? (
                        <span className="nl-metadata nl-muted">
                            {chart.music.localizedTitle}
                        </span>
                    ) : null}
                    {/* 난이도명·레벨 모두 난이도 색 글자(DISC-45, 다른 결과 화면과 같은 nl-level-- 클래스) */}
                    <span
                        className={`nl-body-secondary nl-level--${chart.difficulty.toLowerCase()}`}
                    >
                        {chart.difficulty} {chart.level}
                    </span>
                    {signedIn &&
                    record?.grade !== null &&
                    record?.grade !== undefined ? (
                        <span className="nl-control nl-muted">
                            {t("rankings.metric.grade")} +
                            {record.grade.toLocaleString(locale, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            })}
                        </span>
                    ) : null}
                    {signedIn &&
                    record?.rating !== null &&
                    record?.rating !== undefined ? (
                        <span className="nl-control nl-muted">
                            {t("rankings.metric.rating")} +
                            {record.rating.toLocaleString(locale, {
                                minimumFractionDigits: 1,
                                maximumFractionDigits: 1,
                            })}
                        </span>
                    ) : null}
                </>
            ) : null}
        </Link>
    );
}
