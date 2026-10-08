import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import MusicJacket from "@/components/music/music-jacket";
import { cn } from "@/lib/cn";

import type { TierEntryData } from "./tier-board-types";
import { getEntryDragId, getTierDifficultyBorder } from "./tier-board-utils";

interface SortableTierChartProps {
    entry: TierEntryData;
    bandId: number;
    selected: boolean;
    onSelect: () => void;
}

// 서열표 채보의 선택과 드래그 상태를 한곳에서 관리함
export default function SortableTierChart({
    entry,
    bandId,
    selected,
    onSelect,
}: SortableTierChartProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: getEntryDragId(entry.id),
        data: {
            type: "entry",
            entryId: entry.id,
            bandId,
            index: entry.position - 1,
        },
    });

    return (
        <button
            ref={setNodeRef}
            type="button"
            title={entry.chart.music.title}
            aria-label={`${entry.chart.music.title} 채보 이동`}
            onClick={onSelect}
            style={{
                transform: CSS.Transform.toString(transform),
                transition,
            }}
            className={cn(
                "relative size-11 shrink-0 cursor-grab touch-none overflow-hidden rounded-md border-2 bg-surface-muted bg-cover bg-center active:cursor-grabbing",
                getTierDifficultyBorder(entry.chart.difficulty),
                selected && "ring-2 ring-real",
                isDragging && "opacity-30"
            )}
            {...attributes}
            {...listeners}
        >
            <MusicJacket
                index={entry.chart.music.index}
                background={entry.chart.music.background}
                title={entry.chart.music.title}
                className="absolute inset-0"
                fallback={
                    <span className="m-auto text-xs font-semibold text-text-disabled">
                        {entry.chart.level}
                    </span>
                }
            />
        </button>
    );
}
