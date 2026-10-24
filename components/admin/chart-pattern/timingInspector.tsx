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

import { useTranslations } from "@/components/i18n/locale-provider";

import { useChartEditorStore } from "./chartEditorStore";
import Button, { foundationButtonClass } from "@/components/ui/button";
import { cn } from "@/lib/cn";

const inputClass = "nl-input";

function roundedBpm(value: number) {
    return Math.round(value * 1_000) / 1_000;
}

export default function TimingInspector() {
    const t = useTranslations();
    // 검토 모드(2026-09-24 C1)는 읽기 전용 — 고르기만 되고 입력은 잠근다
    const readOnly = useChartEditorStore((state) => state.readOnly);
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
    const [customSignaturePointId, setCustomSignaturePointId] = useState<
        string | null
    >(null);
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
    const detectedSignaturePreset =
        selected.numerator === 3 && selected.denominator === 4
            ? "3/4"
            : selected.numerator === 4 && selected.denominator === 4
              ? "4/4"
              : "other";
    const signaturePreset =
        customSignaturePointId === selected.id
            ? "other"
            : detectedSignaturePreset;

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
            toast.error(t("editor.timing.exists"));
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

    function useCurrentTime() {
        updateSelected({
            timeMs: Math.round(currentTimeMs * 1_000) / 1_000,
        });
    }

    function applySignaturePreset(numerator: 3 | 4) {
        setCustomSignaturePointId((current) =>
            current === selected.id ? null : current
        );
        updateSelected({ numerator, denominator: 4 });
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
        <aside className="nl-editor-panel flex h-full shrink-0 flex-col border-l-nl-stroke border-nl-divider bg-nl-surface">
            <header className="flex items-center justify-between border-b-nl-stroke border-nl-divider px-nl-12 py-nl-12">
                <div>
                    <h2 className="nl-emphasis-label">
                        {t("editor.timing.title")}
                    </h2>
                    <p className="nl-metadata mt-nl-4 text-nl-subdued">
                        {t("editor.timing.subtitle")}
                    </p>
                </div>
                <button
                    type="button"
                    onClick={addTimingPoint}
                    disabled={readOnly}
                    className={foundationButtonClass({
                        variant: "secondary",
                        size: "sm",
                    })}
                >
                    <Plus className="nl-icon-small" />
                    {t("editor.add")}
                </button>
            </header>

            <div className="nl-editor-point-list overflow-y-auto border-b-nl-stroke border-nl-divider p-nl-8">
                <div className="flex flex-col gap-nl-4">
                    {sortedPoints.map((point, index) => (
                        <button
                            key={point.id}
                            type="button"
                            onClick={() => selectTimingPoint(point.id)}
                            className={`rounded-nl-field px-nl-12 py-nl-8 text-left transition-colors duration-nl-state ${
                                point.id === selected.id
                                    ? "bg-nl-surface text-nl-content"
                                    : "nl-hover-layer text-nl-subdued"
                            }`}
                        >
                            <span className="nl-metadata flex items-center justify-between gap-nl-8">
                                <strong className="nl-metadata">
                                    {index === 0
                                        ? t("editor.timing.first")
                                        : t("editor.timing.nth", {
                                              index: index + 1,
                                          })}
                                </strong>
                                <span>{formatEditorTime(point.timeMs)}</span>
                            </span>
                            <span className="nl-metadata mt-nl-4 block text-nl-subdued">
                                {formatBpm(point.bpm)} BPM · {point.numerator}/
                                {point.denominator}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            <fieldset
                disabled={readOnly}
                className="m-0 min-h-0 min-w-0 flex-1 overflow-y-auto border-0 p-nl-12"
            >
                <div className="grid grid-cols-2 gap-nl-12">
                    <label className="nl-metadata col-span-2 flex flex-col gap-nl-4 text-nl-subdued">
                        {selectedIndex === 0
                            ? t("editor.timing.offset")
                            : t("editor.timing.audioTime")}
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
                                className={`${inputClass} pr-nl-48`}
                            />
                            <span className="nl-metadata pointer-events-none absolute top-1/2 right-nl-8 -translate-y-1/2 text-nl-subdued">
                                ms
                            </span>
                        </div>
                        <button
                            type="button"
                            onClick={useCurrentTime}
                            className={cn(
                                foundationButtonClass({
                                    variant: "secondary",
                                    size: "sm",
                                }),
                                "mt-nl-4"
                            )}
                        >
                            {t("editor.timing.useCurrent")}
                        </button>
                    </label>

                    <label className="nl-metadata col-span-2 flex flex-col gap-nl-4 text-nl-subdued">
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

                    <fieldset className="col-span-2">
                        <legend className="nl-metadata mb-nl-8 text-nl-subdued">
                            {t("editor.timing.signature")}
                        </legend>
                        <div className="flex flex-col gap-nl-8">
                            <label
                                className={`nl-radio-group__option nl-hover-layer rounded-nl-field border-nl-stroke border-nl-divider px-nl-12 ${
                                    signaturePreset === "3/4"
                                        ? "bg-nl-surface text-nl-content"
                                        : "text-nl-subdued"
                                }`}
                            >
                                <input
                                    type="radio"
                                    name={`time-signature-${selected.id}`}
                                    value="3/4"
                                    checked={signaturePreset === "3/4"}
                                    onChange={() => applySignaturePreset(3)}
                                />
                                <strong className="nl-metadata">3/4</strong>
                                <span className="nl-metadata text-nl-subdued">
                                    {t("editor.timing.waltz")}
                                </span>
                            </label>

                            <label
                                className={`nl-radio-group__option nl-hover-layer rounded-nl-field border-nl-stroke border-nl-divider px-nl-12 ${
                                    signaturePreset === "4/4"
                                        ? "bg-nl-surface text-nl-content"
                                        : "text-nl-subdued"
                                }`}
                            >
                                <input
                                    type="radio"
                                    name={`time-signature-${selected.id}`}
                                    value="4/4"
                                    checked={signaturePreset === "4/4"}
                                    onChange={() => applySignaturePreset(4)}
                                />
                                <strong className="nl-metadata">4/4</strong>
                                <span className="nl-metadata text-nl-subdued">
                                    {t("editor.timing.common")}
                                </span>
                            </label>

                            <div
                                className={`rounded-nl-field border-nl-stroke border-nl-divider p-nl-12 ${
                                    signaturePreset === "other"
                                        ? "bg-nl-surface"
                                        : ""
                                }`}
                            >
                                <label className="nl-radio-group__option mb-nl-8">
                                    <input
                                        type="radio"
                                        name={`time-signature-${selected.id}`}
                                        value="other"
                                        checked={signaturePreset === "other"}
                                        onChange={() =>
                                            setCustomSignaturePointId(
                                                selected.id
                                            )
                                        }
                                    />
                                    <strong className="nl-metadata">
                                        {t("editor.timing.other")}
                                    </strong>
                                </label>

                                <div className="nl-admin-ratio-row items-center gap-nl-8">
                                    <label className="nl-metadata flex flex-col gap-nl-4 text-nl-subdued">
                                        {t("editor.timing.numerator")}
                                        <input
                                            key={`${selected.id}-numerator-${selected.numerator}`}
                                            type="number"
                                            min="1"
                                            max="64"
                                            step="1"
                                            defaultValue={selected.numerator}
                                            onFocus={() =>
                                                setCustomSignaturePointId(
                                                    selected.id
                                                )
                                            }
                                            onBlur={(event) => {
                                                const value = Number(
                                                    event.target.value
                                                );
                                                if (
                                                    Number.isInteger(value) &&
                                                    value >= 1 &&
                                                    value <= 64
                                                ) {
                                                    updateSelected({
                                                        numerator: value,
                                                    });
                                                }
                                            }}
                                            className={inputClass}
                                        />
                                    </label>
                                    <span className="nl-emphasis-label mt-nl-24">
                                        /
                                    </span>
                                    <label className="nl-metadata flex flex-col gap-nl-4 text-nl-subdued">
                                        {t("editor.timing.denominator")}
                                        <select
                                            key={`${selected.id}-denominator-${selected.denominator}`}
                                            defaultValue={selected.denominator}
                                            onFocus={() =>
                                                setCustomSignaturePointId(
                                                    selected.id
                                                )
                                            }
                                            onChange={(event) => {
                                                const parsed =
                                                    timeSignatureDenominatorSchema.safeParse(
                                                        Number(
                                                            event.target.value
                                                        )
                                                    );
                                                if (parsed.success) {
                                                    updateSelected({
                                                        denominator:
                                                            parsed.data,
                                                    });
                                                }
                                            }}
                                            className={inputClass}
                                        >
                                            {[1, 2, 4, 8, 16, 32].map(
                                                (value) => (
                                                    <option
                                                        key={value}
                                                        value={value}
                                                    >
                                                        {value}
                                                    </option>
                                                )
                                            )}
                                        </select>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </fieldset>

                    <label className="nl-metadata col-span-2 flex flex-col gap-nl-4 text-nl-subdued">
                        {t("editor.timing.tick")}
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

                <section className="mt-nl-16 border-t-nl-stroke border-nl-divider pt-nl-16">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="nl-metadata">Tap BPM</h3>
                            <p className="nl-metadata mt-nl-4 text-nl-subdued">
                                {t("editor.timing.tapHelp")}
                            </p>
                        </div>
                        <span className="nl-emphasis-label">
                            {tapBpm === null ? "-" : formatBpm(tapBpm)}
                        </span>
                    </div>
                    <button
                        type="button"
                        onClick={registerTap}
                        className={cn(
                            foundationButtonClass({ variant: "secondary" }),
                            "mt-nl-8 w-full"
                        )}
                    >
                        <Gauge className="nl-icon-small" />
                        {t("editor.timing.tap")}
                    </button>
                </section>

                <Button
                    variant="danger"
                    size="sm"
                    className="mt-nl-16 w-full"
                    onClick={deleteSelected}
                    disabled={selectedIndex === 0 || sortedPoints.length <= 1}
                >
                    <Trash2 className="nl-icon-small" aria-hidden />
                    {t("editor.timing.delete")}
                </Button>
            </fieldset>
        </aside>
    );
}
