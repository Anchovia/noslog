"use client";

import {
    closestCenter,
    DndContext,
    DragOverlay,
    KeyboardSensor,
    PointerSensor,
    TouchSensor,
    useSensor,
    useSensors,
    type DragEndEvent,
    type DragStartEvent,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";

import {
    addTierEntry,
    applyTierBoardLayout,
    searchTierCharts,
} from "@/app/admin/tiers/actions";
import TierBandCard from "@/components/admin/tierBoard/tierBandCard";
import TierDragOverlay from "@/components/admin/tierBoard/tierDragOverlay";
import {
    type TierBandData,
    type TierChartSearchResult,
    type TierDropData,
} from "@/components/admin/tierBoard/tierBoardTypes";
import {
    getTierBoardChangeCount,
    getTierEntryPlacements,
    moveTierEntryInBoard,
    resolveTierDropTarget,
} from "@/components/admin/tierBoard/tierBoardUtils";
import { cn } from "@/lib/utils";
import { Save } from "lucide-react";

export type { TierBandData } from "@/components/admin/tierBoard/tierBoardTypes";

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
                const nextResults = await searchTierCharts(query, tierListId);
                if (currentRequest === requestId.current) {
                    setResults(nextResults);
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
            const formData = new FormData();
            formData.set("tierListId", String(tierListId));
            formData.set("tierBandId", String(bandId));
            formData.set("chartId", String(chartId));
            await addTierEntry(formData);
            setResults((current) =>
                current.filter((chart) => chart.id !== chartId)
            );
            router.refresh();
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
            await applyTierBoardLayout(
                tierListId,
                getTierEntryPlacements(draftBands)
            );
            router.refresh();
        });
    }

    if (bands.length === 0) {
        return (
            <p className="bg-surface rounded-card text-body-muted py-12 text-center">
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
                    "flex flex-col gap-3",
                    isMutating && "pointer-events-none opacity-70"
                )}
            >
                <div className="bg-surface border-border rounded-card sticky top-16 z-10 flex min-h-11 items-center justify-between gap-3 border px-3 py-2 shadow-lg">
                    <span className="text-caption">
                        {changeCount > 0
                            ? `배치 변경 ${changeCount}건`
                            : "배치 변경 없음"}
                    </span>
                    <button
                        type="button"
                        onClick={applyLayout}
                        disabled={changeCount === 0 || isMutating}
                        className="bg-text-primary text-bg hover:bg-text-primary/90 flex h-9 shrink-0 items-center gap-1.5 rounded-md px-3 text-xs font-bold disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        <Save className="size-3.5" />
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
