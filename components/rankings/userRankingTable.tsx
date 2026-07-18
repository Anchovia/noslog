import CurrentUserRanking from "./table/currentUserRanking";
import RankingPagination from "./table/rankingPagination";
import type { UserRankingTableProps } from "./table/rankingTableTypes";
import UserRankingList from "./table/userRankingList";

export default function UserRankingTable({
    mode,
    region,
    page,
    pageSize,
    totalCount,
    rows,
    currentUser,
}: UserRankingTableProps) {
    return (
        <div className="flex flex-col gap-3">
            <CurrentUserRanking mode={mode} currentUser={currentUser} />
            <UserRankingList mode={mode} rows={rows} />
            <RankingPagination
                mode={mode}
                region={region}
                page={page}
                pageSize={pageSize}
                totalCount={totalCount}
            />
        </div>
    );
}
