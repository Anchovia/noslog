import type { UserRankingMode, UserRankingRow } from "@/lib/rankings";

export interface UserRankingTableProps {
    mode: UserRankingMode;
    page: number;
    pageSize: number;
    totalCount: number;
    rows: UserRankingRow[];
    currentUser: UserRankingRow | null;
    onPageChange: (page: number) => void;
}
