export interface BingoListItem {
    id: number;
    title: string;
    musicIndex: string;
    background: string | null;
    reward: number;
    requiredLines: number;
    completedCells: number;
    completedLines: number;
    richLines: number;
    richPositions: number[];
    completedPositions: number[];
    progressPercent: number;
    isCompleted: boolean;
}

export type BingoStatusFilter = "all" | "progress" | "rich" | "completed";
export type BingoSortDirection = "desc" | "asc";

export interface BingoStatusCounts {
    progress: number;
    rich: number;
    completed: number;
}
