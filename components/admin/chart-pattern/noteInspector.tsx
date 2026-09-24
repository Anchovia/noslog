"use client";

import { GitBranch, Plus, Trash2 } from "lucide-react";
import { useMemo } from "react";
import { toast } from "sonner";

import {
    changeChartNoteHand,
    getMinimumChartNoteDurationTicks,
    resizeChartNoteHorizontally,
} from "@/lib/chart-pattern/editor";
import {
    CHART_LANE_COUNT,
    type ChartHand,
    type ChartNote,
    type ChartNoteType,
    type ChartPathPoint,
} from "@/lib/chart-pattern/schema";
import { millisecondsToTick } from "@/lib/chart-pattern/timing";
import { useLocale, useTranslations } from "@/components/i18n/localeProvider";

import { useChartEditorStore } from "./chartEditorStore";
import SnapCheckSection from "./snapCheckSection";

const inputClass =
    "border-border bg-bg text-text-primary h-9 w-full rounded-md border px-2 text-sm tabular-nums outline-none focus:border-text-secondary";

const noteTypes: ChartNoteType[] = ["standard", "tenuto", "glissando", "trill"];

const pathSnapDivisors = [1, 2, 3, 4, 6, 8, 12, 16, 24, 32];

function clampLane(lane: number, width: number) {
    return Math.min(CHART_LANE_COUNT - width, Math.max(0, Math.round(lane)));
}

function clampWidth(width: number, lane: number) {
    return Math.min(CHART_LANE_COUNT - lane, Math.max(1, Math.round(width)));
}

export default function NoteInspector() {
    const t = useTranslations();
    const locale = useLocale();
    // 검토 모드(2026-09-24 C1)는 읽기 전용 — 입력을 모두 잠근다
    const readOnly = useChartEditorStore((state) => state.readOnly);
    const document = useChartEditorStore((state) => state.document);
    const currentTimeMs = useChartEditorStore((state) => state.currentTimeMs);
    const snapDivisor = useChartEditorStore((state) => state.snapDivisor);
    const selectedNoteIds = useChartEditorStore(
        (state) => state.selectedNoteIds
    );
    const replaceNotes = useChartEditorStore((state) => state.replaceNotes);

    const notes = document.notes;
    const selectedNotes = useMemo(() => {
        const ids = new Set(selectedNoteIds);
        return notes.filter((note) => ids.has(note.id));
    }, [notes, selectedNoteIds]);
    const selected = useMemo(
        () => (selectedNotes.length === 1 ? selectedNotes[0] : null),
        [selectedNotes]
    );
    const minimumDurationTicks = selected
        ? getMinimumChartNoteDurationTicks(
              selected.type,
              snapDivisor,
              document.ticksPerQuarter
          )
        : 0;

    function updateSelected(changes: Partial<ChartNote>) {
        if (!selected) return;
        replaceNotes(
            notes.map((note) =>
                note.id === selected.id ? { ...note, ...changes } : note
            ),
            selectedNoteIds
        );
    }

    function changeSelectedHand(hand: ChartHand) {
        if (!selected) return;
        replaceNotes(
            notes.map((note) =>
                note.id === selected.id ? changeChartNoteHand(note, hand) : note
            ),
            selectedNoteIds
        );
    }

    function changeType(type: ChartNoteType) {
        if (!selected) return;
        if (type === "standard") {
            updateSelected({
                type,
                durationTicks: 0,
                points: [],
                pairLane: undefined,
                pairWidth: undefined,
                trillSnapDivisor: undefined,
                glissandoSnapDivisor: undefined,
            });
            return;
        }

        const durationTicks = Math.max(
            document.ticksPerQuarter,
            selected.durationTicks
        );
        if (type === "trill") {
            const pairWidth = selected.pairWidth ?? selected.width;
            const preferredLane =
                selected.lane + selected.width < CHART_LANE_COUNT
                    ? selected.lane + selected.width
                    : selected.lane - pairWidth;
            updateSelected({
                type,
                durationTicks,
                points: [],
                pairLane: clampLane(preferredLane, pairWidth),
                pairWidth,
                trillSnapDivisor: selected.trillSnapDivisor ?? snapDivisor,
                glissandoSnapDivisor: undefined,
            });
            return;
        }

        updateSelected({
            type,
            durationTicks,
            pairLane: undefined,
            pairWidth: undefined,
            trillSnapDivisor: undefined,
            glissandoSnapDivisor:
                type === "glissando"
                    ? (selected.glissandoSnapDivisor ?? snapDivisor)
                    : undefined,
        });
    }

    function changeLane(value: number) {
        if (!selected) return;
        updateSelected({
            lane: clampLane(value - 1, selected.width),
        });
    }

    function changeWidth(value: number) {
        if (!selected) return;
        if (selected.type === "trill") {
            const requestedWidth = clampWidth(value, selected.lane);
            const resized = resizeChartNoteHorizontally(
                selected,
                "right",
                selected.lane + requestedWidth - 1
            );
            updateSelected({
                width: resized.width,
                pairLane: resized.pairLane,
                pairWidth: resized.pairWidth,
            });
            return;
        }
        updateSelected({
            width: clampWidth(value, selected.lane),
        });
    }

    function deleteSelected() {
        if (selectedNoteIds.length === 0) return;
        const ids = new Set(selectedNoteIds);
        replaceNotes(
            notes.filter((note) => !ids.has(note.id)),
            []
        );
    }

    function changeSelectedGroupHand(hand: ChartHand) {
        if (selectedNoteIds.length === 0) return;
        const ids = new Set(selectedNoteIds);
        replaceNotes(
            notes.map((note) =>
                ids.has(note.id) ? changeChartNoteHand(note, hand) : note
            ),
            selectedNoteIds
        );
    }

    function updatePoint(index: number, changes: Partial<ChartPathPoint>) {
        if (!selected) return;
        const points = selected.points.map((point, pointIndex) => {
            if (pointIndex !== index) return point;
            const next = { ...point, ...changes };
            next.width = clampWidth(next.width, next.lane);
            next.lane = clampLane(next.lane, next.width);
            next.tickOffset = Math.min(
                selected.durationTicks,
                Math.max(0, Math.round(next.tickOffset))
            );
            return next;
        });
        updateSelected({
            points: [...points].sort(
                (first, second) => first.tickOffset - second.tickOffset
            ),
        });
    }

    function addPathPoint() {
        if (
            !selected ||
            selected.type === "standard" ||
            selected.type === "trill"
        ) {
            return;
        }
        const currentTick = Math.round(
            millisecondsToTick(
                currentTimeMs,
                document.timingPoints,
                document.ticksPerQuarter
            )
        );
        const tickOffset = Math.min(
            selected.durationTicks,
            Math.max(0, currentTick - selected.tick)
        );
        if (selected.points.some((point) => point.tickOffset === tickOffset)) {
            toast.error(t("editor.note.pathPointExists"));
            return;
        }
        updateSelected({
            points: [
                ...selected.points,
                {
                    tickOffset,
                    lane: selected.lane,
                    width: selected.width,
                    hand: selected.hand,
                },
            ].sort((first, second) => first.tickOffset - second.tickOffset),
        });
    }

    return (
        <aside className="border-divider bg-surface flex h-full w-80 shrink-0 flex-col border-l">
            <header className="border-divider border-b px-3 py-2.5">
                <h2 className="text-sm font-bold">{t("editor.note.title")}</h2>
                <p className="text-micro mt-0.5">{t("editor.note.subtitle")}</p>
            </header>

            <fieldset
                disabled={readOnly}
                className="m-0 flex min-h-0 min-w-0 flex-1 flex-col border-0 p-0"
            >
                {selectedNotes.length === 0 ? (
                    <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-6 text-center">
                        <div className="bg-surface-muted flex size-11 items-center justify-center rounded-full">
                            <GitBranch className="text-text-secondary size-4" />
                        </div>
                        <p className="mt-3 text-sm font-semibold">
                            {t("editor.note.emptyTitle")}
                        </p>
                        <p className="text-micro mt-1 leading-relaxed">
                            {t("editor.note.emptyBody")}
                        </p>
                    </div>
                ) : selectedNotes.length > 1 ? (
                    <div className="min-h-0 flex-1 overflow-y-auto p-3">
                        <div className="border-border bg-bg rounded-md border p-3">
                            <strong className="text-sm">
                                {t("editor.note.multiSelected", {
                                    count: selectedNotes.length.toLocaleString(
                                        locale
                                    ),
                                })}
                            </strong>
                            <p className="text-micro mt-1 leading-relaxed">
                                {t("editor.note.multiHelp")}
                            </p>
                        </div>
                        <label className="text-caption mt-4 flex flex-col gap-1">
                            {t("editor.note.bulkHand")}
                            <HandSelector
                                value={selectedNotes[0].hand}
                                onChange={changeSelectedGroupHand}
                            />
                        </label>
                        <button
                            type="button"
                            onClick={deleteSelected}
                            className="border-danger/40 text-danger mt-4 flex h-9 w-full items-center justify-center gap-1 rounded-md border text-xs font-semibold"
                        >
                            <Trash2 className="size-3.5" />
                            {t("editor.note.deleteMany", {
                                count: selectedNotes.length.toLocaleString(
                                    locale
                                ),
                            })}
                        </button>
                    </div>
                ) : selected ? (
                    <div className="min-h-0 flex-1 overflow-y-auto p-3">
                        <div className="grid grid-cols-2 gap-3">
                            <label className="text-caption col-span-2 flex flex-col gap-1">
                                {t("editor.note.type")}
                                <select
                                    value={selected.type}
                                    onChange={(event) =>
                                        changeType(
                                            event.target.value as ChartNoteType
                                        )
                                    }
                                    className={inputClass}
                                >
                                    {noteTypes.map((value) => (
                                        <option key={value} value={value}>
                                            {t(`editor.noteType.${value}`)}
                                        </option>
                                    ))}
                                </select>
                            </label>

                            <label className="text-caption col-span-2 flex flex-col gap-1">
                                {t("editor.note.hand")}
                                <HandSelector
                                    value={selected.hand}
                                    onChange={changeSelectedHand}
                                />
                            </label>

                            <label className="text-caption flex flex-col gap-1">
                                {t("editor.note.lane")}
                                <input
                                    type="number"
                                    min="1"
                                    max={CHART_LANE_COUNT}
                                    step="1"
                                    value={selected.lane + 1}
                                    onChange={(event) => {
                                        const value = Number(
                                            event.target.value
                                        );
                                        if (Number.isInteger(value)) {
                                            changeLane(value);
                                        }
                                    }}
                                    className={inputClass}
                                />
                            </label>

                            <label className="text-caption flex flex-col gap-1">
                                {t("editor.note.width")}
                                <input
                                    type="number"
                                    min="1"
                                    max={CHART_LANE_COUNT}
                                    step="1"
                                    value={selected.width}
                                    onChange={(event) => {
                                        const value = Number(
                                            event.target.value
                                        );
                                        if (Number.isInteger(value)) {
                                            changeWidth(value);
                                        }
                                    }}
                                    className={inputClass}
                                />
                            </label>

                            <label className="text-caption flex flex-col gap-1">
                                {t("editor.note.tick")}
                                <input
                                    key={`${selected.id}-tick-${selected.tick}`}
                                    type="number"
                                    step="1"
                                    defaultValue={selected.tick}
                                    onBlur={(event) => {
                                        const value = Number(
                                            event.target.value
                                        );
                                        if (Number.isInteger(value)) {
                                            updateSelected({ tick: value });
                                        }
                                    }}
                                    className={inputClass}
                                />
                            </label>

                            <label className="text-caption flex flex-col gap-1">
                                {t("editor.note.duration")}
                                <input
                                    key={`${selected.id}-duration-${selected.durationTicks}`}
                                    type="number"
                                    min={minimumDurationTicks}
                                    step="1"
                                    disabled={selected.type === "standard"}
                                    defaultValue={selected.durationTicks}
                                    onBlur={(event) => {
                                        const value = Number(
                                            event.target.value
                                        );
                                        if (
                                            Number.isInteger(value) &&
                                            value >= 0
                                        ) {
                                            updateSelected({
                                                durationTicks: Math.max(
                                                    minimumDurationTicks,
                                                    value
                                                ),
                                            });
                                        }
                                    }}
                                    className={inputClass}
                                />
                            </label>

                            {selected.type === "trill" ? (
                                <>
                                    <label className="text-caption flex flex-col gap-1">
                                        {t("editor.note.pairLane")}
                                        <input
                                            key={`${selected.id}-pair-lane-${selected.pairLane}`}
                                            type="number"
                                            min="1"
                                            max={CHART_LANE_COUNT}
                                            step="1"
                                            defaultValue={
                                                (selected.pairLane ?? 0) + 1
                                            }
                                            onBlur={(event) => {
                                                const width =
                                                    selected.pairWidth ??
                                                    selected.width;
                                                updateSelected({
                                                    pairLane: clampLane(
                                                        Number(
                                                            event.target.value
                                                        ) - 1,
                                                        width
                                                    ),
                                                });
                                            }}
                                            className={inputClass}
                                        />
                                    </label>
                                    <label className="text-caption flex flex-col gap-1">
                                        {t("editor.note.pairWidth")}
                                        <input
                                            key={`${selected.id}-pair-width-${selected.pairWidth}`}
                                            type="number"
                                            min="1"
                                            max={CHART_LANE_COUNT}
                                            step="1"
                                            defaultValue={
                                                selected.pairWidth ??
                                                selected.width
                                            }
                                            onBlur={(event) => {
                                                const lane =
                                                    selected.pairLane ??
                                                    selected.lane;
                                                updateSelected({
                                                    pairWidth: clampWidth(
                                                        Number(
                                                            event.target.value
                                                        ),
                                                        lane
                                                    ),
                                                });
                                            }}
                                            className={inputClass}
                                        />
                                    </label>
                                    <label className="text-caption col-span-2 flex flex-col gap-1">
                                        {t("editor.note.trillStep")}
                                        <select
                                            value={
                                                selected.trillSnapDivisor ?? 8
                                            }
                                            onChange={(event) =>
                                                updateSelected({
                                                    trillSnapDivisor: Number(
                                                        event.target.value
                                                    ),
                                                })
                                            }
                                            className={inputClass}
                                        >
                                            {[4, 6, 8, 12, 16].map(
                                                (divisor) => (
                                                    <option
                                                        key={divisor}
                                                        value={divisor}
                                                    >
                                                        1/{divisor}
                                                    </option>
                                                )
                                            )}
                                        </select>
                                    </label>
                                </>
                            ) : null}

                            {selected.type === "glissando" ? (
                                <label className="text-caption col-span-2 flex flex-col gap-1">
                                    {t("editor.note.glissandoStep")}
                                    <select
                                        value={
                                            selected.glissandoSnapDivisor ?? 4
                                        }
                                        onChange={(event) =>
                                            updateSelected({
                                                glissandoSnapDivisor: Number(
                                                    event.target.value
                                                ),
                                            })
                                        }
                                        className={inputClass}
                                    >
                                        {pathSnapDivisors.map((divisor) => (
                                            <option
                                                key={divisor}
                                                value={divisor}
                                            >
                                                1/{divisor}
                                            </option>
                                        ))}
                                    </select>
                                </label>
                            ) : null}
                        </div>

                        {selected.type === "tenuto" ||
                        selected.type === "glissando" ? (
                            <section className="border-divider mt-4 border-t pt-4">
                                <div className="flex items-center justify-between gap-2">
                                    <div>
                                        <h3 className="text-xs font-semibold">
                                            {t("editor.note.path")}
                                        </h3>
                                        <p className="text-micro mt-0.5">
                                            {selected.type === "glissando"
                                                ? t(
                                                      "editor.note.pathHelpGlissando"
                                                  )
                                                : t(
                                                      "editor.note.pathHelpTenuto"
                                                  )}
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={addPathPoint}
                                        className="border-border hover:bg-surface-muted flex h-8 shrink-0 items-center gap-1 rounded-md border px-2 text-xs font-semibold"
                                    >
                                        <Plus className="size-3.5" />
                                        {t("editor.add")}
                                    </button>
                                </div>

                                {selected.points.length > 0 ? (
                                    <div className="mt-3 flex flex-col gap-2">
                                        {selected.points.map((point, index) => (
                                            <PathPointEditor
                                                key={`${selected.id}-${point.tickOffset}-${index}`}
                                                index={index}
                                                point={point}
                                                onChange={(changes) =>
                                                    updatePoint(index, changes)
                                                }
                                                onDelete={() =>
                                                    updateSelected({
                                                        points: selected.points.filter(
                                                            (_, pointIndex) =>
                                                                pointIndex !==
                                                                index
                                                        ),
                                                    })
                                                }
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-micro mt-3">
                                        {selected.type === "glissando"
                                            ? t(
                                                  "editor.note.pathEmptyGlissando"
                                              )
                                            : t("editor.note.pathEmpty")}
                                    </p>
                                )}
                            </section>
                        ) : null}

                        <button
                            type="button"
                            onClick={deleteSelected}
                            className="border-danger/40 text-danger mt-4 flex h-9 w-full items-center justify-center gap-1 rounded-md border text-xs font-semibold"
                        >
                            <Trash2 className="size-3.5" />
                            {t("editor.note.delete")}
                        </button>
                    </div>
                ) : null}

                <SnapCheckSection />
            </fieldset>

            <footer className="border-divider text-micro border-t px-3 py-2">
                {t("editor.note.total", {
                    count: notes.length.toLocaleString(locale),
                })}
                {selectedNotes.length > 0
                    ? ` · ${t("editor.note.selectedCount", {
                          count: selectedNotes.length.toLocaleString(locale),
                      })}`
                    : ""}
            </footer>
        </aside>
    );
}

function HandSelector({
    value,
    onChange,
}: {
    value: ChartHand;
    onChange: (value: ChartHand) => void;
}) {
    const t = useTranslations();
    return (
        <div className="grid grid-cols-2 gap-1">
            {(["left", "right"] as const).map((hand) => (
                <button
                    key={hand}
                    type="button"
                    onClick={() => onChange(hand)}
                    className={`h-9 rounded-md border text-xs font-semibold ${
                        value === hand
                            ? hand === "left"
                                ? "border-cyan-400/50 bg-cyan-400/10 text-cyan-200"
                                : "border-red-400/50 bg-red-400/10 text-red-200"
                            : "border-border text-text-secondary"
                    }`}
                >
                    {t(`editor.hand.${hand}`)}
                </button>
            ))}
        </div>
    );
}

function PathPointEditor({
    point,
    index,
    onChange,
    onDelete,
}: {
    point: ChartPathPoint;
    index: number;
    onChange: (changes: Partial<ChartPathPoint>) => void;
    onDelete: () => void;
}) {
    const t = useTranslations();
    return (
        <div className="border-border bg-bg rounded-md border p-2">
            <div className="mb-2 flex items-center justify-between">
                <strong className="text-xs">
                    {t("editor.point.title", { index: index + 1 })}
                </strong>
                <button
                    type="button"
                    onClick={onDelete}
                    aria-label={t("editor.point.delete", { index: index + 1 })}
                    className="text-danger hover:bg-surface-muted flex size-7 items-center justify-center rounded"
                >
                    <Trash2 className="size-3.5" />
                </button>
            </div>
            <div className="grid grid-cols-3 gap-2">
                <label className="text-micro flex flex-col gap-1">
                    {t("editor.point.tick")}
                    <input
                        key={`tick-${point.tickOffset}`}
                        type="number"
                        defaultValue={point.tickOffset}
                        onBlur={(event) =>
                            onChange({
                                tickOffset: Number(event.target.value),
                            })
                        }
                        className={inputClass}
                    />
                </label>
                <label className="text-micro flex flex-col gap-1">
                    {t("editor.point.lane")}
                    <input
                        key={`lane-${point.lane}`}
                        type="number"
                        min="1"
                        max={CHART_LANE_COUNT}
                        defaultValue={point.lane + 1}
                        onBlur={(event) =>
                            onChange({
                                lane: Number(event.target.value) - 1,
                            })
                        }
                        className={inputClass}
                    />
                </label>
                <label className="text-micro flex flex-col gap-1">
                    {t("editor.note.width")}
                    <input
                        key={`width-${point.width}`}
                        type="number"
                        min="1"
                        max={CHART_LANE_COUNT}
                        defaultValue={point.width}
                        onBlur={(event) =>
                            onChange({
                                width: Number(event.target.value),
                            })
                        }
                        className={inputClass}
                    />
                </label>
            </div>
            <label className="text-micro mt-2 flex flex-col gap-1">
                {t("editor.point.hand")}
                <select
                    value={point.hand ?? ""}
                    onChange={(event) => {
                        const value = event.target.value;
                        onChange({
                            hand:
                                value === "" ? undefined : (value as ChartHand),
                        });
                    }}
                    className={inputClass}
                >
                    <option value="">{t("editor.point.handDefault")}</option>
                    <option value="left">{t("editor.hand.left")}</option>
                    <option value="right">{t("editor.hand.right")}</option>
                </select>
            </label>
        </div>
    );
}
