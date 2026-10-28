"use client";

import {
    closestCenter,
    DndContext,
    type DragEndEvent,
    DragOverlay,
    type DragStartEvent,
    KeyboardSensor,
    PointerSensor,
    TouchSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { toast } from "sonner";

import {
    addTierEntry,
    applyTierBoardLayout,
    searchTierCharts,
} from "@/app/admin/tiers/actions";
import { foundationButtonClass } from "@/components/ui/button";
import {
    type TierBandData,
    type TierChartSearchResult,
    type TierDropData,
} from "@/features/tiers/components/tier-board/tier-board-types";
import {
    getTierBoardChangeCount,
    getTierEntryPlacements,
    moveTierEntryInBoard,
    resolveTierDropTarget,
} from "@/features/tiers/components/tier-board/tier-board-utils";
import { createTierEntryAddFormData } from "@/features/tiers/schemas/tier-admin-schema";
import { cn } from "@/lib/cn";

import TierBandCard from "./tier-board/tier-band-card";
import TierDragOverlay from "./tier-board/tier-drag-overlay";

export type { TierBandData } from "./tier-board/tier-board-types";

// 서열표 검색, 선택과 드래그 변경 액션을 하위 구간 카드에 연결함
export default function TierBoard({
    tierListId,
    bands,
}: {
    tierListId: number;
    bands: TierBandData[];
}) {
    const router = useRouter();
    const requestId = useRef(0);
    const [activeEntryId, setActiveEntryId] = useState<number | null>(null);
    const [draftBands, setDraftBands] = useState(bands);
    const [selectedEntryId, setSelectedEntryId] = useState<number | null>(null);
    const [searchBandId, setSearchBandId] = useState<number | null>(null);
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<TierChartSearchResult[]>([]);
    const [isSearching, startSearch] = useTransition();
    const [isMutating, startMutation] = useTransition();
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
        useSensor(TouchSensor, {
            activationConstraint: { delay: 180, tolerance: 6 },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    useEffect(() => {
        if (!query.trim() || searchBandId === null) return;

        const currentRequest = ++requestId.current;
        const timeout = window.setTimeout(() => {
            startSearch(async () => {
                try {
                    const nextResults = await searchTierCharts(
                        query,
                        tierListId
                    );
                    if (currentRequest === requestId.current) {
                        setResults(nextResults);
                    }
                } catch {
                    if (currentRequest === requestId.current) setResults([]);
                    toast.error("채보를 검색하지 못했습니다.");
                }
            });
        }, 250);

        return () => window.clearTimeout(timeout);
    }, [query, searchBandId, tierListId]);

    function openSearch(bandId: number) {
        setSearchBandId((current) => (current === bandId ? null : bandId));
        setQuery("");
        setResults([]);
        requestId.current += 1;
    }

    function closeSearch() {
        setSearchBandId(null);
        setQuery("");
        setResults([]);
        requestId.current += 1;
    }

    function changeQuery(nextQuery: string) {
        setQuery(nextQuery);
        if (!nextQuery.trim()) {
            requestId.current += 1;
            setResults([]);
        }
    }

    function selectEntry(entryId: number) {
        setSelectedEntryId((current) => (current === entryId ? null : entryId));
    }

    function addChart(chartId: number, bandId: number) {
        startMutation(async () => {
            try {
                const result = await addTierEntry(
                    createTierEntryAddFormData({
                        tierListId,
                        tierBandId: bandId,
                        chartId,
                    })
                );
                if (!result.success) {
                    toast.error(result.message);
                    return;
                }

                toast.success(result.message);
                setResults((current) =>
                    current.filter((chart) => chart.id !== chartId)
                );
                router.refresh();
            } catch {
                toast.error("채보를 추가하지 못했습니다.");
            }
        });
    }

    function handleDragStart(event: DragStartEvent) {
        setActiveEntryId(Number(event.active.data.current?.entryId) || null);
    }

    function handleDragEnd(event: DragEndEvent) {
        setActiveEntryId(null);
        if (!event.over) return;

        const entryId = Number(event.active.data.current?.entryId);
        const target = resolveTierDropTarget(
            draftBands,
            event.over.data.current as TierDropData | undefined
        );
        if (!entryId || !target) return;

        setDraftBands((current) =>
            moveTierEntryInBoard(current, entryId, target.bandId, target.index)
        );
    }

    const changeCount = getTierBoardChangeCount(bands, draftBands);
    const activeEntry = draftBands
        .flatMap((band) => band.entries)
        .find((entry) => entry.id === activeEntryId);

    function applyLayout() {
        if (changeCount === 0) return;

        startMutation(async () => {
            try {
                const result = await applyTierBoardLayout(
                    tierListId,
                    getTierEntryPlacements(draftBands)
                );
                if (!result.success) {
                    toast.error(result.message);
                    return;
                }

                toast.success(result.message);
                router.refresh();
            } catch {
                toast.error("서열표 배치를 적용하지 못했습니다.");
            }
        });
    }

    if (bands.length === 0) {
        return (
            <p className="nl-body-secondary rounded-nl-control bg-nl-surface py-nl-48 text-center text-nl-subdued">
                먼저 서열표 상수 구간을 추가해주세요.
            </p>
        );
    }

    return (
        <DndContext
            id={`tier-board-${tierListId}`}
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragCancel={() => setActiveEntryId(null)}
        >
            <div
                className={cn(
                    "flex flex-col gap-nl-12",
                    isMutating && "pointer-events-none text-nl-subdued"
                )}
            >
                <div className="sticky top-nl-64 z-nl-sticky flex min-h-nl-control items-center justify-between gap-nl-12 rounded-nl-large border-nl-stroke border-nl-elevated-border bg-nl-elevated px-nl-12 py-nl-8 shadow-nl-overlay">
                    <span className="nl-metadata text-nl-subdued">
                        {changeCount > 0
                            ? `배치 변경 ${changeCount}건`
                            : "배치 변경 없음"}
                    </span>
                    <button
                        type="button"
                        onClick={applyLayout}
                        disabled={changeCount === 0 || isMutating}
                        className={cn(
                            foundationButtonClass({ size: "sm" }),
                            "shrink-0"
                        )}
                    >
                        <Save className="nl-icon-small" />
                        {isMutating ? "적용 중..." : "일괄 적용"}
                    </button>
                </div>

                {draftBands.map((band) => (
                    <TierBandCard
                        key={band.id}
                        band={band}
                        selectedEntryId={selectedEntryId}
                        searchOpen={searchBandId === band.id}
                        query={query}
                        results={results}
                        isSearching={isSearching}
                        onSelectEntry={selectEntry}
                        onOpenSearch={() => openSearch(band.id)}
                        onQueryChange={changeQuery}
                        onCloseSearch={closeSearch}
                        onAddChart={(chartId) => addChart(chartId, band.id)}
                    />
                ))}
            </div>

            <DragOverlay>
                <TierDragOverlay entry={activeEntry} />
            </DragOverlay>
        </DndContext>
    );
}
