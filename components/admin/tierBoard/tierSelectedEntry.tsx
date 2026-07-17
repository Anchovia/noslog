import { Trash2 } from "lucide-react";

import { deleteTierEntry } from "@/app/admin/tiers/actions";
import { cn } from "@/lib/utils";

import type { TierEntryData } from "./tierBoardTypes";
import { getTierDifficultyColor } from "./tierBoardUtils";

// 선택한 채보 정보와 제거 액션을 한곳에서 관리함
export default function TierSelectedEntry({ entry }: { entry: TierEntryData }) {
    return (
        <div className="border-divider mx-3 flex items-center gap-2 border-t py-2">
            <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold">
                    {entry.chart.music.title}
                </p>
                <p
                    className={cn(
                        "text-caption font-semibold",
                        getTierDifficultyColor(entry.chart.difficulty)
                    )}
                >
                    {entry.chart.difficulty} Lv{entry.chart.level}
                </p>
            </div>
            <form action={deleteTierEntry}>
                <input type="hidden" name="id" value={entry.id} />
                <button
                    aria-label="채보 제거"
                    title="채보 제거"
                    className="text-danger hover:bg-danger/10 flex size-9 cursor-pointer items-center justify-center rounded-md"
                >
                    <Trash2 className="size-4" />
                </button>
            </form>
        </div>
    );
}
