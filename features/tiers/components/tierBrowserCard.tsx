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
    // 테두리 = 점수 단계 S < 990k < Pianist. FC 는 왼쪽 아래 마크가 말하고, S 미만 FC 만 초록 테두리
    const achievement = pianist
        ? "pianist"
        : isTierGoalAchieved(record, "990k")
          ? "990k"
          : isTierGoalAchieved(record, "s")
            ? "s"
            : fc
              ? "fc"
              : undefined;
    const rank = record
        ? pianist
            ? "p"
            : ranks[record.rank.toUpperCase()]
        : undefined;
    const score = record
        ? record.score.toLocaleString(locale)
        : t("tiers.unplayed");
    // 이 표 기준(S · 990k · Pianist)을 달성하면 점수를 그 표의 기준 색으로 — 테두리(단계)와 역할을 나눈다
    const goalAchieved = signedIn && isTierGoalAchieved(record, query.goal);
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
                {signedIn && rank ? (
                    <img
                        className="nl-tier-card__rank"
                        src={`/grade/grade_${rank}.png`}
                        alt=""
                    />
                ) : null}
                {/* FC 마크는 자켓 왼쪽 아래 — 오른쪽 아래 등급 메달과 짝. 상세 보기는 점수 띠 왼쪽 끝 */}
                {signedIn && fc && record && !query.detailed ? (
                    <span className="nl-tier-card__fc">
                        <FullComboMark fcType={record.fc_type} />
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
                    data-goal={goalAchieved ? query.goal : undefined}
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
