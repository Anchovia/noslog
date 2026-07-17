import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { cn } from "@/lib/utils";

import type { TierEntryData } from "./tierBoardTypes";
import { getEntryDragId } from "./tierBoardUtils";

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
                backgroundImage: entry.chart.music.background
                    ? `url(${entry.chart.music.background})`
                    : undefined,
            }}
            className={cn(
                "bg-surface-muted relative size-11 shrink-0 cursor-grab touch-none rounded-md bg-cover bg-center active:cursor-grabbing",
                selected && "ring-real ring-2",
                isDragging && "opacity-30"
            )}
            {...attributes}
            {...listeners}
        >
            {!entry.chart.music.background ? (
                <span className="text-text-disabled text-xs font-bold">
                    {entry.chart.level}
                </span>
            ) : null}
        </button>
    );
}
