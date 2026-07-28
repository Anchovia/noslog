import { normalizeMusicCategory } from "@/lib/musicCategories";
import type { MessageKey } from "@/lib/i18n/messages";

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

export function getBingoMissionDescriptionKey(
    cell: BingoCellItem,
    isCompleted: boolean,
    isRich: boolean
): MessageKey {
    if (isCompleted) return "bingo.mission.completed";
    if (isRich) return "bingo.mission.chance";
    if (cell.missionType === "music") return "bingo.mission.music";
    if (cell.missionType === "category") return "bingo.mission.category";
    if (cell.missionType === "exam") return "bingo.mission.exam";
    return "bingo.mission.record";
}
