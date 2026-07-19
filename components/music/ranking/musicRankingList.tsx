import { cn } from "@/lib/utils";
import Link from "next/link";

import type { RankingRow } from "./musicRankingTypes";
import RankImage from "./rankImage";
import RankingUserAvatar from "./rankingUserAvatar";

interface MusicRankingListProps {
    rows: RankingRow[];
    page: number;
    pageSize: number;
}

const podiumStyles = ["text-score", "text-text-primary", "text-bronze"];

// 현재 페이지의 악곡 랭킹 목록을 표시함
export default function MusicRankingList({
    rows,
    page,
    pageSize,
}: MusicRankingListProps) {
    return (
        <section className="bg-surface rounded-card overflow-hidden">
            {rows.length > 0 ? (
                <ol>
                    {rows.map((row, index) => {
                        const position = (page - 1) * pageSize + index + 1;
                        const isPianist =
                            row.fc_type === 3 || row.score >= 1000000;

                        return (
                            <li
                                key={row.user_id}
                                className="border-divider grid min-h-12 grid-cols-[1.5rem_1.75rem_minmax(0,1fr)_1.25rem_4.75rem_1.5rem] items-center gap-2 border-t px-3 first:border-t-0"
                            >
                                <span
                                    className={cn(
                                        "text-center text-sm font-bold tabular-nums",
                                        podiumStyles[position - 1] ||
                                            "text-text-disabled"
                                    )}
                                >
                                    {position}
                                </span>
                                <RankingUserAvatar user={row.user} />
                                <Link
                                    href={`/profile/${row.user.id}`}
                                    className="text-text-primary min-w-0 truncate text-sm font-semibold"
                                >
                                    {row.user.username || "이름 없는 유저"}
                                </Link>
                                <RankImage rank={row.rank} />
                                <strong
                                    className={cn(
                                        "text-right text-sm tabular-nums",
                                        isPianist
                                            ? "text-score"
                                            : "text-text-primary"
                                    )}
                                >
                                    {row.score.toLocaleString("ko-KR")}
                                </strong>
                                {row.fc_type >= 2 ? (
                                    <span className="border-rank-fc/40 text-rank-fc rounded border py-0.5 text-center text-[10px] leading-none font-black">
                                        FC
                                    </span>
                                ) : (
                                    <span />
                                )}
                            </li>
                        );
                    })}
                </ol>
            ) : (
                <div className="text-text-disabled flex h-32 items-center justify-center text-sm">
                    등록된 랭킹 기록이 없습니다.
                </div>
            )}
        </section>
    );
}
