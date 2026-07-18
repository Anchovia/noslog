import Link from "next/link";

import { getRankingTopPercent } from "./musicRankingUtils";
import type { CurrentUserRanking as CurrentUserRankingData } from "./musicRankingTypes";
import RankImage from "./rankImage";
import RankingUserAvatar from "./rankingUserAvatar";

interface CurrentUserRankingProps {
    isLoggedIn: boolean;
    currentUser: CurrentUserRankingData | null;
    totalCount: number;
}

// 로그인 상태와 현재 유저의 랭킹 요약을 표시함
export default function CurrentUserRanking({
    isLoggedIn,
    currentUser,
    totalCount,
}: CurrentUserRankingProps) {
    if (!isLoggedIn) {
        return (
            <section className="border-border bg-surface-muted rounded-card flex min-h-14 items-center justify-between gap-3 border px-3">
                <p className="text-text-secondary text-sm">
                    로그인 후 내 랭킹을 확인할 수 있습니다.
                </p>
                <Link
                    href="/login"
                    className="bg-text-primary text-bg rounded-card flex h-8 shrink-0 items-center justify-center px-3 text-xs font-bold"
                >
                    로그인
                </Link>
            </section>
        );
    }

    if (!currentUser?.rank) {
        return (
            <section className="border-border text-text-secondary rounded-card flex h-14 items-center justify-center border text-sm">
                이 채보의 플레이 기록이 없어 순위가 없습니다.
            </section>
        );
    }

    return (
        <section className="border-text-disabled/40 rounded-card flex h-14 items-center gap-3 border px-3">
            <strong className="text-text-primary w-9 shrink-0 text-sm tabular-nums">
                #{currentUser.rank}
            </strong>
            <RankingUserAvatar user={currentUser.user} size={30} />
            <div className="min-w-0 flex-1">
                <p className="text-text-primary truncate text-sm font-bold">
                    {currentUser.user.username || "이름 없는 유저"}
                </p>
                <p className="text-caption">
                    상위 {getRankingTopPercent(currentUser.rank, totalCount)}% ·
                    전체 {totalCount}명
                </p>
            </div>
            <RankImage rank={currentUser.clearRank} size={18} />
            <strong className="text-text-primary w-18 text-right text-sm tabular-nums">
                {currentUser.score.toLocaleString("ko-KR")}
            </strong>
        </section>
    );
}
