import { cn } from "@/lib/utils";
import { useTranslations } from "@/components/i18n/localeProvider";

import type { MissionFilter } from "./bingoPlateTypes";

interface BingoMissionFiltersProps {
    filter: MissionFilter;
    incompleteCount: number;
    completedCount: number;
    richCount: number;
    onChange: (filter: MissionFilter) => void;
}

// 미완료, 완료와 빙고 찬스 미션 목록을 전환함
export default function BingoMissionFilters({
    filter,
    incompleteCount,
    completedCount,
    richCount,
    onChange,
}: BingoMissionFiltersProps) {
    const t = useTranslations();
    return (
        <div className="flex items-center gap-1">
            <button
                type="button"
                onClick={() => onChange("incomplete")}
                className={cn(
                    "focus-visible:ring-focus/40 h-8 cursor-pointer rounded-md px-3 text-xs font-semibold transition-colors focus-visible:ring-2 focus-visible:outline-none",
                    filter === "incomplete"
                        ? "bg-text-primary text-bg hover:bg-text-primary/90"
                        : "bg-surface text-text-secondary hover:bg-surface-muted hover:text-text-primary"
                )}
            >
                {t("bingo.incomplete", { count: incompleteCount })}
            </button>
            <button
                type="button"
                onClick={() => onChange("completed")}
                className={cn(
                    "focus-visible:ring-focus/40 h-8 cursor-pointer rounded-md px-3 text-xs font-semibold transition-colors focus-visible:ring-2 focus-visible:outline-none",
                    filter === "completed"
                        ? "bg-text-primary text-bg hover:bg-text-primary/90"
                        : "bg-surface text-text-secondary hover:bg-surface-muted hover:text-text-primary"
                )}
            >
                {t("bingo.completed", { count: completedCount })}
            </button>
            <button
                type="button"
                onClick={() => onChange("rich")}
                className={cn(
                    "focus-visible:ring-score/30 h-8 cursor-pointer rounded-md px-3 text-xs font-semibold transition-colors focus-visible:ring-2 focus-visible:outline-none",
                    filter === "rich"
                        ? "bg-score text-bg hover:bg-score/90"
                        : "bg-surface text-score hover:bg-surface-muted"
                )}
            >
                {t("bingo.chance", { count: richCount })}
            </button>
        </div>
    );
}
