import MusicJacket from "@/components/music/music-jacket";
import { cn } from "@/lib/cn";

import type { TierEntryData } from "./tier-board-types";
import { getTierDifficultyBorder } from "./tier-board-utils";

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
                "size-nl-48 rounded-nl-field border-nl-stroke-strong shadow-nl-overlay",
                getTierDifficultyBorder(entry.chart.difficulty)
            )}
            fallback={
                <span className="nl-metadata m-auto text-nl-disabled">
                    {entry.chart.level}
                </span>
            }
        />
    ) : null;
}
