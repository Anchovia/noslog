import Link from "next/link";

import {
    getJacketUrl,
    getTierRecordStatus,
    type TierRecord,
} from "@/lib/tiers";
import { cn } from "@/lib/utils";

interface TierChartCardProps {
    chart: {
        difficulty: string;
        music: {
            index: string;
            title: string;
            background: string | null;
        };
    };
    record?: TierRecord;
    showRecord: boolean;
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
    return record ? rankIconNames[record.rank.toUpperCase()] : undefined;
}

// 서열표의 채보를 자켓 중심 카드로 표시함
export default function TierChartCard({
    chart,
    record,
    showRecord,
}: TierChartCardProps) {
    const status = showRecord ? getTierRecordStatus(record) : "played";
    const rankIconName = showRecord ? getRankIconName(record) : undefined;

    return (
        <Link
            href={`/music/${chart.music.index}/${chart.difficulty.toLowerCase()}?tab=tier`}
            title={`${chart.music.title} ${chart.difficulty}`}
            className={cn(
                "bg-surface-muted relative aspect-square min-w-0 overflow-hidden rounded-md ring-1 transition-transform active:scale-[0.98]",
                status === "pianist" && "ring-score",
                status === "fc" && "ring-rank-fc",
                status !== "pianist" && status !== "fc" && "ring-border",
                status === "unplayed" && "opacity-55"
            )}
        >
            <span
                className="absolute inset-0 bg-cover bg-center"
                style={{
                    backgroundImage: `url(${getJacketUrl(
                        chart.music.index,
                        chart.music.background
                    )})`,
                }}
                aria-hidden
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
                        ? chart.music.title
                        : record?.score && record.score > 0
                          ? record.score.toLocaleString("ko-KR")
                          : "미플레이"}
                </span>
            </span>
        </Link>
    );
}
