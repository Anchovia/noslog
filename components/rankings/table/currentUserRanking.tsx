import type {
    UserRankingMetric,
    UserRankingMode,
    UserRankingRow,
} from "@/lib/rankings";
import { formatRankingGrade, formatRankingRating } from "./rankingTableUtils";
import { ExamBadge, UserAvatar } from "./rankingUserMeta";

interface CurrentUserRankingProps {
    mode: UserRankingMode;
    metric: UserRankingMetric;
    currentUser: UserRankingRow | null;
}

export default function CurrentUserRanking({
    mode,
    metric,
    currentUser,
}: CurrentUserRankingProps) {
    if (!currentUser) {
        return (
            <section className="border-border text-text-secondary rounded-card flex min-h-15 items-center justify-center border px-4 text-sm">
                선택한 조건의 내 랭킹 기록이 없습니다.
            </section>
        );
    }

    return (
        <section className="border-text-disabled/40 rounded-card flex min-h-15 items-center gap-3 border px-3">
            <strong className="text-text-primary w-8 shrink-0 text-center text-sm tabular-nums">
                {currentUser.rank}
            </strong>
            <UserAvatar
                avatar={currentUser.avatar}
                username={currentUser.username}
                size={34}
            />
            <div className="min-w-0 flex-1">
                <div className="flex min-w-0 items-center gap-2">
                    <p className="text-text-primary truncate text-sm font-bold">
                        {currentUser.username || "이름 없는 유저"}
                    </p>
                    <ExamBadge mode={mode} exam={currentUser.exam} />
                </div>
                <p className="text-caption mt-0.5">내 순위</p>
            </div>
            {metric === "rating" ? (
                <strong className="text-text-primary shrink-0 text-sm tabular-nums">
                    {formatRankingRating(currentUser.rating ?? 0)}
                </strong>
            ) : (
                <strong className="text-text-primary shrink-0 text-sm tabular-nums">
                    Grd {formatRankingGrade(currentUser.grade)}
                </strong>
            )}
        </section>
    );
}
