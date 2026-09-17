"use client";

import { ChevronDown } from "lucide-react";
import Image from "next/image";
import { useLocale, useTranslations } from "@/components/i18n/localeProvider";
import {
    rankAssetNames,
    rankDisplayName,
} from "@/components/music/musicDetailConfig";
import { judgementLabels } from "@/components/ui/judgementMarker";
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
        {
            label: t("music.record.maxCombo"),
            value: play.max_combo === null ? "—" : `${count(play.max_combo)}x`,
            numeric: true,
        },
        // Grd 는 머리와 같은 소수 둘째 자리 표기
        {
            label: "Grd",
            value: (play.grade_basic / 100).toFixed(2),
            numeric: true,
        },
        ...(play.class_basic
            ? [{ label: "Basic", value: play.class_basic, numeric: false }]
            : []),
        {
            label: t("record.bestDifference"),
            value:
                difference === null
                    ? "—"
                    : `${difference > 0 ? "+" : ""}${count(difference)}`,
            numeric: true,
        },
        { label: "FAST", value: count(play.fast_count), numeric: true },
        { label: "SLOW", value: count(play.slow_count), numeric: true },
        {
            label: t("record.timingBias"),
            value:
                timing === null
                    ? "—"
                    : timing === 0
                      ? t("record.balanced")
                      : `${timing > 0 ? "FAST" : "SLOW"} +${count(Math.abs(timing))}`,
            numeric: false,
        },
        {
            label: judgementLabels.sjust,
            value: count(play.judge_sjust),
            numeric: true,
        },
        {
            label: judgementLabels.just,
            value: count(play.judge_just),
            numeric: true,
        },
        {
            label: judgementLabels.good,
            value: count(play.judge_good),
            numeric: true,
        },
        {
            label: judgementLabels.miss,
            value: count(play.judge_miss),
            numeric: true,
        },
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
                                    rank: rankDisplayName(play.rank),
                                })}
                                width={16}
                                height={16}
                            />
                        ) : (
                            <span className="nl-recent-play__rank">
                                {rankDisplayName(play.rank)}
                            </span>
                        )}
                        <span className="nl-metric-value">
                            {count(play.score)}
                        </span>
                        <ChevronDown
                            className="nl-icon nl-disclosure__chevron"
                            aria-hidden
                        />
                    </span>
                </summary>
                <dl className="nl-recent-play__details nl-facts nl-body-secondary">
                    {metrics.map((metric) => (
                        <div key={metric.label}>
                            <dt>{metric.label}</dt>
                            <dd
                                className={
                                    metric.numeric
                                        ? "nl-metric-value"
                                        : undefined
                                }
                            >
                                {metric.value}
                            </dd>
                        </div>
                    ))}
                </dl>
            </details>
        </li>
    );
}
