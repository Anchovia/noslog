import type {
    UserRankingMetric,
    UserRankingMode,
    UserRankingRow as RankingRow,
} from "@/lib/rankings";
import { cn } from "@/lib/utils";
import Link from "next/link";
import {
    formatRankingGrade,
    formatRankingRating,
    PODIUM_STYLES,
} from "./rankingTableUtils";
import { CountryMark, ExamBadge, UserAvatar } from "./rankingUserMeta";

interface UserRankingRowProps {
    mode: UserRankingMode;
    metric: UserRankingMetric;
    row: RankingRow;
}

export default function UserRankingRow({
    mode,
    metric,
    row,
}: UserRankingRowProps) {
    return (
        <li className="border-divider flex min-h-13 items-center gap-3 border-t px-3 first:border-t-0">
            <span
                className={cn(
                    "w-6 shrink-0 text-center text-sm font-bold tabular-nums",
                    PODIUM_STYLES[row.rank - 1] || "text-text-disabled"
                )}
            >
                {row.rank}
            </span>
            <UserAvatar avatar={row.avatar} username={row.username} />
            <div className="min-w-0 flex-1">
                <div className="flex min-w-0 items-center gap-2">
                    <span className="text-text-secondary shrink-0">
                        <CountryMark country={row.country} />
                    </span>
                    <Link
                        href={`/profile/${row.id}`}
                        className="text-text-primary min-w-0 truncate text-sm font-semibold"
                    >
                        {row.username || "이름 없는 유저"}
                    </Link>
                    <ExamBadge mode={mode} exam={row.exam} />
                </div>
            </div>
            {metric === "rating" ? (
                <strong className="text-text-primary shrink-0 text-sm tabular-nums">
                    {formatRankingRating(row.rating ?? 0)}
                </strong>
            ) : (
                <strong className="text-text-primary shrink-0 text-sm tabular-nums">
                    Grd {formatRankingGrade(row.grade)}
                </strong>
            )}
        </li>
    );
}
