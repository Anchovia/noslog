import type { BingoCellItem } from "@/features/bingos/types/bingo-plate";
import { normalizeMusicCategory } from "@/lib/music-categories";

export function getBingoMissionLink(cell: BingoCellItem) {
    if (cell.missionType === "music" && cell.musicIndex) {
        // 악곡 목록과 같은 들어가는 난이도 = 그 곡의 가장 높은 난이도 (2026-09-19)
        return `/music/${cell.musicIndex}/${cell.musicDifficulty ?? "expert"}`;
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
