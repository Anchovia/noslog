import { normalizeMusicCategory } from "@/lib/musicCategories";

import type { BingoCellItem, MissionFilter } from "./bingoPlateTypes";

export function getBingoMissionLink(cell: BingoCellItem) {
    if (cell.missionType === "music" && cell.musicIndex) {
        return `/music/${cell.musicIndex}/normal`;
    }

    if (cell.missionType === "category" && cell.categoryShort) {
        const category = normalizeMusicCategory(
            cell.categoryShort.split(" · ")[0]
        );

        return category
            ? `/music?categories=${encodeURIComponent(category)}`
            : null;
    }

    return null;
}

export function getBingoCellLabel(position: number) {
    const row = String.fromCharCode(65 + Math.floor((position - 1) / 5));
    const column = ((position - 1) % 5) + 1;

    return `${row}${column}`;
}

export function getBingoLineCoordinates(line: number[]) {
    const start = line[0] - 1;
    const end = line[line.length - 1] - 1;

    return {
        x1: (start % 5) + 0.5,
        y1: Math.floor(start / 5) + 0.5,
        x2: (end % 5) + 0.5,
        y2: Math.floor(end / 5) + 0.5,
    };
}

export function filterBingoMissions(
    cells: BingoCellItem[],
    completedCellIds: ReadonlySet<number>,
    richPositions: ReadonlySet<number>,
    filter: MissionFilter
) {
    return cells.filter((cell) => {
        const isCompleted = completedCellIds.has(cell.id);

        if (filter === "completed") {
            return isCompleted;
        }

        if (filter === "rich") {
            return !isCompleted && richPositions.has(cell.position);
        }

        return !isCompleted;
    });
}

export function getBingoMissionDescription(
    cell: BingoCellItem,
    isCompleted: boolean,
    isRich: boolean
) {
    if (isCompleted) return "완료됨 · 다시 누르면 해제";
    if (isRich) return "이 칸만 채우면 한 줄 완성";
    if (cell.missionType === "music") return "악곡 미션";
    if (cell.missionType === "category") return "카테고리 미션";
    if (cell.missionType === "exam") return "검정 미션";
    return "기록 미션";
}
