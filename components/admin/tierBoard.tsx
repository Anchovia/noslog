"use client";

import {
    closestCenter,
    DndContext,
    DragOverlay,
    KeyboardSensor,
    PointerSensor,
    TouchSensor,
    useDroppable,
    useSensor,
    useSensors,
    type DragEndEvent,
    type DragStartEvent,
} from "@dnd-kit/core";
import {
    rectSortingStrategy,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Check, Pencil, Plus, Search, Trash2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";

import {
    addTierEntry,
    deleteTierBand,
    deleteTierEntry,
    moveTierEntryByDrop,
    searchTierCharts,
    updateTierBand,
} from "@/app/admin/tiers/actions";
import { cn } from "@/lib/utils";

interface ChartData {
    id: number;
    difficulty: string;
    level: number;
    music: {
        title: string;
        artist: string | null;
        background: string | null;
    };
}

interface TierEntryData {
    id: number;
    position: number;
    chart: ChartData;
}

interface TierBandData {
    id: number;
    value: number;
    entries: TierEntryData[];
}

interface ChartSearchResult {
    id: number;
    title: string;
    artist: string | null;
    jacket: string | null;
    difficulty: string;
    level: number;
}

const difficultyColor: Record<string, string> = {
    normal: "text-normal",
    hard: "text-hard",
    expert: "text-expert",
    real: "text-real",
};

function entryDragId(id: number) {
    return `entry-${id}`;
}

function bandDropId(id: number) {
    return `band-${id}`;
}

function SortableChart({
    entry,
    bandId,
    selected,
    onSelect,
}: {
    entry: TierEntryData;
    bandId: number;
    selected: boolean;
    onSelect: () => void;
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: entryDragId(entry.id),
        data: {
            type: "entry",
            entryId: entry.id,
            bandId,
            index: entry.position - 1,
        },
    });

    return (
        <button
            ref={setNodeRef}
            type="button"
            title={entry.chart.music.title}
            aria-label={`${entry.chart.music.title} 채보 이동`}
            onClick={onSelect}
            style={{
                transform: CSS.Transform.toString(transform),
                transition,
                backgroundImage: entry.chart.music.background
                    ? `url(${entry.chart.music.background})`
                    : undefined,
            }}
            className={cn(
                "bg-surface-muted relative size-11 shrink-0 cursor-grab touch-none rounded-md bg-cover bg-center active:cursor-grabbing",
                selected && "ring-real ring-2",
                isDragging && "opacity-30"
            )}
            {...attributes}
            {...listeners}
        >
            {!entry.chart.music.background ? (
                <span className="text-text-disabled text-xs font-bold">
                    {entry.chart.level}
                </span>
            ) : null}
        </button>
    );
}

function BandDropArea({
    band,
    selectedEntryId,
    onSelectEntry,
    onOpenSearch,
    searchOpen,
}: {
    band: TierBandData;
    selectedEntryId: number | null;
    onSelectEntry: (id: number) => void;
    onOpenSearch: () => void;
    searchOpen: boolean;
}) {
    const { setNodeRef, isOver } = useDroppable({
        id: bandDropId(band.id),
        data: { type: "band", bandId: band.id },
    });

    return (
        <div
            ref={setNodeRef}
            className={cn(
                "flex min-h-17 flex-wrap items-center gap-2 p-3 transition-colors",
                isOver && "bg-score/5"
            )}
        >
            <SortableContext
                items={band.entries.map((entry) => entryDragId(entry.id))}
                strategy={rectSortingStrategy}
            >
                {band.entries.map((entry) => (
                    <SortableChart
                        key={entry.id}
                        entry={entry}
                        bandId={band.id}
                        selected={selectedEntryId === entry.id}
                        onSelect={() => onSelectEntry(entry.id)}
                    />
                ))}
            </SortableContext>
            <button
                type="button"
                onClick={onOpenSearch}
                aria-label={`${band.value.toFixed(2)} 구간에 채보 추가`}
                title="채보 추가"
                className={cn(
                    "border-text-disabled text-text-disabled hover:border-text-secondary hover:text-text-secondary flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-md border border-dashed",
                    searchOpen && "border-real text-real"
                )}
            >
                <Plus className="size-4" />
            </button>
        </div>
    );
}

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
    const [results, setResults] = useState<ChartSearchResult[]>([]);
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
        const overData = event.over.data.current;
        const targetBandId = Number(overData?.bandId);
        if (!entryId || !targetBandId) return;

        const targetBand = bands.find((band) => band.id === targetBandId);
        const targetIndex =
            overData?.type === "entry"
                ? Number(overData.index)
                : (targetBand?.entries.length ?? 0);

        startMutation(async () => {
            await moveTierEntryByDrop(entryId, targetBandId, targetIndex);
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
                {bands.map((band) => {
                    const selectedEntry = band.entries.find(
                        (entry) => entry.id === selectedEntryId
                    );

                    return (
                        <article
                            key={band.id}
                            className="bg-surface border-real/70 rounded-card overflow-hidden border-l-3"
                        >
                            <header className="bg-surface-muted flex items-start gap-2 px-3 py-2">
                                <details className="group min-w-0 flex-1">
                                    <summary
                                        title="구간값 수정"
                                        className="flex h-8 w-fit cursor-pointer list-none items-center gap-2"
                                    >
                                        <strong className="text-body font-bold tabular-nums">
                                            {band.value.toFixed(2)}
                                        </strong>
                                        <Pencil className="text-text-disabled group-open:text-text-primary size-3.5" />
                                    </summary>
                                    <form
                                        action={updateTierBand}
                                        className="mt-2 flex items-center gap-1"
                                    >
                                        <input
                                            type="hidden"
                                            name="id"
                                            value={band.id}
                                        />
                                        <input
                                            name="value"
                                            type="number"
                                            min="1"
                                            max="14"
                                            step="0.01"
                                            required
                                            defaultValue={band.value}
                                            aria-label="서열표 구간값"
                                            className="border-border bg-bg h-9 w-20 rounded-md border px-2 text-right font-bold tabular-nums"
                                        />
                                        <button
                                            aria-label={`${band.value} 구간값 저장`}
                                            title="구간값 저장"
                                            className="border-border hover:bg-bg flex size-9 cursor-pointer items-center justify-center rounded-md border"
                                        >
                                            <Check className="size-4" />
                                        </button>
                                    </form>
                                </details>
                                <span className="text-caption flex h-8 items-center">
                                    {band.entries.length}곡
                                </span>
                                <form action={deleteTierBand}>
                                    <input
                                        type="hidden"
                                        name="id"
                                        value={band.id}
                                    />
                                    <button
                                        aria-label={`${band.value} 구간 삭제`}
                                        title="구간 삭제"
                                        className="text-danger hover:bg-danger/10 flex size-8 cursor-pointer items-center justify-center rounded-md"
                                    >
                                        <Trash2 className="size-4" />
                                    </button>
                                </form>
                            </header>

                            <BandDropArea
                                band={band}
                                selectedEntryId={selectedEntryId}
                                onSelectEntry={(id) =>
                                    setSelectedEntryId((current) =>
                                        current === id ? null : id
                                    )
                                }
                                onOpenSearch={() => openSearch(band.id)}
                                searchOpen={searchBandId === band.id}
                            />

                            {selectedEntry ? (
                                <div className="border-divider mx-3 flex items-center gap-2 border-t py-2">
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-bold">
                                            {selectedEntry.chart.music.title}
                                        </p>
                                        <p
                                            className={cn(
                                                "text-caption font-semibold",
                                                difficultyColor[
                                                    selectedEntry.chart.difficulty.toLowerCase()
                                                ]
                                            )}
                                        >
                                            {selectedEntry.chart.difficulty} Lv
                                            {selectedEntry.chart.level}
                                        </p>
                                    </div>
                                    <form action={deleteTierEntry}>
                                        <input
                                            type="hidden"
                                            name="id"
                                            value={selectedEntry.id}
                                        />
                                        <button
                                            aria-label="채보 제거"
                                            title="채보 제거"
                                            className="text-danger hover:bg-danger/10 flex size-9 cursor-pointer items-center justify-center rounded-md"
                                        >
                                            <Trash2 className="size-4" />
                                        </button>
                                    </form>
                                </div>
                            ) : null}

                            {searchBandId === band.id ? (
                                <div className="border-divider border-t p-3">
                                    <div className="flex items-center gap-2">
                                        <div className="relative min-w-0 flex-1">
                                            <Search className="text-text-disabled pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                                            <input
                                                autoFocus
                                                value={query}
                                                onChange={(event) => {
                                                    setQuery(
                                                        event.target.value
                                                    );
                                                    if (
                                                        !event.target.value.trim()
                                                    ) {
                                                        requestId.current += 1;
                                                        setResults([]);
                                                    }
                                                }}
                                                placeholder="곡 제목 · 아티스트 · 식별자 검색"
                                                className="border-border bg-bg text-input h-10 w-full rounded-md border pr-3 pl-10"
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={closeSearch}
                                            aria-label="검색 닫기"
                                            title="닫기"
                                            className="text-text-secondary hover:bg-surface-muted flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-md"
                                        >
                                            <X className="size-4" />
                                        </button>
                                    </div>

                                    {query.trim() ? (
                                        <div className="border-divider mt-2 max-h-64 overflow-y-auto rounded-md border">
                                            {isSearching ? (
                                                <p className="text-body-muted py-6 text-center">
                                                    검색 중...
                                                </p>
                                            ) : null}
                                            {!isSearching &&
                                            results.length === 0 ? (
                                                <p className="text-body-muted py-6 text-center">
                                                    배치할 수 있는 채보가
                                                    없습니다.
                                                </p>
                                            ) : null}
                                            {!isSearching
                                                ? results.map(
                                                      (chart, index) => (
                                                          <button
                                                              key={chart.id}
                                                              type="button"
                                                              onClick={() =>
                                                                  addChart(
                                                                      chart.id,
                                                                      band.id
                                                                  )
                                                              }
                                                              className={cn(
                                                                  "hover:bg-surface-muted flex min-h-14 w-full cursor-pointer items-center gap-2 p-2 text-left",
                                                                  index > 0 &&
                                                                      "border-divider border-t"
                                                              )}
                                                          >
                                                              <div
                                                                  className="bg-surface-muted size-10 shrink-0 rounded-md bg-cover bg-center"
                                                                  style={{
                                                                      backgroundImage:
                                                                          chart.jacket
                                                                              ? `url(${chart.jacket})`
                                                                              : undefined,
                                                                  }}
                                                              />
                                                              <span className="min-w-0 flex-1">
                                                                  <strong className="block truncate text-sm">
                                                                      {
                                                                          chart.title
                                                                      }
                                                                  </strong>
                                                                  <span
                                                                      className={cn(
                                                                          "text-caption block truncate font-semibold",
                                                                          difficultyColor[
                                                                              chart.difficulty.toLowerCase()
                                                                          ]
                                                                      )}
                                                                  >
                                                                      {
                                                                          chart.difficulty
                                                                      }{" "}
                                                                      Lv
                                                                      {
                                                                          chart.level
                                                                      }
                                                                      {chart.artist
                                                                          ? ` · ${chart.artist}`
                                                                          : ""}
                                                                  </span>
                                                              </span>
                                                              <Plus className="text-text-secondary size-4 shrink-0" />
                                                          </button>
                                                      )
                                                  )
                                                : null}
                                        </div>
                                    ) : null}
                                </div>
                            ) : null}
                        </article>
                    );
                })}
            </div>

            <DragOverlay>
                {activeEntry ? (
                    <div
                        className="bg-surface-muted border-score size-11 rounded-md border bg-cover bg-center shadow-lg"
                        style={{
                            backgroundImage: activeEntry.chart.music.background
                                ? `url(${activeEntry.chart.music.background})`
                                : undefined,
                        }}
                    />
                ) : null}
            </DragOverlay>
        </DndContext>
    );
}
