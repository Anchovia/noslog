"use client";

import { Gauge, Plus, Trash2 } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import {
    type ChartTimingPoint,
    timeSignatureDenominatorSchema,
} from "@/lib/chart-pattern/schema";
import {
    formatBpm,
    formatEditorTime,
    millisecondsToTick,
    snapTick,
    sortTimingPoints,
} from "@/lib/chart-pattern/timing";

import { useChartEditorStore } from "./chartEditorStore";

const inputClass =
    "border-border bg-bg text-text-primary h-9 w-full rounded-md border px-2 text-sm tabular-nums outline-none focus:border-text-secondary";

function roundedBpm(value: number) {
    return Math.round(value * 1_000) / 1_000;
}

export default function TimingInspector() {
    const document = useChartEditorStore((state) => state.document);
    const currentTimeMs = useChartEditorStore((state) => state.currentTimeMs);
    const snapDivisor = useChartEditorStore((state) => state.snapDivisor);
    const selectedTimingPointId = useChartEditorStore(
        (state) => state.selectedTimingPointId
    );
    const selectTimingPoint = useChartEditorStore(
        (state) => state.selectTimingPoint
    );
    const replaceTimingPoints = useChartEditorStore(
        (state) => state.replaceTimingPoints
    );
    const [tapBpm, setTapBpm] = useState<number | null>(null);
    const tapsRef = useRef<number[]>([]);

    const sortedPoints = useMemo(
        () => sortTimingPoints(document.timingPoints),
        [document.timingPoints]
    );
    const selected =
        sortedPoints.find((point) => point.id === selectedTimingPointId) ??
        sortedPoints[0];
    const selectedIndex = sortedPoints.findIndex(
        (point) => point.id === selected.id
    );

    function updateSelected(changes: Partial<ChartTimingPoint>) {
        replaceTimingPoints(
            document.timingPoints.map((point) =>
                point.id === selected.id ? { ...point, ...changes } : point
            )
        );
    }

    function addTimingPoint() {
        const rawTick = millisecondsToTick(
            currentTimeMs,
            document.timingPoints,
            document.ticksPerQuarter
        );
        const tick = Math.round(
            snapTick(rawTick, snapDivisor, document.ticksPerQuarter)
        );
        if (
            document.timingPoints.some(
                (point) =>
                    point.tick === tick ||
                    Math.abs(point.timeMs - currentTimeMs) < 1
            )
        ) {
            toast.error("같은 위치에 이미 타이밍 포인트가 있습니다.");
            return;
        }

        const previous =
            [...sortedPoints]
                .reverse()
                .find((point) => point.timeMs < currentTimeMs) ??
            sortedPoints[0];
        const next: ChartTimingPoint = {
            id: crypto.randomUUID(),
            tick,
            timeMs: Math.round(currentTimeMs * 1_000) / 1_000,
            bpm: previous.bpm,
            numerator: previous.numerator,
            denominator: previous.denominator,
        };
        replaceTimingPoints([...document.timingPoints, next]);
        selectTimingPoint(next.id);
    }

    function deleteSelected() {
        if (sortedPoints.length <= 1 || selectedIndex === 0) return;
        const next = document.timingPoints.filter(
            (point) => point.id !== selected.id
        );
        replaceTimingPoints(next);
        selectTimingPoint(sortedPoints[selectedIndex - 1].id);
    }

    function registerTap() {
        const now = performance.now();
        const previous = tapsRef.current.at(-1);
        if (previous === undefined || now - previous > 2_000) {
            tapsRef.current = [now];
            setTapBpm(null);
            return;
        }

        tapsRef.current = [...tapsRef.current.slice(-7), now];
        const intervals = tapsRef.current
            .slice(1)
            .map((tap, index) => tap - tapsRef.current[index]);
        const average =
            intervals.reduce((sum, interval) => sum + interval, 0) /
            intervals.length;
        const nextBpm = roundedBpm(60_000 / average);
        setTapBpm(nextBpm);
        updateSelected({ bpm: nextBpm });
    }

    return (
        <aside className="border-divider bg-surface flex h-full w-80 shrink-0 flex-col border-l">
            <header className="border-divider flex items-center justify-between border-b px-3 py-2.5">
                <div>
                    <h2 className="text-sm font-bold">타이밍 포인트</h2>
                    <p className="text-micro mt-0.5">
                        BPM·박자표·메트로놈 기준
                    </p>
                </div>
                <button
                    type="button"
                    onClick={addTimingPoint}
                    className="border-border hover:bg-surface-muted flex h-8 items-center gap-1 rounded-md border px-2 text-xs font-semibold"
                >
                    <Plus className="size-3.5" />
                    추가
                </button>
            </header>

            <div className="border-divider max-h-48 overflow-y-auto border-b p-2">
                <div className="flex flex-col gap-1">
                    {sortedPoints.map((point, index) => (
                        <button
                            key={point.id}
                            type="button"
                            onClick={() => selectTimingPoint(point.id)}
                            className={`rounded-md px-2.5 py-2 text-left transition-colors ${
                                point.id === selected.id
                                    ? "bg-surface-muted text-text-primary"
                                    : "text-text-secondary hover:bg-surface-muted/60"
                            }`}
                        >
                            <span className="flex items-center justify-between gap-2 text-xs">
                                <strong className="font-semibold">
                                    {index === 0
                                        ? "시작 타이밍"
                                        : `타이밍 ${index + 1}`}
                                </strong>
                                <span className="tabular-nums">
                                    {formatEditorTime(point.timeMs)}
                                </span>
                            </span>
                            <span className="text-micro mt-1 block">
                                {formatBpm(point.bpm)} BPM · {point.numerator}/
                                {point.denominator}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-3">
                <div className="grid grid-cols-2 gap-3">
                    <label className="text-caption col-span-2 flex flex-col gap-1">
                        {selectedIndex === 0 ? "첫 박자 오프셋" : "음원 시간"}
                        <div className="relative">
                            <input
                                key={`${selected.id}-time-${selected.timeMs}`}
                                type="number"
                                step="0.001"
                                defaultValue={selected.timeMs}
                                onBlur={(event) => {
                                    const value = Number(event.target.value);
                                    if (Number.isFinite(value)) {
                                        updateSelected({ timeMs: value });
                                    }
                                }}
                                className={`${inputClass} pr-10`}
                            />
                            <span className="text-micro pointer-events-none absolute top-1/2 right-2 -translate-y-1/2">
                                ms
                            </span>
                        </div>
                    </label>

                    <label className="text-caption col-span-2 flex flex-col gap-1">
                        BPM
                        <input
                            key={`${selected.id}-bpm-${selected.bpm}`}
                            type="number"
                            min="1"
                            max="1000"
                            step="0.001"
                            defaultValue={selected.bpm}
                            onBlur={(event) => {
                                const value = Number(event.target.value);
                                if (
                                    Number.isFinite(value) &&
                                    value >= 1 &&
                                    value <= 1_000
                                ) {
                                    updateSelected({
                                        bpm: roundedBpm(value),
                                    });
                                }
                            }}
                            className={inputClass}
                        />
                    </label>

                    <label className="text-caption flex flex-col gap-1">
                        박자 수
                        <input
                            key={`${selected.id}-numerator-${selected.numerator}`}
                            type="number"
                            min="1"
                            max="64"
                            step="1"
                            defaultValue={selected.numerator}
                            onBlur={(event) => {
                                const value = Number(event.target.value);
                                if (
                                    Number.isInteger(value) &&
                                    value >= 1 &&
                                    value <= 64
                                ) {
                                    updateSelected({ numerator: value });
                                }
                            }}
                            className={inputClass}
                        />
                    </label>

                    <label className="text-caption flex flex-col gap-1">
                        기준 음표
                        <select
                            key={`${selected.id}-denominator-${selected.denominator}`}
                            defaultValue={selected.denominator}
                            onChange={(event) => {
                                const parsed =
                                    timeSignatureDenominatorSchema.safeParse(
                                        Number(event.target.value)
                                    );
                                if (parsed.success) {
                                    updateSelected({
                                        denominator: parsed.data,
                                    });
                                }
                            }}
                            className={inputClass}
                        >
                            {[1, 2, 4, 8, 16, 32].map((value) => (
                                <option key={value} value={value}>
                                    1/{value}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label className="text-caption col-span-2 flex flex-col gap-1">
                        기준 틱
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
                </div>

                <section className="border-divider mt-4 border-t pt-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-xs font-semibold">Tap BPM</h3>
                            <p className="text-micro mt-0.5">
                                박자에 맞춰 반복해서 누르세요.
                            </p>
                        </div>
                        <span className="text-sm font-bold tabular-nums">
                            {tapBpm === null ? "-" : formatBpm(tapBpm)}
                        </span>
                    </div>
                    <button
                        type="button"
                        onClick={registerTap}
                        className="border-border bg-bg hover:bg-surface-muted mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-md border text-sm font-bold"
                    >
                        <Gauge className="size-4" />
                        박자 입력
                    </button>
                </section>

                <button
                    type="button"
                    onClick={deleteSelected}
                    disabled={selectedIndex === 0 || sortedPoints.length <= 1}
                    className="border-danger/40 text-danger mt-4 flex h-9 w-full items-center justify-center gap-1 rounded-md border text-xs font-semibold disabled:cursor-not-allowed disabled:opacity-35"
                >
                    <Trash2 className="size-3.5" />
                    타이밍 포인트 삭제
                </button>
            </div>
        </aside>
    );
}
