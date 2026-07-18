import type {
    UserRankingMode,
    UserRankingRegion,
    UserRankingRow,
} from "@/lib/rankings";

export interface UserRankingTableProps {
    mode: UserRankingMode;
    region: UserRankingRegion;
    page: number;
    pageSize: number;
    totalCount: number;
    rows: UserRankingRow[];
    currentUser: UserRankingRow | null;
}
