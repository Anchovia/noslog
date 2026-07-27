"use client";

import { GitBranch, Plus, Trash2 } from "lucide-react";
import { useMemo } from "react";
import { toast } from "sonner";

import {
    CHART_LANE_COUNT,
    type ChartHand,
    type ChartNote,
    type ChartNoteType,
    type ChartPathPoint,
} from "@/lib/chart-pattern/schema";
import { millisecondsToTick } from "@/lib/chart-pattern/timing";

import { useChartEditorStore } from "./chartEditorStore";

const inputClass =
    "border-border bg-bg text-text-primary h-9 w-full rounded-md border px-2 text-sm tabular-nums outline-none focus:border-text-secondary";

const noteTypeLabels: Record<ChartNoteType, string> = {
    standard: "일반",
    tenuto: "테누토",
    glissando: "글리산도",
    trill: "트릴",
};

function clampLane(lane: number, width: number) {
    return Math.min(CHART_LANE_COUNT - width, Math.max(0, Math.round(lane)));
}

function clampWidth(width: number, lane: number) {
    return Math.min(CHART_LANE_COUNT - lane, Math.max(1, Math.round(width)));
}

export default function NoteInspector() {
    const document = useChartEditorStore((state) => state.document);
    const currentTimeMs = useChartEditorStore((state) => state.currentTimeMs);
    const selectedNoteId = useChartEditorStore((state) => state.selectedNoteId);
    const replaceNotes = useChartEditorStore((state) => state.replaceNotes);

    const notes = document.notes;
    const selected = useMemo(
        () => notes.find((note) => note.id === selectedNoteId) ?? null,
        [notes, selectedNoteId]
    );

    function updateSelected(changes: Partial<ChartNote>) {
        if (!selected) return;
        replaceNotes(
            notes.map((note) =>
                note.id === selected.id ? { ...note, ...changes } : note
            )
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
            });
            return;
        }

        updateSelected({
            type,
            durationTicks,
            pairLane: undefined,
            pairWidth: undefined,
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
        updateSelected({
            width: clampWidth(value, selected.lane),
        });
    }

    function deleteSelected() {
        if (!selected) return;
        replaceNotes(
            notes.filter((note) => note.id !== selected.id),
            null
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
            toast.error("같은 위치에 이미 경로 제어점이 있습니다.");
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
                <h2 className="text-sm font-bold">노트 속성</h2>
                <p className="text-micro mt-0.5">
                    선택한 노트의 위치·폭·길이·손을 조정합니다.
                </p>
            </header>

            {!selected ? (
                <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-6 text-center">
                    <div className="bg-surface-muted flex size-11 items-center justify-center rounded-full">
                        <GitBranch className="text-text-secondary size-4" />
                    </div>
                    <p className="mt-3 text-sm font-semibold">
                        노트를 선택해주세요
                    </p>
                    <p className="text-micro mt-1 leading-relaxed">
                        선택 도구로 캔버스의 노트를 누르면 세부 속성과 경로
                        제어점을 편집할 수 있습니다.
                    </p>
                </div>
            ) : (
                <div className="min-h-0 flex-1 overflow-y-auto p-3">
                    <div className="grid grid-cols-2 gap-3">
                        <label className="text-caption col-span-2 flex flex-col gap-1">
                            노트 종류
                            <select
                                value={selected.type}
                                onChange={(event) =>
                                    changeType(
                                        event.target.value as ChartNoteType
                                    )
                                }
                                className={inputClass}
                            >
                                {Object.entries(noteTypeLabels).map(
                                    ([value, label]) => (
                                        <option key={value} value={value}>
                                            {label}
                                        </option>
                                    )
                                )}
                            </select>
                        </label>

                        <label className="text-caption col-span-2 flex flex-col gap-1">
                            연주 안내 손
                            <HandSelector
                                value={selected.hand}
                                onChange={(hand) => updateSelected({ hand })}
                            />
                        </label>

                        <label className="text-caption flex flex-col gap-1">
                            시작 칸
                            <input
                                key={`${selected.id}-lane-${selected.lane}`}
                                type="number"
                                min="1"
                                max={CHART_LANE_COUNT}
                                step="1"
                                defaultValue={selected.lane + 1}
                                onBlur={(event) =>
                                    changeLane(Number(event.target.value))
                                }
                                className={inputClass}
                            />
                        </label>

                        <label className="text-caption flex flex-col gap-1">
                            폭
                            <input
                                key={`${selected.id}-width-${selected.width}`}
                                type="number"
                                min="1"
                                max={CHART_LANE_COUNT}
                                step="1"
                                defaultValue={selected.width}
                                onBlur={(event) =>
                                    changeWidth(Number(event.target.value))
                                }
                                className={inputClass}
                            />
                        </label>

                        <label className="text-caption flex flex-col gap-1">
                            시작 틱
                            <input
                                key={`${selected.id}-tick-${selected.tick}`}
                                type="number"
                                step="1"
                                defaultValue={selected.tick}
                                onBlur={(event) => {
                                    const value = Number(event.target.value);
                                    if (Number.isInteger(value)) {
                                        updateSelected({ tick: value });
                                    }
                                }}
                                className={inputClass}
                            />
                        </label>

                        <label className="text-caption flex flex-col gap-1">
                            길이(틱)
                            <input
                                key={`${selected.id}-duration-${selected.durationTicks}`}
                                type="number"
                                min={selected.type === "standard" ? 0 : 1}
                                step="1"
                                disabled={selected.type === "standard"}
                                defaultValue={selected.durationTicks}
                                onBlur={(event) => {
                                    const value = Number(event.target.value);
                                    if (
                                        Number.isInteger(value) &&
                                        value >=
                                            (selected.type === "standard"
                                                ? 0
                                                : 1)
                                    ) {
                                        updateSelected({
                                            durationTicks: value,
                                        });
                                    }
                                }}
                                className={inputClass}
                            />
                        </label>

                        {selected.type === "trill" ? (
                            <>
                                <label className="text-caption flex flex-col gap-1">
                                    두 번째 칸
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
                                                    Number(event.target.value) -
                                                        1,
                                                    width
                                                ),
                                            });
                                        }}
                                        className={inputClass}
                                    />
                                </label>
                                <label className="text-caption flex flex-col gap-1">
                                    두 번째 폭
                                    <input
                                        key={`${selected.id}-pair-width-${selected.pairWidth}`}
                                        type="number"
                                        min="1"
                                        max={CHART_LANE_COUNT}
                                        step="1"
                                        defaultValue={
                                            selected.pairWidth ?? selected.width
                                        }
                                        onBlur={(event) => {
                                            const lane =
                                                selected.pairLane ??
                                                selected.lane;
                                            updateSelected({
                                                pairWidth: clampWidth(
                                                    Number(event.target.value),
                                                    lane
                                                ),
                                            });
                                        }}
                                        className={inputClass}
                                    />
                                </label>
                            </>
                        ) : null}
                    </div>

                    {selected.type === "tenuto" ||
                    selected.type === "glissando" ? (
                        <section className="border-divider mt-4 border-t pt-4">
                            <div className="flex items-center justify-between gap-2">
                                <div>
                                    <h3 className="text-xs font-semibold">
                                        경로 제어점
                                    </h3>
                                    <p className="text-micro mt-0.5">
                                        현재 재생 위치에 위치·폭·손 변화를
                                        추가합니다.
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={addPathPoint}
                                    className="border-border hover:bg-surface-muted flex h-8 shrink-0 items-center gap-1 rounded-md border px-2 text-xs font-semibold"
                                >
                                    <Plus className="size-3.5" />
                                    추가
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
                                                            pointIndex !== index
                                                    ),
                                                })
                                            }
                                        />
                                    ))}
                                </div>
                            ) : (
                                <p className="text-micro mt-3">
                                    아직 경로 변화가 없습니다.
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
                        선택한 노트 삭제
                    </button>
                </div>
            )}

            <footer className="border-divider text-micro border-t px-3 py-2">
                전체 {notes.length.toLocaleString("ko-KR")}개
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
    return (
        <div className="grid grid-cols-2 gap-1">
            {(
                [
                    ["left", "왼손"],
                    ["right", "오른손"],
                ] as const
            ).map(([hand, label]) => (
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
                    {label}
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
    return (
        <div className="border-border bg-bg rounded-md border p-2">
            <div className="mb-2 flex items-center justify-between">
                <strong className="text-xs">제어점 {index + 1}</strong>
                <button
                    type="button"
                    onClick={onDelete}
                    aria-label={`제어점 ${index + 1} 삭제`}
                    className="text-danger hover:bg-surface-muted flex size-7 items-center justify-center rounded"
                >
                    <Trash2 className="size-3.5" />
                </button>
            </div>
            <div className="grid grid-cols-3 gap-2">
                <label className="text-micro flex flex-col gap-1">
                    틱
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
                    칸
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
                    폭
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
                손 색상
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
                    <option value="">노트 기본 손</option>
                    <option value="left">왼손</option>
                    <option value="right">오른손</option>
                </select>
            </label>
        </div>
    );
}
