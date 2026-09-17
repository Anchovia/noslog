"use client";

import { useId } from "react";

import { useLocale, useTranslations } from "@/components/i18n/localeProvider";
import type { ChartDetail } from "@/components/music/musicDetailTypes";
import type { ChartScorePlayer } from "@/features/music/schemas/chartRankingSchema";
import useElementWidth from "@/lib/hooks/useElementWidth";
import ScorePins from "./scorePins";

/** 핀 줄 48 + 자 → 라벨 8 + 라벨 줄 16 (2026-09-18 · 간격 척도) */
const HEIGHT = 72;
/** 점수 자(가로선)의 y — 위로 나 핀 32 + 꼬리 + 「+N」 이 들어간다 */
const AXIS = 48;
/** 자 아래 8 을 띄우고 12 글자의 기준선까지 */
const LABEL_BASELINE = AXIS + 8 + 13;
const MAX = 1_000_000;
/** 「990k」 라벨(끝 정렬, 4 띄움)과 「Pianist」 라벨(끝 정렬)이 겹치지 않는 최소 간격 */
const LABEL_GAP = 36;

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
 * 점수 자 위의 참가자(2026-09-18 V1+V4) — 가로 점수(왼쪽 낮음 → 오른쪽 Pianist) 위에 참가자를 점으로 찍고,
 * 그중 사진 핀(참가자 30명 이하면 모두, 넘으면 상위 3명 + 나)을 선 위에 한 줄로 세운다. 높이는 아무 뜻도 없다 —
 * 분포(세로축)는 인원이 적을 때 없는 봉우리를 그려 물렸다. 스크린 리더에는 구간별 인원 표
 */
export default function ScoreScatter({
    scores,
    distribution,
    players = [],
    meId = null,
    onShowPlayer,
}: {
    scores: number[];
    distribution: ChartDetail["scoreDistribution"];
    /** 점수 자 위 사진 핀(참가자 30명 이하면 모두, 넘으면 상위 3명 + 나) */
    players?: ChartScorePlayer[];
    meId?: number | null;
    onShowPlayer?: (player: ChartScorePlayer) => void;
}) {
    const t = useTranslations();
    const locale = useLocale();
    const id = useId();
    const { ref, width } = useElementWidth<HTMLDivElement>();
    const min = scoreDomainMin(scores, width);
    const x = (score: number) =>
        ((Math.max(min, Math.min(MAX, score)) - min) / (MAX - min)) * width;
    const highSkill = distribution.reduce((sum, band) => sum + band.count, 0);
    const description = t("ranking.highSkill", {
        count: highSkill.toLocaleString(locale),
    });
    const myScore =
        players.find((player) => player.user_id === meId)?.score ?? null;
    const tight = x(MAX) - x(990_000) < LABEL_GAP;
    const guides = [
        { value: 950_000, label: "950k", anchor: "middle", dx: 0, goal: "s" },
        // 폭이 좁아 Pianist 라벨과 겹치면 990k 라벨은 뺀다
        {
            value: 990_000,
            label: tight ? "" : "990k",
            anchor: "end",
            dx: -4,
            goal: "990k",
        },
        { value: MAX, label: "Pianist", anchor: "end", dx: 0, goal: "pianist" },
    ] as const;
    return (
        <figure
            className="nl-score-scatter"
            aria-label={`${t("music.info.scoreDistribution")} · ${description}`}
        >
            <div ref={ref} className="nl-score-scatter__plot">
                {width ? (
                    <svg
                        width="100%"
                        height={HEIGHT}
                        className="nl-score-scatter__svg"
                        aria-hidden
                    >
                        <line
                            x1={0}
                            x2={width}
                            y1={AXIS}
                            y2={AXIS}
                            className="nl-score-scatter__axis"
                        />
                        {/* 참가자 한 명 = 점 하나 — 핀으로 묶인 사람도 여기에는 남는다 */}
                        {scores.map((score, index) => (
                            <circle
                                key={`${score}-${index}`}
                                cx={x(score)}
                                cy={AXIS}
                                r={score === myScore ? 4 : 3}
                                className="nl-score-scatter__dot"
                                data-me={score === myScore ? "" : undefined}
                            />
                        ))}
                        {guides
                            .filter(
                                (guide) => guide.value >= min && guide.label
                            )
                            .map((guide) => (
                                <text
                                    key={guide.value}
                                    x={x(guide.value) + guide.dx}
                                    y={LABEL_BASELINE}
                                    className="nl-score-scatter__label"
                                    data-goal={guide.goal}
                                    textAnchor={guide.anchor}
                                >
                                    {guide.label}
                                </text>
                            ))}
                    </svg>
                ) : null}
                {width && players.length && onShowPlayer ? (
                    <ScorePins
                        players={players}
                        meId={meId}
                        x={x}
                        y={AXIS}
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
