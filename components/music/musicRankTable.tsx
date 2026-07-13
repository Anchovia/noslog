import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface RankingUser {
    id: number;
    username: string | null;
    avatar: string | null;
}

interface RankingRow {
    rank: string;
    score: number;
    fc_type: number;
    user_id: number;
    user: RankingUser;
}

interface CurrentUserRanking {
    rank: number | null;
    score: number;
    clearRank: string;
    fcType: number;
    user: RankingUser;
}

interface MusicRankTableProps {
    musicIndex: string;
    difficulty: string;
    rows: RankingRow[];
    page: number;
    pageSize: number;
    totalCount: number;
    currentUser: CurrentUserRanking | null;
}

const rankAssetNames: Record<string, string> = {
    P: "p",
    S: "s",
    A2: "a2",
    "A+": "a2",
    A: "a",
    B2: "b2",
    "B+": "b2",
    B: "b",
    C: "c",
    D: "d",
};

const podiumStyles = ["text-score", "text-text-primary", "text-bronze"];

function RankImage({ rank, size = 18 }: { rank: string; size?: number }) {
    const assetName = rankAssetNames[rank.toUpperCase()];

    if (!assetName) {
        return <span className="text-text-disabled w-5 text-center">-</span>;
    }

    return (
        <Image
            src={`https://p.eagate.573.jp/game/nostalgia/op3/img/pdata/music_data/grade/grade_${assetName}.png`}
            alt={`${rank} 랭크`}
            width={size}
            height={size}
            className="shrink-0 object-contain"
        />
    );
}

function UserAvatar({ user, size = 28 }: { user: RankingUser; size?: number }) {
    return (
        <span
            className="border-border bg-surface-muted shrink-0 rounded-full border bg-cover bg-center"
            style={{
                width: size,
                height: size,
                backgroundImage: user.avatar
                    ? `url(${user.avatar})`
                    : undefined,
            }}
            aria-label={`${user.username || "이름 없는 유저"} 프로필 이미지`}
        />
    );
}

export default function MusicRankTable({
    musicIndex,
    difficulty,
    rows,
    page,
    pageSize,
    totalCount,
    currentUser,
}: MusicRankTableProps) {
    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
    const firstVisiblePage = Math.min(
        Math.max(1, page - 1),
        Math.max(1, totalPages - 2)
    );
    const visiblePages = Array.from(
        { length: Math.min(3, totalPages) },
        (_, index) => firstVisiblePage + index
    );
    const pageHref = (targetPage: number) =>
        `/music/${musicIndex}/${difficulty}?tab=ranking&page=${targetPage}`;

    return (
        <div className="flex flex-col gap-3">
            {currentUser && currentUser.rank ? (
                <section className="border-text-disabled/40 rounded-card flex h-14 items-center gap-3 border px-3">
                    <strong className="text-text-primary w-9 shrink-0 text-sm tabular-nums">
                        #{currentUser.rank}
                    </strong>
                    <UserAvatar user={currentUser.user} size={30} />
                    <div className="min-w-0 flex-1">
                        <p className="text-text-primary truncate text-sm font-bold">
                            {currentUser.user.username || "이름 없는 유저"}
                        </p>
                        <p className="text-caption">
                            상위{" "}
                            {Math.max(
                                1,
                                Math.ceil((currentUser.rank / totalCount) * 100)
                            )}
                            % · 전체 {totalCount}명
                        </p>
                    </div>
                    <RankImage rank={currentUser.clearRank} size={18} />
                    <strong className="text-text-primary w-18 text-right text-sm tabular-nums">
                        {currentUser.score.toLocaleString("ko-KR")}
                    </strong>
                </section>
            ) : (
                <section className="border-border text-text-secondary rounded-card flex h-14 items-center justify-center border text-sm">
                    이 채보의 플레이 기록이 없어 순위가 없습니다.
                </section>
            )}

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
                                    <UserAvatar user={row.user} />
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
                                        <span className="border-rank-fc/40 text-rank-fc rounded border py-0.5 text-center text-[8px] leading-none font-black">
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

            {totalPages > 1 ? (
                <nav
                    className="flex justify-center gap-1"
                    aria-label="랭킹 페이지"
                >
                    {page > 1 ? (
                        <Link
                            href={pageHref(page - 1)}
                            aria-label="이전 페이지"
                            className="border-border text-text-secondary flex size-7 items-center justify-center rounded-md border"
                        >
                            <ChevronLeft size={14} aria-hidden />
                        </Link>
                    ) : (
                        <span className="border-border text-text-disabled flex size-7 items-center justify-center rounded-md border opacity-40">
                            <ChevronLeft size={14} aria-hidden />
                        </span>
                    )}

                    {visiblePages.map((item) => (
                        <Link
                            key={item}
                            href={pageHref(item)}
                            aria-current={item === page ? "page" : undefined}
                            className={cn(
                                "border-border flex size-7 items-center justify-center rounded-md border text-xs",
                                item === page
                                    ? "bg-border text-text-primary font-bold"
                                    : "text-text-secondary"
                            )}
                        >
                            {item}
                        </Link>
                    ))}

                    {page < totalPages ? (
                        <Link
                            href={pageHref(page + 1)}
                            aria-label="다음 페이지"
                            className="border-border text-text-secondary flex size-7 items-center justify-center rounded-md border"
                        >
                            <ChevronRight size={14} aria-hidden />
                        </Link>
                    ) : (
                        <span className="border-border text-text-disabled flex size-7 items-center justify-center rounded-md border opacity-40">
                            <ChevronRight size={14} aria-hidden />
                        </span>
                    )}
                </nav>
            ) : null}
        </div>
    );
}
