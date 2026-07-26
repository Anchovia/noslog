import CurrentUserRanking from "./table/currentUserRanking";
import RankingPagination from "./table/rankingPagination";
import type { UserRankingTableProps } from "./table/rankingTableTypes";
import UserRankingList from "./table/userRankingList";

export default function UserRankingTable({
    mode,
    metric,
    page,
    pageSize,
    totalCount,
    rows,
    currentUser,
    onPageChange,
}: UserRankingTableProps) {
    return (
        <div className="flex flex-col gap-3">
            <CurrentUserRanking
                mode={mode}
                metric={metric}
                currentUser={currentUser}
            />
            <UserRankingList mode={mode} metric={metric} rows={rows} />
            <RankingPagination
                page={page}
                pageSize={pageSize}
                totalCount={totalCount}
                onPageChange={onPageChange}
            />
        </div>
    );
}
