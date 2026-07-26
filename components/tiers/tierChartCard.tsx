import Link from "next/link";

import {
    formatOfficialChartLevel,
    getTierRecordStatus,
    isTierGoalAchieved,
    type TierGoal,
    type TierRecord,
} from "@/lib/tiers";
import { cn } from "@/lib/utils";
import MusicJacket from "@/components/music/musicJacket";

interface TierChartCardProps {
    entryId: number;
    chart: {
        difficulty: string;
        level: number;
        music: {
            index: string;
            title: string;
            background: string | null;
        };
    };
    record?: TierRecord;
    goal: TierGoal;
    showRecord: boolean;
    selected?: boolean;
    detailPanelId?: string;
    onSelect?: () => void;
}

const rankIconBaseUrl =
    "https://p.eagate.573.jp/game/nostalgia/op3/img/pdata/music_data/grade";

const rankIconNames: Record<string, string> = {
    P: "p",
    FC: "fc_bg",
    S: "s",
    "A+": "a2",
    A: "a",
    "B+": "b2",
    B: "b",
    C: "c",
    D: "d",
};

function getRankIconName(record?: TierRecord) {
    const status = getTierRecordStatus(record);
    if (status === "pianist") return "p";
    if (status === "fc") return "fc_bg";
    if (status === "s") return "s";
    if (status === "a_plus") return "a2";
    return record ? rankIconNames[record.rank.toUpperCase()] : undefined;
}

// 서열표의 채보를 자켓 중심 카드로 표시함
export default function TierChartCard({
    entryId,
    chart,
    record,
    goal,
    showRecord,
    selected = false,
    detailPanelId,
    onSelect,
}: TierChartCardProps) {
    const status = showRecord ? getTierRecordStatus(record) : "played";
    const rankIconName = showRecord ? getRankIconName(record) : undefined;
    const achieved = showRecord ? isTierGoalAchieved(record, goal) : true;

    const className = cn(
        "focus-visible:ring-focus/40 flex min-w-0 flex-col gap-1 rounded-md text-left transition-opacity focus-visible:ring-2 focus-visible:outline-none",
        showRecord && !achieved && "opacity-55"
    );
    const content = (
        <>
            <span
                className={cn(
                    "bg-surface-muted relative aspect-square min-w-0 overflow-hidden rounded-md transition-transform duration-150 ease-out hover:scale-[1.03] active:scale-[0.98]",
                    status === "pianist" && "ring-score ring-2",
                    status === "fc" && "ring-rank-fc ring-2",
                    status === "s" && "ring-rank-s ring-2",
                    status === "a_plus" && "ring-rank-a-plus ring-2",
                    selected && "ring-chart ring-2",
                    (status === "played" || status === "unplayed") &&
                        "ring-border ring-1",
                    status === "unplayed" && "opacity-70"
                )}
            >
                <MusicJacket
                    index={chart.music.index}
                    background={chart.music.background}
                    title={chart.music.title}
                    className="absolute inset-0"
                />

                {showRecord && rankIconName ? (
                    <span
                        className="absolute top-1.5 right-1.5 size-5 bg-contain bg-center bg-no-repeat drop-shadow-md"
                        style={{
                            backgroundImage: `url(${rankIconBaseUrl}/grade_${rankIconName}.png)`,
                        }}
                        aria-hidden
                    />
                ) : null}

                <span className="bg-bg/90 absolute right-0 bottom-0 left-0 flex h-7 items-center justify-center px-2">
                    <span
                        className={cn(
                            "w-full truncate text-center text-[10px] leading-none font-semibold tabular-nums",
                            status === "pianist"
                                ? "text-score"
                                : status === "fc"
                                  ? "text-rank-fc"
                                  : "text-text-primary"
                        )}
                    >
                        {!showRecord
                            ? formatOfficialChartLevel(
                                  chart.difficulty,
                                  chart.level
                              )
                            : record?.score && record.score > 0
                              ? record.score.toLocaleString("ko-KR")
                              : "미플레이"}
                    </span>
                </span>
            </span>
            <span className="min-w-0 px-0.5">
                <strong className="text-caption text-text-primary block truncate font-semibold">
                    {chart.music.title}
                </strong>
                <span className="text-text-disabled block truncate text-[10px] font-semibold">
                    {chart.difficulty}
                    {showRecord
                        ? ` · ${formatOfficialChartLevel(chart.difficulty, chart.level)}`
                        : ""}
                </span>
            </span>
        </>
    );

    if (showRecord) {
        return (
            <button
                type="button"
                aria-controls={detailPanelId}
                aria-expanded={selected}
                aria-label={`${chart.music.title} ${chart.difficulty} 내 기록 상세`}
                className={cn(className, "cursor-pointer")}
                onClick={onSelect}
                data-tier-entry-id={entryId}
            >
                {content}
            </button>
        );
    }

    return (
        <Link
            href={`/music/${chart.music.index}/${chart.difficulty.toLowerCase()}?tab=tier`}
            aria-label={`${chart.music.title} ${chart.difficulty} ${formatOfficialChartLevel(chart.difficulty, chart.level)}`}
            className={className}
        >
            {content}
        </Link>
    );
}
