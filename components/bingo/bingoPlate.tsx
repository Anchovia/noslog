"use client";

import { toggleBingoCell } from "@/app/(nevigation)/bingo/[id]/actions";
import { getBingoProgress } from "@/lib/bingo";
import { cn } from "@/lib/utils";
import { Check, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useMemo, useState, useTransition } from "react";

export interface BingoCellItem {
    id: number;
    challenge: string;
    missionType: string;
    musicIndex: string | null;
    position: number;
    categoryShort: string | null;
}

type MissionFilter = "incomplete" | "completed" | "rich";

interface BingoPlateProps {
    cells: BingoCellItem[];
    initialCompletedCellIds: number[];
    canEdit: boolean;
}

function getMissionLink(cell: BingoCellItem) {
    if (cell.missionType === "music" && cell.musicIndex) {
        return `/music/${cell.musicIndex}/normal`;
    }
    if (cell.missionType === "category" && cell.categoryShort) {
        const category = cell.categoryShort.split(" · ")[0];
        return `/music?category=${encodeURIComponent(category)}`;
    }
    return null;
}

function getCellLabel(position: number) {
    const row = String.fromCharCode(65 + Math.floor((position - 1) / 5));
    const column = ((position - 1) % 5) + 1;

    return `${row}${column}`;
}

function getLineCoordinates(line: number[]) {
    const start = line[0] - 1;
    const end = line[line.length - 1] - 1;

    return {
        x1: (start % 5) + 0.5,
        y1: Math.floor(start / 5) + 0.5,
        x2: (end % 5) + 0.5,
        y2: Math.floor(end / 5) + 0.5,
    };
}

// 5x5 보드와 미션 체크리스트의 완료 상태를 함께 관리함
export default function BingoPlate({
    cells,
    initialCompletedCellIds,
    canEdit,
}: BingoPlateProps) {
    const [completedCellIds, setCompletedCellIds] = useState(
        () => new Set(initialCompletedCellIds)
    );
    const [filter, setFilter] = useState<MissionFilter>("incomplete");
    const [selectedCellId, setSelectedCellId] = useState<number | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();
    const progress = useMemo(
        () =>
            getBingoProgress(
                cells.map((cell) => ({
                    id: cell.id,
                    position: cell.position,
                    isCompleted: completedCellIds.has(cell.id),
                }))
            ),
        [cells, completedCellIds]
    );
    const filteredCells = cells.filter((cell) => {
        const isCompleted = completedCellIds.has(cell.id);

        if (filter === "completed") return isCompleted;
        if (filter === "rich") {
            return !isCompleted && progress.richPositions.has(cell.position);
        }
        return !isCompleted;
    });
    const completedLinePositionSet = useMemo(
        () => new Set(progress.completedLinePositions.flat()),
        [progress.completedLinePositions]
    );

    function handleSelect(cell: BingoCellItem, shouldScroll = true) {
        const isCompleted = completedCellIds.has(cell.id);
        const isRich =
            !isCompleted && progress.richPositions.has(cell.position);

        setSelectedCellId(cell.id);
        setFilter(isCompleted ? "completed" : isRich ? "rich" : "incomplete");

        if (shouldScroll) {
            requestAnimationFrame(() => {
                document
                    .getElementById(`bingo-mission-${cell.id}`)
                    ?.scrollIntoView({ behavior: "smooth", block: "center" });
            });
        }
    }

    function handleToggle(cellId: number) {
        if (!canEdit || isPending) {
            if (!canEdit) {
                setMessage("로그인 후 빙고 진행 상태를 저장할 수 있습니다.");
            }
            return;
        }

        const wasCompleted = completedCellIds.has(cellId);
        setMessage(null);
        setSelectedCellId(cellId);
        setFilter(wasCompleted ? "incomplete" : "completed");
        setCompletedCellIds((current) => {
            const next = new Set(current);
            if (wasCompleted) next.delete(cellId);
            else next.add(cellId);
            return next;
        });

        startTransition(async () => {
            const result = await toggleBingoCell(cellId);

            if (!result.success) {
                setCompletedCellIds((current) => {
                    const next = new Set(current);
                    if (wasCompleted) next.add(cellId);
                    else next.delete(cellId);
                    return next;
                });
                setMessage(
                    result.message ?? "완료 상태를 저장하지 못했습니다."
                );
            }
        });
    }

    return (
        <div className="flex flex-col gap-3">
            <section className="relative grid grid-cols-5 gap-1">
                {cells.map((cell) => {
                    const isCompleted = completedCellIds.has(cell.id);
                    const isCompletedLine =
                        isCompleted &&
                        completedLinePositionSet.has(cell.position);
                    const isRich =
                        !isCompleted &&
                        progress.richPositions.has(cell.position);
                    const isSelected = selectedCellId === cell.id;

                    return (
                        <button
                            key={cell.id}
                            type="button"
                            onClick={() => handleSelect(cell)}
                            className={cn(
                                "bg-surface hover:bg-surface-muted relative flex aspect-square min-w-0 items-center justify-center rounded-md p-1.5 text-center transition-colors",
                                isCompleted && "text-chart",
                                isCompletedLine && "text-score",
                                isRich &&
                                    "border-score text-score border border-dashed",
                                isSelected &&
                                    "ring-text-primary bg-surface-muted ring-2"
                            )}
                            aria-pressed={isSelected}
                            aria-label={`${getCellLabel(cell.position)} ${cell.challenge}`}
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
                                        {getCellLabel(cell.position)}
                                    </span>
                                    <span className="rotate-6 text-[8px] leading-none font-extrabold tracking-wide">
                                        CLEAR
                                    </span>
                                </span>
                            ) : (
                                <span className="text-sm font-extrabold">
                                    {getCellLabel(cell.position)}
                                </span>
                            )}
                            {isRich ? (
                                <span className="bg-score text-bg absolute -top-1 -right-1 rounded px-1 py-0.5 text-[9px] leading-none font-extrabold">
                                    리치
                                </span>
                            ) : null}
                        </button>
                    );
                })}

                {progress.completedLinePositions.length > 0 ? (
                    <svg
                        viewBox="0 0 5 5"
                        preserveAspectRatio="none"
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 z-20 size-full overflow-visible"
                    >
                        {progress.completedLinePositions.map((line) => {
                            const coordinates = getLineCoordinates(line);

                            return (
                                <line
                                    key={line.join("-")}
                                    {...coordinates}
                                    stroke="var(--color-score)"
                                    strokeWidth="2"
                                    vectorEffect="non-scaling-stroke"
                                    strokeLinecap="round"
                                    className="drop-shadow-[0_0_5px_var(--color-score)]"
                                />
                            );
                        })}
                    </svg>
                ) : null}
            </section>

            <div className="flex items-center gap-1">
                <button
                    type="button"
                    onClick={() => setFilter("incomplete")}
                    className={cn(
                        "h-8 rounded-md px-3 text-xs font-semibold",
                        filter === "incomplete"
                            ? "bg-text-primary text-bg"
                            : "bg-surface text-text-secondary"
                    )}
                >
                    미완료 {cells.length - completedCellIds.size}
                </button>
                <button
                    type="button"
                    onClick={() => setFilter("completed")}
                    className={cn(
                        "h-8 rounded-md px-3 text-xs font-semibold",
                        filter === "completed"
                            ? "bg-text-primary text-bg"
                            : "bg-surface text-text-secondary"
                    )}
                >
                    완료 {completedCellIds.size}
                </button>
                <button
                    type="button"
                    onClick={() => setFilter("rich")}
                    className={cn(
                        "h-8 rounded-md px-3 text-xs font-semibold",
                        filter === "rich"
                            ? "bg-score text-bg"
                            : "bg-surface text-score"
                    )}
                >
                    리치만 {progress.richPositions.size}
                </button>
            </div>

            {message ? (
                <p className="text-danger text-xs leading-normal">{message}</p>
            ) : null}

            <section className="bg-surface rounded-card overflow-hidden">
                {filteredCells.length > 0 ? (
                    filteredCells.map((cell) => {
                        const isCompleted = completedCellIds.has(cell.id);
                        const missionLink = getMissionLink(cell);
                        const isRich =
                            !isCompleted &&
                            progress.richPositions.has(cell.position);
                        const isSelected = selectedCellId === cell.id;

                        return (
                            <div
                                key={cell.id}
                                id={`bingo-mission-${cell.id}`}
                                onClick={() => handleSelect(cell, false)}
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
                                    {getCellLabel(cell.position)}
                                </span>
                                <div className="min-w-0 flex-1">
                                    <p
                                        className={cn(
                                            "text-body font-semibold",
                                            isCompleted && "line-through"
                                        )}
                                    >
                                        {cell.challenge}
                                    </p>
                                    <div className="text-caption mt-0.5 flex items-center gap-2">
                                        <span>
                                            {isCompleted
                                                ? "완료됨 · 다시 누르면 해제"
                                                : isRich
                                                  ? "이 칸만 채우면 한 줄 완성"
                                                  : cell.missionType === "music"
                                                    ? "악곡 미션"
                                                    : cell.missionType ===
                                                        "category"
                                                      ? "카테고리 미션"
                                                      : cell.missionType ===
                                                          "exam"
                                                        ? "검정 미션"
                                                        : "기록 미션"}
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
                                        handleToggle(cell.id);
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
                                        <Check
                                            className="size-4"
                                            strokeWidth={3}
                                        />
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
        </div>
    );
}
