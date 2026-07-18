import CurrentUserRanking from "./ranking/currentUserRanking";
import MusicRankingList from "./ranking/musicRankingList";
import MusicRankingPagination from "./ranking/musicRankingPagination";
import type { MusicRankTableProps } from "./ranking/musicRankingTypes";

// 내 순위, 전체 랭킹과 페이지 이동 영역을 한곳에서 조합함
export default function MusicRankTable({
    musicIndex,
    difficulty,
    isLoggedIn,
    rows,
    page,
    pageSize,
    totalCount,
    currentUser,
}: MusicRankTableProps) {
    return (
        <div className="flex flex-col gap-3">
            <CurrentUserRanking
                isLoggedIn={isLoggedIn}
                currentUser={currentUser}
                totalCount={totalCount}
            />
            <MusicRankingList rows={rows} page={page} pageSize={pageSize} />
            <MusicRankingPagination
                musicIndex={musicIndex}
                difficulty={difficulty}
                page={page}
                pageSize={pageSize}
                totalCount={totalCount}
            />
        </div>
    );
}
