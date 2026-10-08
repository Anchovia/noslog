import { Plus, Search, X } from "lucide-react";

import MusicJacket from "@/components/music/music-jacket";
import { cn } from "@/lib/cn";

import type { TierChartSearchResult } from "./tier-board-types";
import {
    getTierDifficultyBorder,
    getTierDifficultyColor,
} from "./tier-board-utils";

interface TierChartSearchProps {
    query: string;
    results: TierChartSearchResult[];
    isSearching: boolean;
    onQueryChange: (query: string) => void;
    onClose: () => void;
    onAdd: (chartId: number) => void;
}

// 상수 구간에 추가할 채보 검색과 결과를 한곳에서 관리함
export default function TierChartSearch({
    query,
    results,
    isSearching,
    onQueryChange,
    onClose,
    onAdd,
}: TierChartSearchProps) {
    return (
        <div className="border-t border-divider p-3">
            <div className="flex items-center gap-2">
                <div className="relative min-w-0 flex-1">
                    <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-text-disabled" />
                    <input
                        autoFocus
                        value={query}
                        onChange={(event) => onQueryChange(event.target.value)}
                        placeholder="곡 제목 · 아티스트 · 식별자 검색"
                        className="h-11 w-full rounded-md border border-border bg-bg pr-3 pl-10 text-input"
                    />
                </div>
                <button
                    type="button"
                    onClick={onClose}
                    aria-label="검색 닫기"
                    title="닫기"
                    className="flex size-11 shrink-0 items-center justify-center rounded-md text-text-secondary hover:bg-surface-muted"
                >
                    <X className="size-4" />
                </button>
            </div>

            {query.trim() ? (
                <div className="mt-2 max-h-64 overflow-y-auto rounded-md border border-divider">
                    {isSearching ? (
                        <p className="py-6 text-center text-body-muted">
                            검색 중...
                        </p>
                    ) : null}
                    {!isSearching && results.length === 0 ? (
                        <p className="py-6 text-center text-body-muted">
                            배치할 수 있는 채보가 없습니다.
                        </p>
                    ) : null}
                    {!isSearching
                        ? results.map((chart, index) => (
                              <button
                                  key={chart.id}
                                  type="button"
                                  onClick={() => onAdd(chart.id)}
                                  className={cn(
                                      "flex min-h-14 w-full cursor-pointer items-center gap-2 p-2 text-left hover:bg-surface-muted",
                                      index > 0 && "border-t border-divider"
                                  )}
                              >
                                  <MusicJacket
                                      index={chart.musicIndex}
                                      background={chart.jacket}
                                      title={chart.title}
                                      className={cn(
                                          "size-10 shrink-0 rounded-md border-2",
                                          getTierDifficultyBorder(
                                              chart.difficulty
                                          )
                                      )}
                                  />
                                  <span className="min-w-0 flex-1">
                                      <strong className="block truncate text-sm">
                                          {chart.title}
                                      </strong>
                                      <span
                                          className={cn(
                                              "block truncate text-caption font-semibold",
                                              getTierDifficultyColor(
                                                  chart.difficulty
                                              )
                                          )}
                                      >
                                          {chart.difficulty} Lv{chart.level}
                                          {chart.artist
                                              ? ` · ${chart.artist}`
                                              : ""}
                                      </span>
                                  </span>
                                  <Plus className="size-4 shrink-0 text-text-secondary" />
                              </button>
                          ))
                        : null}
                </div>
            ) : null}
        </div>
    );
}
