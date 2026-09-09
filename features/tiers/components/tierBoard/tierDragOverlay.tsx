import MusicJacket from "@/components/music/musicJacket";
import { cn } from "@/lib/utils";

import type { TierEntryData } from "./tierBoardTypes";
import { getTierDifficultyBorder } from "./tierBoardUtils";

// 드래그 중인 채보의 미리보기를 표시함
export default function TierDragOverlay({
    entry,
}: {
    entry: TierEntryData | undefined;
}) {
    return entry ? (
        <MusicJacket
            index={entry.chart.music.index}
            background={entry.chart.music.background}
            title={entry.chart.music.title}
            className={cn(
                "size-11 rounded-md border-2 shadow-lg",
                getTierDifficultyBorder(entry.chart.difficulty)
            )}
            fallback={
                <span className="text-text-disabled m-auto text-xs font-semibold">
                    {entry.chart.level}
                </span>
            }
        />
    ) : null;
}
