import { cn } from "@/lib/utils";
import { Check, ExternalLink } from "lucide-react";
import Link from "next/link";
import BingoTermHelp from "../bingoTermHelp";

import type { BingoCellItem } from "./bingoPlateTypes";
import {
    getBingoCellLabel,
    getBingoMissionDescription,
    getBingoMissionLink,
} from "./bingoPlateUtils";

interface BingoMissionListProps {
    cells: BingoCellItem[];
    completedCellIds: ReadonlySet<number>;
    richPositions: ReadonlySet<number>;
    selectedCellId: number | null;
    canEdit: boolean;
    isPending: boolean;
    onSelect: (cell: BingoCellItem, shouldScroll: boolean) => void;
    onToggle: (cellId: number) => void;
}

// 선택한 상태에 맞는 빙고 미션과 완료 버튼을 표시함
export default function BingoMissionList({
    cells,
    completedCellIds,
    richPositions,
    selectedCellId,
    canEdit,
    isPending,
    onSelect,
    onToggle,
}: BingoMissionListProps) {
    return (
        <section className="bg-surface rounded-card overflow-hidden">
            {cells.length > 0 ? (
                cells.map((cell) => {
                    const isCompleted = completedCellIds.has(cell.id);
                    const missionLink = getBingoMissionLink(cell);
                    const isRich =
                        !isCompleted && richPositions.has(cell.position);
                    const isSelected = selectedCellId === cell.id;

                    return (
                        <div
                            key={cell.id}
                            id={`bingo-mission-${cell.id}`}
                            onClick={() => onSelect(cell, false)}
                            className={cn(
                                "border-divider flex min-h-15 cursor-pointer scroll-mt-24 items-center gap-3 border-b px-3 py-2.5 transition-colors last:border-b-0",
                                isRich && "border-score border-l-2",
                                isCompleted && "opacity-60",
                                isSelected &&
                                    "bg-surface-muted ring-text-primary ring-1 ring-inset"
                            )}
                        >
                            <span
                                className={cn(
                                    "text-text-secondary w-6 shrink-0 text-xs font-bold",
                                    isRich && "text-score",
                                    isCompleted && "text-chart"
                                )}
                            >
                                {getBingoCellLabel(cell.position)}
                            </span>
                            <div className="min-w-0 flex-1">
                                <p
                                    className={cn(
                                        "text-body font-semibold",
                                        isCompleted && "line-through"
                                    )}
                                >
                                    <BingoTermHelp text={cell.challenge} />
                                </p>
                                <div className="text-caption mt-0.5 flex items-center gap-2">
                                    <span>
                                        {getBingoMissionDescription(
                                            cell,
                                            isCompleted,
                                            isRich
                                        )}
                                    </span>
                                    {missionLink ? (
                                        <Link
                                            href={missionLink}
                                            className="hover:text-text-primary inline-flex items-center gap-0.5 underline"
                                        >
                                            이동
                                            <ExternalLink className="size-3" />
                                        </Link>
                                    ) : null}
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={(event) => {
                                    event.stopPropagation();
                                    onToggle(cell.id);
                                }}
                                disabled={!canEdit || isPending}
                                aria-label={`${cell.challenge} ${isCompleted ? "완료 해제" : "완료 처리"}`}
                                className={cn(
                                    "border-border flex size-7 shrink-0 items-center justify-center rounded-full border disabled:cursor-not-allowed",
                                    isCompleted &&
                                        "border-chart bg-chart text-bg"
                                )}
                            >
                                {isCompleted ? (
                                    <Check className="size-4" strokeWidth={3} />
                                ) : null}
                            </button>
                        </div>
                    );
                })
            ) : (
                <div className="text-caption flex min-h-24 items-center justify-center px-4 text-center">
                    해당 상태의 미션이 없습니다.
                </div>
            )}
        </section>
    );
}
