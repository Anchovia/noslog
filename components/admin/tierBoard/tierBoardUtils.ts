import type {
    TierBandData,
    TierDropData,
    TierDropTarget,
    TierEntryPlacement,
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

// 드롭 결과를 로컬 보드에만 반영해 일괄 적용 전까지 DB 요청을 막음
export function moveTierEntryInBoard(
    bands: TierBandData[],
    entryId: number,
    targetBandId: number,
    targetIndex: number
) {
    const nextBands = bands.map((band) => ({
        ...band,
        entries: [...band.entries],
    }));
    const sourceBand = nextBands.find((band) =>
        band.entries.some((entry) => entry.id === entryId)
    );
    const targetBand = nextBands.find((band) => band.id === targetBandId);
    if (!sourceBand || !targetBand) return bands;

    const sourceIndex = sourceBand.entries.findIndex(
        (entry) => entry.id === entryId
    );
    const [entry] = sourceBand.entries.splice(sourceIndex, 1);
    if (!entry) return bands;

    const insertAt = Math.max(
        0,
        Math.min(targetIndex, targetBand.entries.length)
    );
    targetBand.entries.splice(insertAt, 0, entry);

    return nextBands.map((band) => ({
        ...band,
        entries: band.entries.map((item, index) => ({
            ...item,
            position: index + 1,
        })),
    }));
}

// 원본과 비교해 저장이 필요한 채보 수를 계산함
export function getTierBoardChangeCount(
    initialBands: TierBandData[],
    currentBands: TierBandData[]
) {
    const initialEntries = new Map(
        initialBands.flatMap((band) =>
            band.entries.map((entry) => [
                entry.id,
                { tierBandId: band.id, position: entry.position },
            ])
        )
    );
    const currentEntries = currentBands.flatMap((band) =>
        band.entries.map((entry) => ({
            id: entry.id,
            tierBandId: band.id,
            position: entry.position,
        }))
    );

    if (initialEntries.size !== currentEntries.length) {
        return Math.max(initialEntries.size, currentEntries.length);
    }

    return currentEntries.filter((entry) => {
        const initial = initialEntries.get(entry.id);
        return (
            !initial ||
            initial.tierBandId !== entry.tierBandId ||
            initial.position !== entry.position
        );
    }).length;
}

// 보드의 현재 배치를 서버 액션에 전달할 형태로 변환함
export function getTierEntryPlacements(
    bands: TierBandData[]
): TierEntryPlacement[] {
    return bands.flatMap((band) =>
        band.entries.map((entry, index) => ({
            id: entry.id,
            tierBandId: band.id,
            position: index + 1,
        }))
    );
}
