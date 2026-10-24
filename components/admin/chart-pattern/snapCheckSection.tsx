"use client";

import { ArrowDown, ArrowUp } from "lucide-react";
import { type KeyboardEvent, useMemo, useState } from "react";

import {
    findOffGridNotes,
    snapNotesToNearestGrid,
} from "@/lib/chart-pattern/snapCheck";
import { tickToMilliseconds } from "@/lib/chart-pattern/timing";
import { chartPositionLabel } from "@/lib/chart-pattern/vid2bmap";
import { useLocale, useTranslations } from "@/components/i18n/locale-provider";

import { useChartEditorStore } from "./chartEditorStore";
import { foundationButtonClass } from "@/components/ui/button";
import { cn } from "@/lib/cn";

/** 「12마디 3½박」(관리자 영상 추출 창과 같은 표기) → 에디터 언어로(ko · ja · en) */
function localizedPosition(
    label: string,
    format: (measure: string, beat: string) => string
) {
    const match = label.match(/^(\d+)마디 (.+)박$/);
    return match ? format(match[1], match[2]) : label;
}

/**
 * 스냅 확인 — 에디터 스냅 격자 어느 것에도 안 맞는 노트 목록(2026-09-24 C, osu! 검사 「Unsnapped hitobjects」 와 같은 생각).
 * 노트 검사기 아래에 걸린 노트가 있을 때만 보인다. 모양은 영상 추출 가져오기 창의 「달라진 곳」 목록과 같다.
 */
export default function SnapCheckSection() {
    const t = useTranslations();
    const locale = useLocale();
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
        <section className="nl-editor-snap flex shrink-0 flex-col gap-nl-8 border-t-nl-stroke border-nl-divider px-nl-12 py-nl-12">
            <div className="flex items-center justify-between gap-nl-8">
                <h3 className="nl-metadata flex items-center gap-nl-8">
                    {t("editor.snap.title")}
                    <span className="nl-admin-chip nl-admin-chip--warning">
                        {t("editor.snap.count", {
                            count: items.length.toLocaleString(locale),
                        })}
                    </span>
                </h3>
                <span className="flex gap-nl-4">
                    <button
                        type="button"
                        onClick={() => moveFocus(-1)}
                        aria-label={t("editor.snap.previous")}
                        className="nl-hover-layer flex size-nl-24 items-center justify-center rounded-nl-control border-nl-stroke border-nl-divider"
                    >
                        <ArrowUp className="nl-icon-small" />
                    </button>
                    <button
                        type="button"
                        onClick={() => moveFocus(1)}
                        aria-label={t("editor.snap.next")}
                        className="nl-hover-layer flex size-nl-24 items-center justify-center rounded-nl-control border-nl-stroke border-nl-divider"
                    >
                        <ArrowDown className="nl-icon-small" />
                    </button>
                </span>
            </div>
            <div
                role="list"
                tabIndex={0}
                onKeyDown={handleListKey}
                aria-label={t("editor.snap.list")}
                className="flex min-h-0 flex-col gap-nl-4 overflow-y-auto rounded-nl-field focus-visible:outline-nl-stroke focus-visible:outline-nl-focus"
            >
                {items.map((item, index) => {
                    const note = notesById.get(item.id);
                    const isFocused = index === focused;
                    const offset = Math.round(item.offsetMs);
                    return (
                        <div
                            key={item.id}
                            role="listitem"
                            className={`flex flex-col gap-nl-4 rounded-nl-field border-nl-stroke px-nl-8 py-nl-8 ${
                                isFocused
                                    ? "border-nl-subdued bg-nl-surface"
                                    : "border-nl-divider"
                            }`}
                        >
                            <button
                                type="button"
                                onClick={() => focusOn(index)}
                                className="flex items-baseline justify-between gap-nl-8 text-left"
                            >
                                <span className="nl-metadata shrink-0">
                                    {t("editor.snap.near", {
                                        position: localizedPosition(
                                            chartPositionLabel(
                                                item.nearestTick,
                                                document.timingPoints
                                            ),
                                            (measure, beat) =>
                                                t("editor.position", {
                                                    measure,
                                                    beat,
                                                })
                                        ),
                                    })}
                                </span>
                                <span className="nl-metadata min-w-0 text-right text-nl-subdued">
                                    {note
                                        ? `${t(`editor.hand.${note.hand}`)} · ${t("editor.snap.lane", { lane: note.lane + 1 })} · `
                                        : ""}
                                    {t("editor.snap.offset", {
                                        divisor: item.divisor,
                                        offset: `${offset > 0 ? "+" : offset < 0 ? "−" : "±"}${Math.abs(offset)}`,
                                    })}
                                </span>
                            </button>
                            {isFocused ? (
                                <button
                                    type="button"
                                    onClick={() => snap([item.id])}
                                    className="nl-metadata h-nl-24 self-start rounded-nl-control border-nl-stroke border-nl-content bg-nl-primary px-nl-8 text-nl-on-primary"
                                >
                                    {t("editor.snap.one")}
                                </button>
                            ) : null}
                        </div>
                    );
                })}
            </div>
            <button
                type="button"
                onClick={() => snap(items.map((item) => item.id))}
                className={cn(
                    foundationButtonClass({ variant: "secondary", size: "sm" }),
                    "shrink-0"
                )}
            >
                {t("editor.snap.all")}
            </button>
        </section>
    );
}
