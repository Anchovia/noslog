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
                "relative size-nl-48 shrink-0 cursor-grab touch-none overflow-hidden rounded-nl-field border-nl-stroke-strong bg-nl-surface bg-cover bg-center active:cursor-grabbing",
                getTierDifficultyBorder(entry.chart.difficulty),
                selected && "ring-nl-stroke-strong ring-nl-difficulty-real",
                isDragging && "opacity-0"
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
                    <span className="nl-metadata m-auto text-nl-disabled">
                        {entry.chart.level}
                    </span>
                }
            />
        </button>
    );
}
