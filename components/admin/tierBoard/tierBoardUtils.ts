import type {
    TierBandData,
    TierDropData,
    TierDropTarget,
} from "./tierBoardTypes";

const DIFFICULTY_COLORS: Record<string, string> = {
    normal: "text-normal",
    hard: "text-hard",
    expert: "text-expert",
    real: "text-real",
};

const DIFFICULTY_BORDERS: Record<string, string> = {
    expert: "border-expert",
    real: "border-real",
};

export function getTierDifficultyColor(difficulty: string) {
    return DIFFICULTY_COLORS[difficulty.toLowerCase()];
}

export function getTierDifficultyBorder(difficulty: string) {
    return DIFFICULTY_BORDERS[difficulty.toLowerCase()] ?? "border-transparent";
}

export function getEntryDragId(id: number) {
    return `entry-${id}`;
}

export function getBandDropId(id: number) {
    return `band-${id}`;
}

export function resolveTierDropTarget(
    bands: TierBandData[],
    overData: TierDropData | undefined
): TierDropTarget | null {
    const bandId = Number(overData?.bandId);
    if (!bandId) return null;

    const targetBand = bands.find((band) => band.id === bandId);
    if (!targetBand) return null;

    const requestedIndex =
        overData?.type === "entry"
            ? Number(overData.index)
            : targetBand.entries.length;
    const index = Number.isInteger(requestedIndex)
        ? Math.max(0, Math.min(requestedIndex, targetBand.entries.length))
        : targetBand.entries.length;

    return { bandId, index };
}
