export interface RankingUser {
    id: number;
    username: string | null;
    avatar: string | null;
}

export interface RankingRow {
    rank: string;
    score: number;
    fc_type: number;
    user_id: number;
    user: RankingUser;
}

export interface CurrentUserRanking {
    rank: number | null;
    score: number;
    clearRank: string;
    fcType: number;
    user: RankingUser;
}

export interface MusicRankTableProps {
    musicIndex: string;
    difficulty: string;
    isLoggedIn: boolean;
    rows: RankingRow[];
    page: number;
    pageSize: number;
    totalCount: number;
    currentUser: CurrentUserRanking | null;
}
