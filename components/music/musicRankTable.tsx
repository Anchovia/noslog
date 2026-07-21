import CurrentUserRanking from "./ranking/currentUserRanking";
import MusicRankingList from "./ranking/musicRankingList";
import MusicRankingPagination from "./ranking/musicRankingPagination";
import type { MusicRankTableProps } from "./ranking/musicRankingTypes";

// 내 순위, 전체 랭킹과 페이지 이동 영역을 한곳에서 조합함
export default function MusicRankTable({
    isLoggedIn,
    rows,
    page,
    pageSize,
    totalCount,
    currentUser,
    onPageChange,
}: MusicRankTableProps & { onPageChange?: (page: number) => void }) {
    return (
        <div className="flex flex-col gap-3">
            <CurrentUserRanking
                isLoggedIn={isLoggedIn}
                currentUser={currentUser}
                totalCount={totalCount}
            />
            <MusicRankingList rows={rows} page={page} pageSize={pageSize} />
            <MusicRankingPagination
                page={page}
                pageSize={pageSize}
                totalCount={totalCount}
                onPageChange={onPageChange}
            />
        </div>
    );
}
