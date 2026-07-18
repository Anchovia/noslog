import { cn } from "@/lib/utils";

interface BingoMiniBoardProps {
    completedPositions: number[];
    richPositions: number[];
}

// 카드 위에 완료와 리치 위치를 축소한 5x5 보드로 표시함
export default function BingoMiniBoard({
    completedPositions,
    richPositions,
}: BingoMiniBoardProps) {
    const completed = new Set(completedPositions);
    const rich = new Set(richPositions);

    return (
        <div className="bg-bg/70 grid grid-cols-5 gap-0.5 rounded-md p-1.5 backdrop-blur-sm">
            {Array.from({ length: 25 }, (_, index) => {
                const position = index + 1;

                return (
                    <span
                        key={position}
                        className={cn(
                            "bg-border size-1.5 rounded-[2px]",
                            completed.has(position) && "bg-chart",
                            rich.has(position) && "bg-score"
                        )}
                    />
                );
            })}
        </div>
    );
}
