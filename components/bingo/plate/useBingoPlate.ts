"use client";

import { setBingoCellCompletion } from "@/app/(nevigation)/bingo/[id]/actions";
import { useLocale, useTranslations } from "@/components/i18n/localeProvider";
import { getBingoProgress } from "@/lib/bingo";
import { useMemo, useState, useTransition } from "react";

import type { BingoCellItem, MissionFilter } from "./bingoPlateTypes";
import { filterBingoMissions } from "./bingoPlateUtils";

interface UseBingoPlateOptions {
    cells: BingoCellItem[];
    initialCompletedCellIds: number[];
    canEdit: boolean;
}

// 빙고 선택, 필터와 완료 상태 변경을 한곳에서 관리함
export function useBingoPlate({
    cells,
    initialCompletedCellIds,
    canEdit,
}: UseBingoPlateOptions) {
    const locale = useLocale();
    const t = useTranslations();
    const [completedCellIds, setCompletedCellIds] = useState(
        () => new Set(initialCompletedCellIds)
    );
    const [filter, setFilter] = useState<MissionFilter>("incomplete");
    const [selectedCellId, setSelectedCellId] = useState<number | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();
    const progress = useMemo(
        () =>
            getBingoProgress(
                cells.map((cell) => ({
                    id: cell.id,
                    position: cell.position,
                    isCompleted: completedCellIds.has(cell.id),
                }))
            ),
        [cells, completedCellIds]
    );
    const completedLinePositionSet = useMemo(
        () => new Set(progress.completedLinePositions.flat()),
        [progress.completedLinePositions]
    );
    const filteredCells = useMemo(
        () =>
            filterBingoMissions(
                cells,
                completedCellIds,
                progress.richPositions,
                filter
            ),
        [cells, completedCellIds, filter, progress.richPositions]
    );

    function selectCell(cell: BingoCellItem, shouldScroll = true) {
        const isCompleted = completedCellIds.has(cell.id);
        const isRich =
            !isCompleted && progress.richPositions.has(cell.position);

        setSelectedCellId(cell.id);
        setFilter(isCompleted ? "completed" : isRich ? "rich" : "incomplete");

        if (shouldScroll) {
            requestAnimationFrame(() => {
                document
                    .getElementById(`bingo-mission-${cell.id}`)
                    ?.scrollIntoView({ behavior: "smooth", block: "center" });
            });
        }
    }

    function toggleCell(cellId: number) {
        if (!canEdit || isPending) {
            if (!canEdit) {
                setMessage(t("bingo.loginToSave"));
            }
            return;
        }

        const wasCompleted = completedCellIds.has(cellId);
        setMessage(null);
        setSelectedCellId(cellId);
        setFilter(wasCompleted ? "incomplete" : "completed");
        setCompletedCellIds((current) => {
            const next = new Set(current);
            if (wasCompleted) next.delete(cellId);
            else next.add(cellId);
            return next;
        });

        startTransition(async () => {
            const result = await setBingoCellCompletion(
                cellId,
                !wasCompleted,
                locale
            );

            if (!result.success) {
                setCompletedCellIds((current) => {
                    const next = new Set(current);
                    if (wasCompleted) next.add(cellId);
                    else next.delete(cellId);
                    return next;
                });
                setMessage(result.message ?? t("bingo.saveError"));
            }
        });
    }

    return {
        completedCellIds,
        completedLinePositionSet,
        filter,
        filteredCells,
        isPending,
        message,
        progress,
        selectedCellId,
        selectCell,
        setFilter,
        toggleCell,
    };
}
