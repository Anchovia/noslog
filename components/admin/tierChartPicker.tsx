"use client";

import { Plus, Search } from "lucide-react";
import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { addTierEntry, searchTierCharts } from "@/app/admin/tiers/actions";

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

export default function TierChartPicker({
    tierListId,
    bands,
}: {
    tierListId: number;
    bands: { id: number; value: number }[];
}) {
    const router = useRouter();
    const requestId = useRef(0);
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<ChartSearchResult[]>([]);
    const [selectedBands, setSelectedBands] = useState<Record<number, number>>(
        {}
    );
    const [isSearching, startSearch] = useTransition();
    const [isAdding, startAdd] = useTransition();

    useEffect(() => {
        if (!query.trim()) return;
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
    }, [query, tierListId]);

    function handleQueryChange(value: string) {
        setQuery(value);
        if (!value.trim()) {
            requestId.current += 1;
            setResults([]);
        }
    }

    function addChart(chartId: number) {
        const tierBandId = selectedBands[chartId] ?? bands[0]?.id;
        if (!tierBandId) return;

        startAdd(async () => {
            const formData = new FormData();
            formData.set("tierListId", String(tierListId));
            formData.set("tierBandId", String(tierBandId));
            formData.set("chartId", String(chartId));
            await addTierEntry(formData);
            setResults((current) =>
                current.filter((chart) => chart.id !== chartId)
            );
            router.refresh();
        });
    }

    return (
        <section className="bg-surface rounded-card p-3">
            <div className="relative">
                <Search className="text-text-disabled pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                <input
                    value={query}
                    onChange={(event) => handleQueryChange(event.target.value)}
                    disabled={bands.length === 0}
                    placeholder={
                        bands.length === 0
                            ? "상수 구간을 먼저 추가해주세요"
                            : "곡 제목 · 아티스트 · 식별자 검색"
                    }
                    className="border-border bg-bg text-input h-11 w-full rounded-md border pr-3 pl-10 disabled:cursor-not-allowed disabled:opacity-50"
                />
            </div>

            {query.trim() ? (
                <div className="mt-3">
                    <p className="text-caption mb-2">
                        {isSearching
                            ? "검색 중..."
                            : `미배치 검색 결과 ${results.length}개`}
                    </p>
                    <div className="border-divider max-h-72 overflow-y-auto rounded-md border">
                        {results.map((chart, index) => {
                            const difficulty = chart.difficulty.toLowerCase();
                            return (
                                <article
                                    key={chart.id}
                                    className={`flex min-h-16 items-center gap-2 p-2 ${index > 0 ? "border-divider border-t" : ""}`}
                                >
                                    <div
                                        className="bg-surface-muted size-11 shrink-0 rounded-md bg-cover bg-center"
                                        style={
                                            chart.jacket
                                                ? {
                                                      backgroundImage: `url(${chart.jacket})`,
                                                  }
                                                : undefined
                                        }
                                        aria-hidden="true"
                                    />
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-bold">
                                            {chart.title}
                                        </p>
                                        <p className="text-caption truncate">
                                            <span
                                                className={`font-semibold ${difficultyColor[difficulty] ?? ""}`}
                                            >
                                                {chart.difficulty} Lv
                                                {chart.level}
                                            </span>
                                            {chart.artist
                                                ? ` · ${chart.artist}`
                                                : ""}
                                        </p>
                                    </div>
                                    <select
                                        value={
                                            selectedBands[chart.id] ??
                                            bands[0]?.id
                                        }
                                        onChange={(event) =>
                                            setSelectedBands((current) => ({
                                                ...current,
                                                [chart.id]: Number(
                                                    event.target.value
                                                ),
                                            }))
                                        }
                                        aria-label={`${chart.title} 상수 구간`}
                                        className="border-border bg-bg h-9 w-17 shrink-0 cursor-pointer rounded-md border px-1 text-xs font-bold tabular-nums"
                                    >
                                        {bands.map((band) => (
                                            <option
                                                key={band.id}
                                                value={band.id}
                                            >
                                                {band.value.toFixed(2)}
                                            </option>
                                        ))}
                                    </select>
                                    <button
                                        type="button"
                                        onClick={() => addChart(chart.id)}
                                        disabled={isAdding}
                                        aria-label={`${chart.title} 배치`}
                                        title="채보 배치"
                                        className="bg-text-primary text-bg flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-md disabled:cursor-wait disabled:opacity-50"
                                    >
                                        <Plus className="size-4" />
                                    </button>
                                </article>
                            );
                        })}
                        {!isSearching && results.length === 0 ? (
                            <p className="text-body-muted py-8 text-center">
                                배치할 수 있는 채보가 없습니다.
                            </p>
                        ) : null}
                    </div>
                </div>
            ) : null}
        </section>
    );
}
