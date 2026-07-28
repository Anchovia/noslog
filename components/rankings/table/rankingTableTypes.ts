import type {
    UserRankingMetric,
    UserRankingMode,
    UserRankingRow,
} from "@/lib/rankings";

export interface UserRankingTableProps {
    mode: UserRankingMode;
    metric: UserRankingMetric;
    page: number;
    pageSize: number;
    totalCount: number;
    rows: UserRankingRow[];
    currentUser: UserRankingRow | null;
    onPageChange: (page: number) => void;
}
