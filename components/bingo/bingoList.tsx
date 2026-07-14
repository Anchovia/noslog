"use client";

import { ArrowDown, ArrowUp, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import { getBingoJacketUrl } from "@/lib/bingo";
import { cn, formatToComma } from "@/lib/utils";

export interface BingoListItem {
    id: number;
    title: string;
    musicIndex: string;
    background: string | null;
    reward: number;
    requiredLines: number;
    completedCells: number;
    completedLines: number;
    richLines: number;
    richPositions: number[];
    completedPositions: number[];
    progressPercent: number;
    isCompleted: boolean;
}

type StatusFilter = "all" | "progress" | "rich" | "completed";
type SortDirection = "desc" | "asc";

const filters: { value: StatusFilter; label: string }[] = [
    { value: "all", label: "전체" },
    { value: "progress", label: "진행 중" },
    { value: "rich", label: "리치" },
    { value: "completed", label: "완료" },
];

function MiniBoard({ bingo }: { bingo: BingoListItem }) {
    const completed = new Set(bingo.completedPositions);
    const rich = new Set(bingo.richPositions);

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

// 빙고 목록의 상태 필터와 진행순 정렬을 관리함
export default function BingoList({ bingos }: { bingos: BingoListItem[] }) {
    const [filter, setFilter] = useState<StatusFilter>("all");
    const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
    const completedCount = bingos.filter((bingo) => bingo.isCompleted).length;
    const continueBingo = useMemo(
        () =>
            [...bingos]
                .filter((bingo) => !bingo.isCompleted)
                .sort(
                    (a, b) =>
                        b.progressPercent - a.progressPercent || a.id - b.id
                )[0],
        [bingos]
    );
    const filteredBingos = useMemo(() => {
        const result = bingos.filter((bingo) => {
            if (filter === "progress") {
                return bingo.completedCells > 0 && !bingo.isCompleted;
            }
            if (filter === "rich") return bingo.richLines > 0;
            if (filter === "completed") return bingo.isCompleted;
            return true;
        });

        return result.sort((a, b) => {
            const progressDifference =
                sortDirection === "desc"
                    ? b.progressPercent - a.progressPercent
                    : a.progressPercent - b.progressPercent;

            return progressDifference || a.id - b.id;
        });
    }, [bingos, filter, sortDirection]);

    return (
        <div className="flex flex-col gap-4 px-4 py-4">
            <div className="flex items-end justify-between">
                <h1 className="text-title">빙고</h1>
                <p className="text-caption">
                    {bingos.length}판 · 해금 완료 {completedCount}
                </p>
            </div>

            {continueBingo ? (
                <Link
                    href={`/bingo/${continueBingo.id}`}
                    className="border-border bg-surface rounded-card hover:bg-surface-muted flex items-center gap-3 border p-3 transition-colors"
                >
                    <div
                        className="bg-surface-muted size-14 shrink-0 rounded-md bg-cover bg-center"
                        style={{
                            backgroundImage: `url(${getBingoJacketUrl(continueBingo.musicIndex, continueBingo.background)})`,
                        }}
                    />
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                            <span className="text-caption">이어서 진행</span>
                            {continueBingo.richLines > 0 ? (
                                <span className="bg-score text-bg rounded px-1.5 py-0.5 text-xs font-extrabold">
                                    리치 {continueBingo.richLines}
                                </span>
                            ) : null}
                        </div>
                        <p className="text-body mt-1 truncate font-bold">
                            {continueBingo.title}
                        </p>
                        <p className="text-caption mt-1">
                            줄 {continueBingo.completedLines}/
                            {continueBingo.requiredLines} · 칸{" "}
                            {continueBingo.completedCells}/25 ·{" "}
                            {formatToComma(continueBingo.reward)}nos
                        </p>
                    </div>
                    <ChevronRight className="text-text-disabled size-5 shrink-0" />
                </Link>
            ) : null}

            <div className="flex items-center justify-between gap-2">
                <div className="flex min-w-0 items-center gap-1 overflow-x-auto">
                    {filters.map((item) => {
                        const count =
                            item.value === "progress"
                                ? bingos.filter(
                                      (bingo) =>
                                          bingo.completedCells > 0 &&
                                          !bingo.isCompleted
                                  ).length
                                : item.value === "rich"
                                  ? bingos.filter(
                                        (bingo) => bingo.richLines > 0
                                    ).length
                                  : item.value === "completed"
                                    ? completedCount
                                    : null;

                        return (
                            <button
                                key={item.value}
                                type="button"
                                onClick={() => setFilter(item.value)}
                                className={cn(
                                    "h-8 shrink-0 rounded-md px-3 text-xs font-semibold transition-colors",
                                    filter === item.value
                                        ? "bg-text-primary text-bg"
                                        : "bg-surface text-text-secondary"
                                )}
                            >
                                {item.label}
                                {count !== null ? ` ${count}` : ""}
                            </button>
                        );
                    })}
                </div>
                <button
                    type="button"
                    onClick={() =>
                        setSortDirection((current) =>
                            current === "desc" ? "asc" : "desc"
                        )
                    }
                    className="text-caption hover:text-text-primary flex h-8 shrink-0 items-center gap-1 px-1 transition-colors"
                    aria-label={`진행률 ${sortDirection === "desc" ? "낮은 순" : "높은 순"}으로 변경`}
                    title={
                        sortDirection === "desc"
                            ? "진행률 높은 순"
                            : "진행률 낮은 순"
                    }
                >
                    진행순
                    {sortDirection === "desc" ? (
                        <ArrowDown className="size-3.5" />
                    ) : (
                        <ArrowUp className="size-3.5" />
                    )}
                </button>
            </div>

            {filteredBingos.length > 0 ? (
                <section className="grid grid-cols-2 gap-2">
                    {filteredBingos.map((bingo) => (
                        <Link
                            key={bingo.id}
                            href={`/bingo/${bingo.id}`}
                            className="bg-surface rounded-card hover:bg-surface-muted overflow-hidden transition-colors"
                        >
                            <div
                                className="bg-surface-muted relative aspect-square bg-cover bg-center"
                                style={{
                                    backgroundImage: `url(${getBingoJacketUrl(bingo.musicIndex, bingo.background)})`,
                                }}
                            >
                                <div className="absolute top-2 right-2">
                                    <MiniBoard bingo={bingo} />
                                </div>
                                {bingo.richLines > 0 && !bingo.isCompleted ? (
                                    <span className="bg-score text-bg absolute top-2 left-2 rounded px-1.5 py-0.5 text-xs font-extrabold">
                                        리치 {bingo.richLines}
                                    </span>
                                ) : null}
                            </div>
                            <div className="p-2.5">
                                <p className="text-body truncate font-bold">
                                    {bingo.title}
                                </p>
                                <div className="bg-surface-muted mt-2 h-1 overflow-hidden rounded-full">
                                    <div
                                        className={cn(
                                            "h-full rounded-full",
                                            bingo.isCompleted
                                                ? "bg-score"
                                                : "bg-chart"
                                        )}
                                        style={{
                                            width: `${bingo.progressPercent}%`,
                                        }}
                                    />
                                </div>
                                <div className="text-caption mt-2 flex justify-between gap-2">
                                    <span>
                                        줄 {bingo.completedLines}/
                                        {bingo.requiredLines} · 칸{" "}
                                        {bingo.completedCells}/25
                                    </span>
                                    <span className="text-score shrink-0">
                                        {bingo.reward}nos
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </section>
            ) : (
                <div className="bg-surface rounded-card text-caption flex min-h-32 items-center justify-center text-center">
                    해당 상태의 빙고가 없습니다.
                </div>
            )}
        </div>
    );
}
