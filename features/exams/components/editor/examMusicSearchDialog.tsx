import type { FormEvent } from "react";

import ModalDialog from "@/components/ui/modalDialog";
import SearchField from "@/components/ui/searchField";

import type { MusicSearchResult, SearchPurpose } from "./examEditorTypes";

interface ExamMusicSearchDialogProps {
    isSearching: boolean;
    onChoose: (music: MusicSearchResult) => void;
    onOpenChange: (open: boolean) => void;
    onQueryChange: (query: string) => void;
    onSearch: (event: FormEvent<HTMLFormElement>) => void;
    open: boolean;
    purpose: SearchPurpose;
    query: string;
    results: MusicSearchResult[];
}

/**
 * 과제곡 · 보상 악곡 고르기(2026-09-26 P1) — 공용 대화상자 + 검색 칸(Enter 로 찾기) + 고르기 목록.
 * 줄 = 곡 이름 · 아티스트 → 채보 난이도 · 레벨(난이도 글자색). 관리자 화면이라 한국어 그대로
 */
export default function ExamMusicSearchDialog({
    isSearching,
    onChoose,
    onOpenChange,
    onQueryChange,
    onSearch,
    open,
    purpose,
    query,
    results,
}: ExamMusicSearchDialogProps) {
    return (
        <ModalDialog
            open={open}
            onOpenChange={onOpenChange}
            title={purpose === "stage" ? "과제곡 추가" : "보상 악곡 추가"}
        >
            <form onSubmit={onSearch}>
                <SearchField
                    autoFocus
                    aria-label="곡 제목 · 아티스트 검색"
                    placeholder="곡 제목 · 아티스트 검색 후 Enter"
                    value={query}
                    onChange={(event) => onQueryChange(event.target.value)}
                    clearLabel="검색어 지우기"
                    onClear={() => onQueryChange("")}
                    busy={isSearching}
                    busyLabel="찾는 중"
                />
            </form>
            {results.length ? (
                <div className="nl-pick-list">
                    {results.map((music) => (
                        <button
                            key={music.musicIndex}
                            type="button"
                            className="nl-pick-row"
                            onClick={() => onChoose(music)}
                        >
                            <span className="nl-pick-row__main">
                                <span className="nl-emphasis-label">
                                    {music.title}
                                </span>
                                <span className="nl-metadata nl-muted">
                                    {music.artist ?? "아티스트 정보 없음"}
                                    {music.charts.map((chart) => (
                                        <span
                                            key={chart.chartId}
                                            className={`nl-level--${chart.difficulty.toLowerCase()}`}
                                        >
                                            {" · "}
                                            {chart.difficulty} {chart.level}
                                        </span>
                                    ))}
                                </span>
                            </span>
                        </button>
                    ))}
                </div>
            ) : null}
        </ModalDialog>
    );
}
