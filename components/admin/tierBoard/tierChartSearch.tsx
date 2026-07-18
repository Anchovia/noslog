import { Plus, Search, X } from "lucide-react";

import MusicJacket from "@/components/music/musicJacket";
import { cn } from "@/lib/utils";

import type { TierChartSearchResult } from "./tierBoardTypes";
import {
    getTierDifficultyBorder,
    getTierDifficultyColor,
} from "./tierBoardUtils";

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
        <div className="border-divider border-t p-3">
            <div className="flex items-center gap-2">
                <div className="relative min-w-0 flex-1">
                    <Search className="text-text-disabled pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                    <input
                        autoFocus
                        value={query}
                        onChange={(event) => onQueryChange(event.target.value)}
                        placeholder="곡 제목 · 아티스트 · 식별자 검색"
                        className="border-border bg-bg text-input h-10 w-full rounded-md border pr-3 pl-10"
                    />
                </div>
                <button
                    type="button"
                    onClick={onClose}
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
                    {!isSearching && results.length === 0 ? (
                        <p className="text-body-muted py-6 text-center">
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
                                      "hover:bg-surface-muted flex min-h-14 w-full cursor-pointer items-center gap-2 p-2 text-left",
                                      index > 0 && "border-divider border-t"
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
                                              "text-caption block truncate font-semibold",
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
                                  <Plus className="text-text-secondary size-4 shrink-0" />
                              </button>
                          ))
                        : null}
                </div>
            ) : null}
        </div>
    );
}
