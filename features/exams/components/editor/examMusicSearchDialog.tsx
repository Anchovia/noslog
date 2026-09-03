import * as Dialog from "@radix-ui/react-dialog";
import { LoaderCircle, Search, X } from "lucide-react";
import type { FormEvent } from "react";

import { cn } from "@/lib/utils";

import {
    EXAM_INPUT_CLASS,
    getDifficultyColor,
    type MusicSearchResult,
    type SearchPurpose,
} from "./examEditorTypes";

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
        <Dialog.Root open={open} onOpenChange={onOpenChange}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 z-40 bg-black/70" />
                <Dialog.Content className="bg-bg fixed inset-x-4 top-1/2 z-50 mx-auto max-h-[75vh] max-w-90 -translate-y-1/2 overflow-hidden rounded-lg p-4 shadow-xl">
                    <div className="flex items-center justify-between">
                        <Dialog.Title className="text-body font-bold">
                            {purpose === "stage"
                                ? "과제곡 추가"
                                : "보상 악곡 추가"}
                        </Dialog.Title>
                        <Dialog.Close
                            className="text-text-secondary p-1"
                            aria-label="닫기"
                        >
                            <X className="size-5" />
                        </Dialog.Close>
                    </div>

                    <form onSubmit={onSearch} className="mt-3 flex gap-2">
                        <input
                            autoFocus
                            value={query}
                            onChange={(event) =>
                                onQueryChange(event.target.value)
                            }
                            placeholder="곡 제목 · 아티스트 검색"
                            className={EXAM_INPUT_CLASS}
                        />
                        <button
                            type="submit"
                            className="bg-text-primary text-bg flex size-11 shrink-0 items-center justify-center rounded-md"
                            aria-label="검색"
                        >
                            {isSearching ? (
                                <LoaderCircle className="size-4 animate-spin" />
                            ) : (
                                <Search className="size-4" />
                            )}
                        </button>
                    </form>

                    <div className="mt-3 max-h-96 overflow-y-auto">
                        {results.map((music) => (
                            <button
                                key={music.musicIndex}
                                type="button"
                                onClick={() => onChoose(music)}
                                className="border-divider hover:bg-surface flex w-full flex-col border-b px-2 py-3 text-left"
                            >
                                <span className="text-body font-semibold">
                                    {music.title}
                                </span>
                                <span className="text-caption mt-0.5">
                                    {music.artist ?? "아티스트 정보 없음"}
                                </span>
                                <span className="mt-1 flex flex-wrap gap-1">
                                    {music.charts.map((chart) => (
                                        <span
                                            key={chart.chartId}
                                            className={cn(
                                                "text-xs capitalize",
                                                getDifficultyColor(
                                                    chart.difficulty
                                                )
                                            )}
                                        >
                                            {chart.difficulty} {chart.level}
                                        </span>
                                    ))}
                                </span>
                            </button>
                        ))}
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
