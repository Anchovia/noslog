import type {
    BingoListItem,
    BingoSortDirection,
    BingoStatusCounts,
    BingoStatusFilter,
} from "./bingoListTypes";

export const BINGO_STATUS_FILTERS: {
    value: BingoStatusFilter;
    label: string;
}[] = [
    { value: "all", label: "전체" },
    { value: "progress", label: "진행 중" },
    { value: "rich", label: "리치" },
    { value: "completed", label: "완료" },
];

export function getBingoStatusCounts(
    bingos: BingoListItem[]
): BingoStatusCounts {
    return bingos.reduce<BingoStatusCounts>(
        (counts, bingo) => {
            if (bingo.completedCells > 0 && !bingo.isCompleted) {
                counts.progress += 1;
            }
            if (bingo.richLines > 0) counts.rich += 1;
            if (bingo.isCompleted) counts.completed += 1;
            return counts;
        },
        { progress: 0, rich: 0, completed: 0 }
    );
}

// 사용자가 가장 최근에 완료 상태를 변경한 빙고를 이어서 진행 대상으로 선택함
export function getContinueBingo(bingos: BingoListItem[]) {
    return [...bingos]
        .filter((bingo) => bingo.lastModifiedAt)
        .sort((a, b) => b.lastModifiedAt!.localeCompare(a.lastModifiedAt!))[0];
}

// 선택한 상태와 진행률 순서에 맞춰 빙고 목록을 정리함
export function getVisibleBingos(
    bingos: BingoListItem[],
    filter: BingoStatusFilter,
    sortDirection: BingoSortDirection
) {
    return bingos
        .filter((bingo) => {
            if (filter === "progress") {
                return bingo.completedCells > 0 && !bingo.isCompleted;
            }
            if (filter === "rich") return bingo.richLines > 0;
            if (filter === "completed") return bingo.isCompleted;
            return true;
        })
        .sort((a, b) => {
            const progressDifference =
                sortDirection === "desc"
                    ? b.progressPercent - a.progressPercent
                    : a.progressPercent - b.progressPercent;

            return progressDifference || a.id - b.id;
        });
}
