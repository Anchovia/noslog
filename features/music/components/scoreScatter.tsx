"use client";

import { useId } from "react";

import { useLocale, useTranslations } from "@/components/i18n/localeProvider";
import type { ChartDetail } from "@/components/music/musicDetailTypes";
import type { ChartScorePlayer } from "@/features/music/schemas/chartRankingSchema";
import useElementWidth from "@/lib/hooks/useElementWidth";
import ScorePins from "./scorePins";

const HEIGHT = 190;
// 위 = 「나 · 상위 N%」 라벨 줄, 아래 = 기준선 라벨 줄 (2026-09-17 D1)
const PAD = { top: 28, bottom: 28 };
const MAX = 1_000_000;
const SAMPLES = 120;
/** 「990k」 라벨(끝 정렬, 4 띄움)과 「Pianist」 라벨(끝 정렬)이 겹치지 않는 최소 간격 */
const LABEL_GAP = 36;

/**
 * 가우스 커널 밀도 — 점수마다 종 모양을 더한다. 폭 = 0.4 · σ · n^-1/5(Silverman 기준의 약 0.4배)와 축 폭 4% 중 큰 값 —
 * 인원이 적어도 점 대신 곡선이되, 몰린 곳 모양은 보이게 (2026-09-17 사용자 결정: 0.4배)
 */
export function densityAt(scores: number[], min: number, max: number) {
    const mean =
        scores.reduce((sum, score) => sum + score, 0) / (scores.length || 1);
    const spread = Math.sqrt(
        scores.reduce((sum, score) => sum + (score - mean) ** 2, 0) /
            (scores.length || 1)
    );
    const bandwidth = Math.max(
        0.4 * spread * Math.max(1, scores.length) ** -0.2,
        (max - min) * 0.04
    );
    return (at: number) =>
        scores.reduce(
            (sum, score) =>
                sum + Math.exp(-0.5 * ((at - score) / bandwidth) ** 2),
            0
        );
}

export function scoreDensity(
    scores: number[],
    min: number,
    max: number,
    samples = SAMPLES
) {
    const at = densityAt(scores, min, max);
    return Array.from({ length: samples }, (_, index) => {
        const value = min + (index / (samples - 1)) * (max - min);
        return { at: value, density: at(value) };
    });
}

/** 가로 점수 축의 왼쪽 끝 — 기본 925k(폰 폭은 990k · Pianist 라벨이 들어가게 좁힘), 하위 5% 점수가 더 낮으면 거기까지 */
export function scoreDomainMin(scores: number[], plotWidth: number) {
    const base =
        plotWidth >= 300
            ? 925_000
            : MAX - Math.ceil((plotWidth * 250) / 5_000) * 5_000;
    if (!scores.length) return base;
    const sorted = [...scores].sort((a, b) => b - a);
    const low = sorted[Math.floor(0.95 * (sorted.length - 1))];
    return Math.min(base, Math.floor(low / 5_000) * 5_000);
}

/**
 * 점수 분포 곡선(D1) — 가로 점수(왼쪽 낮음 → 오른쪽 Pianist) · 높이 = 그 점수대 인원.
 * 세로 기준선 S 950k · 990k · Pianist(라벨은 아래). 내 점수 = 세로선 + 「나 · 상위 N%」, 내 점수 오른쪽(나보다 높은 사람) 면을 진하게.
 * 인원이 적어도 점 대신 완만한 곡선 하나(2026-09-17 사용자 결정). 스크린 리더에는 구간별 인원 표
 */
export default function ScoreScatter({
    scores,
    distribution,
    participants,
    userScore,
    userTopPercent,
    players = [],
    meId = null,
    onShowPlayer,
}: {
    scores: number[];
    distribution: ChartDetail["scoreDistribution"];
    participants: number;
    userScore: number | null;
    userTopPercent: number | null;
    /** 곡선 위 사진 핀(참가자 30명 이하면 모두, 넘으면 상위 3명 + 나) */
    players?: ChartScorePlayer[];
    meId?: number | null;
    onShowPlayer?: (player: ChartScorePlayer) => void;
}) {
    const t = useTranslations();
    const locale = useLocale();
    const id = useId();
    const svgId = id.replace(/[^\w-]/g, "");
    const { ref, width } = useElementWidth<HTMLDivElement>();
    const min = scoreDomainMin(scores, width);
    const baseline = HEIGHT - PAD.bottom;
    const x = (score: number) =>
        ((Math.max(min, Math.min(MAX, score)) - min) / (MAX - min)) * width;
    const highSkill = distribution.reduce((sum, band) => sum + band.count, 0);
    const description = t("ranking.highSkill", {
        count: highSkill.toLocaleString(locale),
    });
    const me =
        userScore !== null && userTopPercent !== null
            ? { x: x(userScore), percent: userTopPercent }
            : null;
    const density = scores.length ? scoreDensity(scores, min, MAX) : [];
    const peak = Math.max(1e-9, ...density.map((sample) => sample.density));
    const y = (value: number) =>
        baseline - (value / peak) * (baseline - PAD.top - 8);
    const densityOf = scores.length ? densityAt(scores, min, MAX) : () => 0;
    const points = density.map(
        (sample) => `${x(sample.at).toFixed(1)},${y(sample.density).toFixed(1)}`
    );
    const line = points.length ? `M${points.join(" L")}` : "";
    const area = points.length
        ? `M0,${baseline} L${points.join(" L")} L${width},${baseline} Z`
        : "";
    const tight = x(MAX) - x(990_000) < LABEL_GAP;
    const guides = [
        { value: 950_000, label: "S 950k", anchor: "middle", dx: 0 },
        // 폭이 좁아 Pianist 라벨과 겹치면 990k 는 선만 둔다
        { value: 990_000, label: tight ? "" : "990k", anchor: "end", dx: -4 },
        { value: MAX, label: "Pianist", anchor: "end", dx: 0 },
    ] as const;
    // 내 라벨이 끝에 가까우면 그쪽 끝에 맞춰 잘리지 않게
    const meAnchor = !me
        ? "middle"
        : me.x < 56
          ? "start"
          : me.x > width - 56
            ? "end"
            : "middle";
    return (
        <figure
            className="nl-score-scatter"
            aria-label={`${t("music.info.scoreDistribution")} · ${description}`}
        >
            <figcaption className="nl-score-scatter__header">
                <h2 className="nl-section-title">
                    {t("music.info.scoreDistribution")}
                </h2>
                <span className="nl-metadata nl-muted">
                    {t("ranking.participants", {
                        count: participants.toLocaleString(locale),
                    })}
                </span>
            </figcaption>
            <div ref={ref} className="nl-score-scatter__plot">
                {width ? (
                    <svg
                        width="100%"
                        height={HEIGHT}
                        className="nl-score-scatter__svg"
                        aria-hidden
                    >
                        <defs>
                            <linearGradient
                                id={`${svgId}-fill`}
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >
                                <stop
                                    offset="0"
                                    className="nl-score-scatter__stop-top"
                                />
                                <stop
                                    offset="1"
                                    className="nl-score-scatter__stop-bottom"
                                />
                            </linearGradient>
                            {me ? (
                                <clipPath id={`${svgId}-above`}>
                                    <rect
                                        x={me.x}
                                        y={0}
                                        width={Math.max(0, width - me.x)}
                                        height={HEIGHT}
                                    />
                                </clipPath>
                            ) : null}
                        </defs>
                        {guides
                            .filter((guide) => guide.value >= min)
                            .map((guide) => (
                                <g key={guide.value}>
                                    <line
                                        x1={x(guide.value)}
                                        x2={x(guide.value)}
                                        y1={PAD.top}
                                        y2={baseline}
                                        className="nl-score-scatter__guide"
                                    />
                                    {guide.label ? (
                                        <text
                                            x={x(guide.value) + guide.dx}
                                            y={HEIGHT - 10}
                                            className="nl-score-scatter__label"
                                            textAnchor={guide.anchor}
                                        >
                                            {guide.label}
                                        </text>
                                    ) : null}
                                </g>
                            ))}
                        {area ? (
                            <g className="nl-score-scatter__curve">
                                <path
                                    d={area}
                                    fill={`url(#${svgId}-fill)`}
                                    className={
                                        me
                                            ? "nl-score-scatter__area nl-score-scatter__area--below"
                                            : "nl-score-scatter__area"
                                    }
                                />
                                {me ? (
                                    <path
                                        d={area}
                                        fill={`url(#${svgId}-fill)`}
                                        clipPath={`url(#${svgId}-above)`}
                                        className="nl-score-scatter__area"
                                    />
                                ) : null}
                                <path
                                    d={line}
                                    className="nl-score-scatter__line"
                                />
                            </g>
                        ) : null}
                        {me ? (
                            <g className="nl-score-scatter__me">
                                <line
                                    x1={me.x}
                                    x2={me.x}
                                    y1={PAD.top}
                                    y2={baseline}
                                    className="nl-score-scatter__me-line"
                                />
                                <text
                                    x={me.x}
                                    y={PAD.top - 10}
                                    textAnchor={meAnchor}
                                    className="nl-score-scatter__label nl-score-scatter__label--me"
                                >
                                    {t("ranking.meTop", {
                                        percent: me.percent,
                                    })}
                                </text>
                            </g>
                        ) : null}
                    </svg>
                ) : null}
                {width && players.length && onShowPlayer ? (
                    <ScorePins
                        players={players}
                        meId={meId}
                        width={width}
                        x={x}
                        y={(score) => y(densityOf(score))}
                        onShowPlayer={onShowPlayer}
                    />
                ) : null}
            </div>
            <p className="sr-only" id={id}>
                {description}
            </p>
            <table className="sr-only" aria-describedby={id}>
                <caption>{t("ranking.scoreScatter")}</caption>
                <thead>
                    <tr>
                        <th scope="col">{t("ranking.scoreBand")}</th>
                        <th scope="col">{t("ranking.playerCount")}</th>
                    </tr>
                </thead>
                <tbody>
                    {distribution.map((band) => (
                        <tr key={band.key}>
                            <th scope="row">{band.label}</th>
                            <td className="nl-score-distribution__count">
                                {band.count.toLocaleString(locale)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </figure>
    );
}
