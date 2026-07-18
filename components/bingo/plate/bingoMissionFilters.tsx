import { cn } from "@/lib/utils";

import type { MissionFilter } from "./bingoPlateTypes";

interface BingoMissionFiltersProps {
    filter: MissionFilter;
    incompleteCount: number;
    completedCount: number;
    richCount: number;
    onChange: (filter: MissionFilter) => void;
}

// 미완료, 완료와 리치 미션 목록을 전환함
export default function BingoMissionFilters({
    filter,
    incompleteCount,
    completedCount,
    richCount,
    onChange,
}: BingoMissionFiltersProps) {
    return (
        <div className="flex items-center gap-1">
            <button
                type="button"
                onClick={() => onChange("incomplete")}
                className={cn(
                    "h-8 rounded-md px-3 text-xs font-semibold",
                    filter === "incomplete"
                        ? "bg-text-primary text-bg"
                        : "bg-surface text-text-secondary"
                )}
            >
                미완료 {incompleteCount}
            </button>
            <button
                type="button"
                onClick={() => onChange("completed")}
                className={cn(
                    "h-8 rounded-md px-3 text-xs font-semibold",
                    filter === "completed"
                        ? "bg-text-primary text-bg"
                        : "bg-surface text-text-secondary"
                )}
            >
                완료 {completedCount}
            </button>
            <button
                type="button"
                onClick={() => onChange("rich")}
                className={cn(
                    "h-8 rounded-md px-3 text-xs font-semibold",
                    filter === "rich"
                        ? "bg-score text-bg"
                        : "bg-surface text-score"
                )}
            >
                리치만 {richCount}
            </button>
        </div>
    );
}
