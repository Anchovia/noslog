import { useDroppable } from "@dnd-kit/core";
import { rectSortingStrategy, SortableContext } from "@dnd-kit/sortable";
import { Plus } from "lucide-react";

import { cn } from "@/lib/utils";
import { formatTierValue } from "@/lib/tiers";

import SortableTierChart from "./sortableTierChart";
import type { TierBandData } from "./tierBoardTypes";
import { getBandDropId, getEntryDragId } from "./tierBoardUtils";

interface TierBandDropAreaProps {
    band: TierBandData;
    selectedEntryId: number | null;
    searchOpen: boolean;
    onSelectEntry: (id: number) => void;
    onOpenSearch: () => void;
}

// 상수 구간의 채보 배치와 추가 슬롯을 한곳에서 관리함
export default function TierBandDropArea({
    band,
    selectedEntryId,
    searchOpen,
    onSelectEntry,
    onOpenSearch,
}: TierBandDropAreaProps) {
    const { setNodeRef, isOver } = useDroppable({
        id: getBandDropId(band.id),
        data: { type: "band", bandId: band.id },
    });

    return (
        <div
            ref={setNodeRef}
            className={cn(
                "flex min-h-17 flex-wrap items-center gap-2 p-3 transition-colors",
                isOver && "bg-score/5"
            )}
        >
            <SortableContext
                items={band.entries.map((entry) => getEntryDragId(entry.id))}
                strategy={rectSortingStrategy}
            >
                {band.entries.map((entry) => (
                    <SortableTierChart
                        key={entry.id}
                        entry={entry}
                        bandId={band.id}
                        selected={selectedEntryId === entry.id}
                        onSelect={() => onSelectEntry(entry.id)}
                    />
                ))}
            </SortableContext>
            <button
                type="button"
                onClick={onOpenSearch}
                aria-label={`${formatTierValue(band.value)} 구간에 채보 추가`}
                title="채보 추가"
                className={cn(
                    "border-text-disabled text-text-disabled hover:border-text-secondary hover:text-text-secondary flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-md border border-dashed",
                    searchOpen && "border-real text-real"
                )}
            >
                <Plus className="size-4" />
            </button>
        </div>
    );
}
