"use client";

import { ArrowDown, ArrowUp } from "lucide-react";
import { type KeyboardEvent, useMemo, useState } from "react";

import {
    findOffGridNotes,
    snapNotesToNearestGrid,
} from "@/lib/chart-pattern/snapCheck";
import { tickToMilliseconds } from "@/lib/chart-pattern/timing";
import { chartPositionLabel } from "@/lib/chart-pattern/vid2bmap";

import { useChartEditorStore } from "./chartEditorStore";

const handLabels = { left: "왼손", right: "오른손" } as const;

/**
 * 스냅 확인 — 에디터 스냅 격자 어느 것에도 안 맞는 노트 목록(2026-09-24 C, osu! 검사 「Unsnapped hitobjects」 와 같은 생각).
 * 노트 검사기 아래에 걸린 노트가 있을 때만 보인다. 모양은 영상 추출 가져오기 창의 「달라진 곳」 목록과 같다.
 */
export default function SnapCheckSection() {
    const document = useChartEditorStore((state) => state.document);
    const replaceNotes = useChartEditorStore((state) => state.replaceNotes);
    const selectNotes = useChartEditorStore((state) => state.selectNotes);
    const setCurrentTimeMs = useChartEditorStore(
        (state) => state.setCurrentTimeMs
    );
    const items = useMemo(() => findOffGridNotes(document), [document]);
    const notesById = useMemo(
        () => new Map(document.notes.map((note) => [note.id, note])),
        [document.notes]
    );
    const [focusIndex, setFocusIndex] = useState<number | null>(null);

    if (items.length === 0) return null;
    const focused =
        focusIndex !== null ? Math.min(focusIndex, items.length - 1) : null;

    const focusOn = (index: number) => {
        const item = items[index];
        setFocusIndex(index);
        selectNotes([item.id]);
        setCurrentTimeMs(
            tickToMilliseconds(
                item.tick,
                document.timingPoints,
                document.ticksPerQuarter
            )
        );
    };
    const moveFocus = (step: number) =>
        focusOn(
            focused === null
                ? step > 0
                    ? 0
                    : items.length - 1
                : (focused + step + items.length) % items.length
        );
    const handleListKey = (event: KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            moveFocus(event.key === "ArrowDown" ? 1 : -1);
        }
    };
    const snap = (ids: string[]) =>
        replaceNotes(snapNotesToNearestGrid(document, new Set(ids)), ids);

    return (
        <section className="border-divider flex max-h-[45%] shrink-0 flex-col gap-1.5 border-t px-3 py-2.5">
            <div className="flex items-center justify-between gap-2">
                <h3 className="flex items-center gap-2 text-xs font-bold">
                    스냅 확인
                    <span className="nl-admin-chip nl-admin-chip--warning tabular-nums">
                        격자 밖 {items.length.toLocaleString("ko-KR")}
                    </span>
                </h3>
                <span className="flex gap-1">
                    <button
                        type="button"
                        onClick={() => moveFocus(-1)}
                        aria-label="이전 노트"
                        className="border-border hover:bg-surface-muted flex size-6 items-center justify-center rounded border"
                    >
                        <ArrowUp className="size-3" />
                    </button>
                    <button
                        type="button"
                        onClick={() => moveFocus(1)}
                        aria-label="다음 노트"
                        className="border-border hover:bg-surface-muted flex size-6 items-center justify-center rounded border"
                    >
                        <ArrowDown className="size-3" />
                    </button>
                </span>
            </div>
            <div
                role="list"
                tabIndex={0}
                onKeyDown={handleListKey}
                aria-label="격자 밖 노트"
                className="focus-visible:outline-focus flex min-h-0 flex-col gap-1 overflow-y-auto rounded-md focus-visible:outline-1"
            >
                {items.map((item, index) => {
                    const note = notesById.get(item.id);
                    const isFocused = index === focused;
                    const offset = Math.round(item.offsetMs);
                    return (
                        <div
                            key={item.id}
                            role="listitem"
                            className={`flex flex-col gap-1 rounded-md border px-2 py-1.5 ${
                                isFocused
                                    ? "border-text-secondary bg-surface-muted"
                                    : "border-border"
                            }`}
                        >
                            <button
                                type="button"
                                onClick={() => focusOn(index)}
                                className="flex items-baseline justify-between gap-2 text-left"
                            >
                                <span className="shrink-0 text-xs font-bold tabular-nums">
                                    {chartPositionLabel(
                                        item.nearestTick,
                                        document.timingPoints
                                    )}{" "}
                                    근처
                                </span>
                                <span className="text-text-secondary min-w-0 text-right text-xs tabular-nums">
                                    {note
                                        ? `${handLabels[note.hand]} · ${note.lane + 1}번 칸 · `
                                        : ""}
                                    1/{item.divisor}박에서{" "}
                                    {offset > 0 ? "+" : offset < 0 ? "−" : "±"}
                                    {Math.abs(offset)}ms
                                </span>
                            </button>
                            {isFocused ? (
                                <button
                                    type="button"
                                    onClick={() => snap([item.id])}
                                    className="border-text-primary bg-text-primary text-bg h-6 self-start rounded border px-2 text-xs font-semibold"
                                >
                                    가까운 격자로
                                </button>
                            ) : null}
                        </div>
                    );
                })}
            </div>
            <button
                type="button"
                onClick={() => snap(items.map((item) => item.id))}
                className="border-border hover:bg-surface-muted h-8 shrink-0 rounded-md border text-xs font-semibold"
            >
                모두 가까운 격자로
            </button>
        </section>
    );
}
