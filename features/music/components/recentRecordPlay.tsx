"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "@/components/i18n/localeProvider";
import { rankAssetNames } from "@/components/music/musicDetailConfig";
import type { RecentChartPlay } from "@/components/music/musicDetailTypes";
import { getBestScoreDifference } from "@/lib/music/recentPlayStats";

export default function RecentRecordPlay({ play }: { play: RecentChartPlay }) {
    const locale = useLocale();
    const t = useTranslations();
    const count = (value: number | null) =>
        value === null ? "—" : value.toLocaleString(locale);
    const date = play.play_time
        .replace("T", " ")
        .replaceAll("/", "-")
        .slice(0, 16);
    const rank = rankAssetNames[play.rank.toUpperCase()];
    const difference = getBestScoreDifference(play.score, play.best_score);
    const timing =
        play.fast_count !== null && play.slow_count !== null
            ? play.fast_count - play.slow_count
            : null;
    const metrics = [
        { label: t("music.record.maxCombo"), value: count(play.max_combo) },
        { label: "Grd", value: count(play.grade_basic / 100) },
        ...(play.class_basic
            ? [{ label: "Basic", value: play.class_basic }]
            : []),
        {
            label: t("record.bestDifference"),
            value:
                difference === null
                    ? "—"
                    : `${difference > 0 ? "+" : ""}${count(difference)}`,
        },
        { label: "FAST", value: count(play.fast_count) },
        { label: "SLOW", value: count(play.slow_count) },
        {
            label: t("record.timingBias"),
            value:
                timing === null
                    ? "—"
                    : timing === 0
                      ? t("record.balanced")
                      : `${timing > 0 ? "FAST" : "SLOW"} +${count(Math.abs(timing))}`,
        },
        { label: "S-Just", value: count(play.judge_sjust) },
        { label: "Just", value: count(play.judge_just) },
        { label: "Good", value: count(play.judge_good) },
        { label: "Miss", value: count(play.judge_miss) },
        { label: "Near", value: count(play.judge_near) },
    ];
    return (
        <li>
            <details>
                <summary
                    className="nl-recent-play nl-body-secondary"
                    aria-label={t("music.recent.detailLabel", {
                        date,
                        score: count(play.score),
                    })}
                >
                    <time className="nl-muted">{date}</time>
                    <span className="nl-recent-play__score">
                        {rank ? (
                            <Image
                                src={`/grade/grade_${rank}.png`}
                                alt={t("music.record.rankLabel", {
                                    rank: play.rank,
                                })}
                                width={18}
                                height={18}
                            />
                        ) : (
                            <span className="nl-recent-play__rank">
                                {play.rank}
                            </span>
                        )}
                        <span className="nl-metric-value">
                            {count(play.score)}
                        </span>
                    </span>
                </summary>
                <dl className="nl-recent-play__details nl-facts nl-body-secondary">
                    {metrics.map((metric) => (
                        <div key={metric.label}>
                            <dt>{metric.label}</dt>
                            <dd className="nl-metric-value">{metric.value}</dd>
                        </div>
                    ))}
                </dl>
            </details>
        </li>
    );
}
