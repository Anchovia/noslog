import { cn } from "@/lib/utils";

import type { BingoCellItem } from "./bingoPlateTypes";
import { getBingoCellLabel, getBingoLineCoordinates } from "./bingoPlateUtils";

interface BingoBoardProps {
    cells: BingoCellItem[];
    completedCellIds: ReadonlySet<number>;
    completedLinePositionSet: ReadonlySet<number>;
    completedLinePositions: number[][];
    richPositions: ReadonlySet<number>;
    selectedCellId: number | null;
    onSelect: (cell: BingoCellItem) => void;
}

// 5x5 빙고 칸과 완성된 줄을 표시함
export default function BingoBoard({
    cells,
    completedCellIds,
    completedLinePositionSet,
    completedLinePositions,
    richPositions,
    selectedCellId,
    onSelect,
}: BingoBoardProps) {
    return (
        <section className="relative grid grid-cols-5 gap-1">
            {cells.map((cell) => {
                const isCompleted = completedCellIds.has(cell.id);
                const isCompletedLine =
                    isCompleted && completedLinePositionSet.has(cell.position);
                const isRich = !isCompleted && richPositions.has(cell.position);
                const isSelected = selectedCellId === cell.id;
                const label = getBingoCellLabel(cell.position);

                return (
                    <button
                        key={cell.id}
                        type="button"
                        onClick={() => onSelect(cell)}
                        className={cn(
                            "bg-surface hover:bg-surface-muted focus-visible:ring-text-secondary/30 relative flex aspect-square min-w-0 cursor-pointer items-center justify-center rounded-md p-1.5 text-center transition-colors focus-visible:ring-2 focus-visible:outline-none",
                            isCompleted && "text-chart",
                            isCompletedLine && "text-score",
                            isRich &&
                                "border-score text-score border border-dashed",
                            isSelected &&
                                "ring-text-primary bg-surface-muted ring-2"
                        )}
                        aria-pressed={isSelected}
                        aria-label={`${label} ${cell.challenge}`}
                        title={cell.challenge}
                    >
                        {isCompleted ? (
                            <span
                                className={cn(
                                    "border-chart relative z-10 flex size-11 -rotate-6 flex-col items-center justify-center rounded-full border-2",
                                    isCompletedLine && "border-score"
                                )}
                            >
                                <span className="rotate-6 text-sm font-extrabold">
                                    {label}
                                </span>
                                <span className="rotate-6 text-[10px] leading-none font-extrabold tracking-wide">
                                    CLEAR
                                </span>
                            </span>
                        ) : (
                            <span className="text-sm font-extrabold">
                                {label}
                            </span>
                        )}
                        {isRich ? (
                            <span className="bg-score text-bg absolute -top-1 -right-1 rounded px-1 py-0.5 text-[10px] leading-none font-extrabold">
                                리치
                            </span>
                        ) : null}
                    </button>
                );
            })}

            {completedLinePositions.length > 0 ? (
                <svg
                    viewBox="0 0 5 5"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 z-20 size-full overflow-visible"
                >
                    {completedLinePositions.map((line) => (
                        <line
                            key={line.join("-")}
                            {...getBingoLineCoordinates(line)}
                            stroke="var(--color-score)"
                            strokeWidth="2"
                            vectorEffect="non-scaling-stroke"
                            strokeLinecap="round"
                            className="drop-shadow-[0_0_5px_var(--color-score)]"
                        />
                    ))}
                </svg>
            ) : null}
        </section>
    );
}
