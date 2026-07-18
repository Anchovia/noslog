"use client";

import BingoBoard from "./plate/bingoBoard";
import BingoMissionFilters from "./plate/bingoMissionFilters";
import BingoMissionList from "./plate/bingoMissionList";
import type { BingoPlateProps } from "./plate/bingoPlateTypes";
import { useBingoPlate } from "./plate/useBingoPlate";

export type { BingoCellItem } from "./plate/bingoPlateTypes";

// 5x5 보드와 미션 체크리스트를 한곳에서 조합함
export default function BingoPlate({
    cells,
    initialCompletedCellIds,
    canEdit,
}: BingoPlateProps) {
    const bingo = useBingoPlate({ cells, initialCompletedCellIds, canEdit });

    return (
        <div className="flex flex-col gap-3">
            <BingoBoard
                cells={cells}
                completedCellIds={bingo.completedCellIds}
                completedLinePositionSet={bingo.completedLinePositionSet}
                completedLinePositions={bingo.progress.completedLinePositions}
                richPositions={bingo.progress.richPositions}
                selectedCellId={bingo.selectedCellId}
                onSelect={bingo.selectCell}
            />

            <BingoMissionFilters
                filter={bingo.filter}
                incompleteCount={cells.length - bingo.completedCellIds.size}
                completedCount={bingo.completedCellIds.size}
                richCount={bingo.progress.richPositions.size}
                onChange={bingo.setFilter}
            />

            {bingo.message ? (
                <p className="text-danger text-xs leading-normal">
                    {bingo.message}
                </p>
            ) : null}

            <BingoMissionList
                cells={bingo.filteredCells}
                completedCellIds={bingo.completedCellIds}
                richPositions={bingo.progress.richPositions}
                selectedCellId={bingo.selectedCellId}
                canEdit={canEdit}
                isPending={bingo.isPending}
                onSelect={bingo.selectCell}
                onToggle={bingo.toggleCell}
            />
        </div>
    );
}
