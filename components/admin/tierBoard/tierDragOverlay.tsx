import type { TierEntryData } from "./tierBoardTypes";

// 드래그 중인 채보의 미리보기를 표시함
export default function TierDragOverlay({
    entry,
}: {
    entry: TierEntryData | undefined;
}) {
    return entry ? (
        <div
            className="bg-surface-muted border-score size-11 rounded-md border bg-cover bg-center shadow-lg"
            style={{
                backgroundImage: entry.chart.music.background
                    ? `url(${entry.chart.music.background})`
                    : undefined,
            }}
        />
    ) : null;
}
