import { Plus, Search, X } from "lucide-react";

import MusicJacket from "@/components/music/music-jacket";
import { foundationButtonClass } from "@/components/ui/button";
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
        <div className="border-t-nl-stroke border-nl-divider p-nl-12">
            <div className="flex items-center gap-nl-8">
                <div className="relative min-w-0 flex-1">
                    <Search className="nl-icon-small pointer-events-none absolute top-1/2 left-nl-12 -translate-y-1/2 text-nl-disabled" />
                    <input
                        autoFocus
                        value={query}
                        onChange={(event) => onQueryChange(event.target.value)}
                        placeholder="곡 제목 · 아티스트 · 식별자 검색"
                        className="nl-input"
                    />
                </div>
                <button
                    type="button"
                    onClick={onClose}
                    aria-label="검색 닫기"
                    title="닫기"
                    className={cn(
                        foundationButtonClass({
                            variant: "ghost",
                            size: "icon",
                        }),
                        "shrink-0"
                    )}
                >
                    <X className="nl-icon-small" />
                </button>
            </div>

            {query.trim() ? (
                <div className="nl-admin-scroll-list mt-nl-8 overflow-y-auto rounded-nl-field border-nl-stroke border-nl-divider">
                    {isSearching ? (
                        <p className="nl-body-secondary py-nl-24 text-center text-nl-subdued">
                            검색 중...
                        </p>
                    ) : null}
                    {!isSearching && results.length === 0 ? (
                        <p className="nl-body-secondary py-nl-24 text-center text-nl-subdued">
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
                                      "nl-hover-layer flex min-h-nl-64 w-full cursor-pointer items-center gap-nl-8 p-nl-8 text-left",
                                      index > 0 &&
                                          "border-t-nl-stroke border-nl-divider"
                                  )}
                              >
                                  <MusicJacket
                                      index={chart.musicIndex}
                                      background={chart.jacket}
                                      title={chart.title}
                                      className={cn(
                                          "size-nl-48 shrink-0 rounded-nl-field border-nl-stroke-strong",
                                          getTierDifficultyBorder(
                                              chart.difficulty
                                          )
                                      )}
                                  />
                                  <span className="min-w-0 flex-1">
                                      <strong className="nl-body-secondary block truncate">
                                          {chart.title}
                                      </strong>
                                      <span
                                          className={cn(
                                              "nl-metadata block truncate text-nl-subdued",
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
                                  <Plus className="nl-icon-small shrink-0 text-nl-subdued" />
                              </button>
                          ))
                        : null}
                </div>
            ) : null}
        </div>
    );
}
