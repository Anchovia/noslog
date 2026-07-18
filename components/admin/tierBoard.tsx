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
    moveTierEntryByDrop,
    searchTierCharts,
} from "@/app/admin/tiers/actions";
import TierBandCard from "@/components/admin/tierBoard/tierBandCard";
import TierDragOverlay from "@/components/admin/tierBoard/tierDragOverlay";
import {
    type TierBandData,
    type TierChartSearchResult,
    type TierDropData,
} from "@/components/admin/tierBoard/tierBoardTypes";
import { resolveTierDropTarget } from "@/components/admin/tierBoard/tierBoardUtils";
import { cn } from "@/lib/utils";

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
            bands,
            event.over.data.current as TierDropData | undefined
        );
        if (!entryId || !target) return;

        startMutation(async () => {
            await moveTierEntryByDrop(entryId, target.bandId, target.index);
            router.refresh();
        });
    }

    const activeEntry = bands
        .flatMap((band) => band.entries)
        .find((entry) => entry.id === activeEntryId);

    if (bands.length === 0) {
        return (
            <p className="bg-surface rounded-card text-body-muted py-12 text-center">
                먼저 서열표 상수 구간을 추가해주세요.
            </p>
        );
    }

    return (
        <DndContext
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
                {bands.map((band) => (
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
