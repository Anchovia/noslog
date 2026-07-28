import { formatToComma, formatToGrade } from "@/lib/utils";
import {
    getBestScoreDifference,
    getTimingBias,
} from "@/lib/music/recentPlayStats";
import { hasJudgementData } from "@/lib/music/judgementStats";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import { rankAssetNames } from "./musicDetailConfig";
import type { RecentChartPlay } from "./musicDetailTypes";

interface RecentPlayRowProps {
    play: RecentChartPlay;
}

const judgementRows = [
    { key: "judge_sjust", label: "S-Just" },
    { key: "judge_just", label: "Just" },
    { key: "judge_good", label: "Good" },
    { key: "judge_miss", label: "Miss" },
    { key: "judge_near", label: "Near" },
] as const;

export default function RecentPlayRow({ play }: RecentPlayRowProps) {
    const rankName = rankAssetNames[play.rank.toUpperCase()];
    const scoreDifference = getBestScoreDifference(play.score, play.best_score);
    const timingBias = getTimingBias(play.fast_count, play.slow_count);
    const judgementCounts = {
        judge_sjust: play.judge_sjust,
        judge_just: play.judge_just,
        judge_good: play.judge_good,
        judge_miss: play.judge_miss,
        judge_near: play.judge_near,
    };
    const hasJudgements = hasJudgementData(judgementCounts);

    return (
        <li>
            <details className="group">
                <summary
                    aria-label={`${play.play_time} ${formatToComma(play.score)}점 플레이 상세`}
                    className="hover:bg-surface-muted flex h-11 cursor-pointer list-none items-center gap-2 px-4 transition-colors [&::-webkit-details-marker]:hidden"
                >
                    <time className="text-caption text-text-disabled w-[68px] shrink-0 tabular-nums">
                        {play.play_time.split(" ")[0].replaceAll("/", ".")}
                    </time>
                    <div className="flex shrink-0 items-center gap-2">
                        {rankName ? (
                            <Image
                                src={`https://p.eagate.573.jp/game/nostalgia/op3/img/pdata/music_data/grade/grade_${rankName}.png`}
                                alt={`${play.rank} 랭크`}
                                width={20}
                                height={20}
                            />
                        ) : null}
                        <strong className="text-label font-bold tabular-nums">
                            {formatToComma(play.score)}
                        </strong>
                        <span className="text-caption text-text-disabled tabular-nums">
                            x{formatToComma(play.max_combo)}
                        </span>
                    </div>
                    <span
                        className={`text-caption ml-auto w-12 shrink-0 text-right tabular-nums ${
                            scoreDifference !== null && scoreDifference > 0
                                ? "text-success"
                                : "text-text-disabled"
                        }`}
                    >
                        {scoreDifference === null
                            ? "-"
                            : `${scoreDifference > 0 ? "+" : ""}${formatToComma(scoreDifference)}`}
                    </span>
                    <ChevronDown className="text-text-disabled size-4 shrink-0 transition-transform group-open:rotate-180" />
                </summary>

                <div className="bg-surface-muted border-divider border-t px-4 py-3">
                    <dl className="grid grid-cols-2 gap-2 text-center">
                        {[
                            { label: "FAST", value: play.fast_count },
                            { label: "SLOW", value: play.slow_count },
                        ].map(({ label, value }) => (
                            <div
                                key={label}
                                className="bg-surface rounded-md px-2 py-2"
                            >
                                <dt className="text-micro">{label}</dt>
                                <dd className="text-label mt-0.5 font-bold tabular-nums">
                                    {value === null
                                        ? "-"
                                        : formatToComma(value)}
                                </dd>
                            </div>
                        ))}
                    </dl>

                    <div className="text-caption mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
                        <span>
                            Grd{" "}
                            <strong className="text-text-primary font-semibold tabular-nums">
                                {formatToGrade(play.grade_basic)}
                            </strong>
                        </span>
                        {play.class_basic ? (
                            <span>
                                Basic{" "}
                                <strong className="text-text-primary font-semibold">
                                    {play.class_basic}
                                </strong>
                            </span>
                        ) : null}
                        {timingBias ? (
                            <span className="text-text-secondary ml-auto font-semibold tabular-nums">
                                {timingBias}
                            </span>
                        ) : null}
                    </div>

                    <div className="border-divider mt-3 border-t pt-3">
                        <h3 className="text-caption font-semibold">판정</h3>
                        {hasJudgements ? (
                            <dl className="mt-2 grid grid-cols-5 gap-1 text-center">
                                {judgementRows.map((row) => (
                                    <div
                                        key={row.key}
                                        className="bg-surface rounded-md px-1 py-2"
                                    >
                                        <dt className="text-micro whitespace-nowrap">
                                            {row.label}
                                        </dt>
                                        <dd className="text-caption text-text-primary mt-0.5 font-semibold tabular-nums">
                                            {play[row.key] === null
                                                ? "-"
                                                : formatToComma(play[row.key])}
                                        </dd>
                                    </div>
                                ))}
                            </dl>
                        ) : (
                            <p className="text-caption mt-2">
                                다시 연동하면 플레이별 판정을 확인할 수
                                있습니다.
                            </p>
                        )}
                    </div>
                </div>
            </details>
        </li>
    );
}
