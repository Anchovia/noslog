"use client";

import {
    ArrowDown,
    ArrowUp,
    Check,
    ChevronLeft,
    ChevronRight,
    FileArchive,
    LoaderCircle,
    TriangleAlert,
    X,
} from "lucide-react";
import { type KeyboardEvent, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import {
    findChartNoteConflicts,
    hasNewChartNoteConflicts,
} from "@/lib/chart-pattern/editor";
import type { ChartNote, ChartTimingPoint } from "@/lib/chart-pattern/schema";
import {
    sortTimingPoints,
    tickToMilliseconds,
} from "@/lib/chart-pattern/timing";
import {
    alignVid2bmapFirstBarTick,
    applyVid2bmapMerge,
    applyVid2bmapTempoChanges,
    beatLengthLabel,
    chartPositionLabel,
    collectVid2bmapNotes,
    convertVid2bmap,
    defaultVid2bmapChoice,
    defaultVid2bmapFirstBarTick,
    detectVid2bmapTempoChanges,
    diffChartNotes,
    estimateVid2bmapBpm,
    planVid2bmapMerge,
    suggestVid2bmapSnap,
    type Vid2bmapChoice,
    type Vid2bmapMergeItem,
    type Vid2bmapWarning,
} from "@/lib/chart-pattern/vid2bmap";
import {
    readVid2bmapZip,
    type Vid2bmapResult,
} from "@/lib/chart-pattern/vid2bmapFile";

import {
    useChartEditorStore,
    useChartEditorStoreApi,
} from "./chartEditorStore";

/** 패널에 보여 줄 격자(한 박 나누기). 추천 격자가 여기 없으면 끝에 더한다 */
const GRID_OPTIONS = [4, 6, 8, 12];
/** 에디터 스냅은 온음표 나누기라 「한 박 나누기 × 4」(4분의 박자) — 목록에 있을 때만 맞춘다 */
const EDITOR_SNAP_DIVISORS = [1, 2, 3, 4, 6, 8, 12, 16, 24, 32];
/** 목록에서 고른 곳이 판정선 위에 보이도록 조금 앞으로 되감는다 */
const FOCUS_LEAD_MS = 600;

type Include = { standard: boolean; tenuto: boolean; trill: boolean };

interface Loaded {
    result: Vid2bmapResult;
    firstBarTick: number;
    snapDivisor: number;
    /** 초안과 맞춰 첫 박을 자동으로 정했으면 그때 일치한 노트 수 */
    alignedMatches: number | null;
}

function formatFileSize(bytes: number) {
    return bytes >= 1024 * 1024
        ? `${(bytes / 1024 / 1024).toFixed(1)}MB`
        : `${Math.max(1, Math.round(bytes / 1024))}KB`;
}

function laneRange(note: ChartNote) {
    return note.width === 1
        ? `${note.lane}`
        : `${note.lane}~${note.lane + note.width - 1}`;
}

const TYPE_LABEL: Record<ChartNote["type"], string> = {
    standard: "일반",
    tenuto: "테누토",
    glissando: "글리산도",
    trill: "트릴",
};

function beatTicksAt(tick: number, timingPoints: ChartTimingPoint[]) {
    let point = sortTimingPoints(timingPoints)[0];
    for (const candidate of sortTimingPoints(timingPoints)) {
        if (candidate.tick <= tick) point = candidate;
    }
    return (480 * 4) / point.denominator;
}

function describeItem(
    item: Vid2bmapMergeItem,
    timingPoints: ChartTimingPoint[]
) {
    if (item.kind === "changed") {
        const [current] = item.current;
        const [incoming] = item.incoming;
        const beatTicks = beatTicksAt(item.tick, timingPoints);
        return item.fields
            .map((field) => {
                if (field === "lane" || field === "width") {
                    return `칸 ${laneRange(current)} → ${laneRange(incoming)}`;
                }
                if (field === "type") {
                    return `${TYPE_LABEL[current.type]} → ${TYPE_LABEL[incoming.type]}`;
                }
                if (field === "duration") {
                    return `길이 ${beatLengthLabel(current.durationTicks, beatTicks)} → ${beatLengthLabel(incoming.durationTicks, beatTicks)}`;
                }
                if (field === "pair") return "트릴 두 번째 위치";
                return "손";
            })
            .filter((text, index, all) => all.indexOf(text) === index)
            .join(" · ");
    }
    const ranges = (notes: ChartNote[]) => notes.map(laneRange).join(", ");
    if (item.kind === "moved") {
        return `칸 ${ranges(item.current)} → ${ranges(item.incoming)}`;
    }
    if (item.kind === "onlyCurrent")
        return `내 초안에만 · 칸 ${ranges(item.current)}`;
    return `가져온 것에만 · 칸 ${ranges(item.incoming)}`;
}

const CHOICE_LABELS: Record<
    Vid2bmapMergeItem["kind"],
    [current: string, incoming: string]
> = {
    changed: ["내 것", "가져온 것"],
    moved: ["내 것", "가져온 것"],
    onlyCurrent: ["남기기", "빼기"],
    onlyIncoming: ["안 넣기", "넣기"],
};

function warningText(
    warning: Vid2bmapWarning,
    timingPoints: ChartTimingPoint[]
) {
    switch (warning.kind) {
        case "missingBar":
            return `${chartPositionLabel(warning.tick, timingPoints)} 근처 박자선을 놓쳤을 수 있어요 — 뒤 노트가 한 박 밀렸는지 확인`;
        case "extraBar":
            return `${chartPositionLabel(warning.tick, timingPoints)} 근처 박자선을 하나 더 잡았을 수 있어요 — 뒤 노트가 한 박 당겨졌는지 확인`;
        case "bpmMismatch":
            return `${chartPositionLabel(warning.tick, timingPoints)} ~ ${chartPositionLabel(warning.endTick, timingPoints)} 박자선 간격으로 본 BPM ${warning.estimatedBpm} ≠ 타이밍 ${warning.chartBpm} — 곡이 실제로 바뀌는지 타이밍 포인트 확인`;
        case "endCheck":
            return `마지막 박자선(${chartPositionLabel(warning.lastBarTick, timingPoints)}) 뒤 노트는 추출이 지웁니다 — 끝부분 확인`;
        case "denseSnap":
            return `빠른 구간 노트 ${warning.count}개는 한 자리로 뭉치지 않게 더 촘촘한 격자로 맞췄어요(${chartPositionLabel(warning.tick, timingPoints)}부터)`;
        case "shortTenuto":
            return `아주 짧은 테누토 ${warning.count}개를 한 칸 길이로 늘렸어요`;
        case "trillSplit":
            return `트릴 ${warning.count}개는 가운데로 나눠 두 위치를 정했어요 — 확인 필요`;
    }
}

function Section({
    label,
    aside,
    children,
}: {
    label: string;
    aside?: React.ReactNode;
    children: React.ReactNode;
}) {
    return (
        <section className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between gap-2">
                <h3 className="text-micro font-semibold">{label}</h3>
                {aside}
            </div>
            {children}
        </section>
    );
}

/**
 * 영상 추출(vid2bmap — 김영훈 · 최성희, KAIST · MIT) 결과 가져오기 — 오른쪽 검사기 자리 패널(2026-09-23 L1 · F1 · B1 · D3).
 * 설정을 바꾸면 캔버스에 노랑 미리보기가 바로 바뀌고, 「초안에 넣기」 를 눌러야 초안이 바뀐다(넣기 전 버전 저장).
 */
export default function Vid2bmapImportPanel({
    file,
    onClose,
    onReplaceFile,
    onSeek,
    onBeforeApply,
}: {
    file: File;
    onClose: () => void;
    onReplaceFile: () => void;
    onSeek: (timeMs: number) => void;
    /** 넣기 직전 지금 초안을 버전으로 저장. 실패하면 false */
    onBeforeApply: () => Promise<boolean>;
}) {
    const store = useChartEditorStoreApi();
    const document = useChartEditorStore((state) => state.document);
    const setImportPreview = useChartEditorStore(
        (state) => state.setImportPreview
    );
    const [loaded, setLoaded] = useState<Loaded | null>(null);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [include, setInclude] = useState<Include>({
        standard: true,
        tenuto: true,
        trill: true,
    });
    const [selectCenter, setSelectCenter] = useState(true);
    const [includeNewSection, setIncludeNewSection] = useState(true);
    const [choices, setChoices] = useState<Record<string, Vid2bmapChoice>>({});
    const [focusIndex, setFocusIndex] = useState<number | null>(null);
    const [showAllWarnings, setShowAllWarnings] = useState(false);
    /** 넣지 않기로 한 템포 제안(틱) — 기본은 모두 넣는다 */
    const [skippedTempo, setSkippedTempo] = useState<Record<number, boolean>>(
        {}
    );
    const [applying, setApplying] = useState(false);

    const timingPoints = document.timingPoints;

    useEffect(() => {
        let cancelled = false;
        void (async () => {
            try {
                const result = await readVid2bmapZip(await file.arrayBuffer());
                if (cancelled) return;
                const { notes } = collectVid2bmapNotes(result);
                const { document: current } = store.getState();
                const snapDivisor = suggestVid2bmapSnap(
                    result.barRows,
                    notes
                ).divisor;
                const start = defaultVid2bmapFirstBarTick(
                    result.barRows,
                    notes,
                    current.timingPoints
                );
                // 초안에 노트가 있으면 초안과 가장 많이 맞는 첫 박으로(Altale: 2박 어긋난 기본값 → 229개 일치)
                const aligned = alignVid2bmapFirstBarTick(
                    result,
                    notes,
                    {
                        timingPoints: current.timingPoints,
                        snapDivisor,
                        include: { standard: true, tenuto: true, trill: true },
                    },
                    current.notes,
                    start
                );
                setLoaded({
                    result,
                    firstBarTick: aligned?.tick ?? start,
                    snapDivisor,
                    alignedMatches: aligned?.matches ?? null,
                });
                setLoadError(null);
            } catch (error) {
                if (cancelled) return;
                setLoadError(
                    error instanceof Error
                        ? error.message
                        : "결과 파일을 읽을 수 없습니다."
                );
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [file, store]);

    const collected = useMemo(
        () => (loaded ? collectVid2bmapNotes(loaded.result) : null),
        [loaded]
    );
    const suggestion = useMemo(
        () =>
            loaded && collected
                ? suggestVid2bmapSnap(loaded.result.barRows, collected.notes)
                : null,
        [loaded, collected]
    );
    const conversion = useMemo(() => {
        if (!loaded || !collected) return null;
        return convertVid2bmap(loaded.result, collected.notes, {
            timingPoints,
            firstBarTick: loaded.firstBarTick,
            snapDivisor: loaded.snapDivisor,
            include,
        });
    }, [loaded, collected, timingPoints, include]);
    // 템포 변화 → 타이밍 포인트 제안(영상 원본 프레임으로 잰 박 간격, 2026-09-23 T2)
    const tempo = useMemo(
        () =>
            loaded
                ? detectVid2bmapTempoChanges(
                      loaded.result,
                      loaded.firstBarTick,
                      timingPoints
                  )
                : null,
        [loaded, timingPoints]
    );
    const tempoChanges = useMemo(
        () =>
            (tempo?.changes ?? []).filter(
                (change) => !skippedTempo[change.tick]
            ),
        [tempo, skippedTempo]
    );
    const diff = useMemo(
        () =>
            conversion
                ? diffChartNotes(document.notes, conversion.notes)
                : null,
        [conversion, document.notes]
    );
    const plan = useMemo(
        () => (diff ? planVid2bmapMerge(document.notes, diff) : null),
        [diff, document.notes]
    );
    const merged = useMemo(
        () =>
            plan
                ? applyVid2bmapMerge(
                      document.notes,
                      plan,
                      choices,
                      includeNewSection
                  )
                : null,
        [plan, document.notes, choices, includeNewSection]
    );
    const newConflicts = useMemo(() => {
        if (!merged) return 0;
        if (
            !hasNewChartNoteConflicts(
                document.notes,
                merged.notes,
                document.ticksPerQuarter
            )
        ) {
            return 0;
        }
        return Math.max(
            1,
            findChartNoteConflicts(merged.notes, document.ticksPerQuarter)
                .length -
                findChartNoteConflicts(document.notes, document.ticksPerQuarter)
                    .length
        );
    }, [merged, document.notes, document.ticksPerQuarter]);

    const items = plan?.items ?? [];
    const focusItem = focusIndex === null ? null : (items[focusIndex] ?? null);

    // 캔버스 미리보기 — 넣으면 들어갈 노트는 노랑, 빠질 노트는 빨강, 고른 곳은 띠
    useEffect(() => {
        if (!merged || !conversion) {
            setImportPreview(null);
            return;
        }
        const added = new Set(merged.addedIds);
        setImportPreview({
            incoming: conversion.notes.filter((note) => added.has(note.id)),
            removingIds: merged.removedIds,
            focusTick: focusItem?.tick ?? null,
            timingTicks: tempoChanges.map((change) => change.tick),
        });
    }, [merged, conversion, focusItem, tempoChanges, setImportPreview]);
    useEffect(() => () => setImportPreview(null), [setImportPreview]);

    const focusOn = (index: number) => {
        const item = items[index];
        if (!item) return;
        setFocusIndex(index);
        onSeek(
            Math.max(
                0,
                tickToMilliseconds(
                    item.tick,
                    timingPoints,
                    document.ticksPerQuarter
                ) - FOCUS_LEAD_MS
            )
        );
    };
    const moveFocus = (step: number) => {
        if (items.length === 0) return;
        const next =
            focusIndex === null
                ? step > 0
                    ? 0
                    : items.length - 1
                : Math.min(items.length - 1, Math.max(0, focusIndex + step));
        focusOn(next);
    };
    const handleListKey = (event: KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            moveFocus(event.key === "ArrowDown" ? 1 : -1);
        }
    };
    const choose = (item: Vid2bmapMergeItem, choice: Vid2bmapChoice) =>
        setChoices((current) => ({ ...current, [item.key]: choice }));
    const chooseAll = (choice: Vid2bmapChoice) =>
        setChoices(
            Object.fromEntries(
                items
                    .filter(
                        (item) =>
                            item.kind === "changed" || item.kind === "moved"
                    )
                    .map((item) => [item.key, choice])
            )
        );
    const nudge = (step: number) =>
        setLoaded((current) => {
            if (!current) return current;
            const beatTicks = beatTicksAt(
                step > 0 ? current.firstBarTick : current.firstBarTick - 1,
                timingPoints
            );
            return {
                ...current,
                firstBarTick: current.firstBarTick + step * beatTicks,
                alignedMatches: null,
            };
        });

    async function apply() {
        if (!merged || !conversion || newConflicts > 0) return;
        setApplying(true);
        try {
            if (document.notes.length > 0 && !(await onBeforeApply())) return;
            const added = new Set(merged.addedIds);
            const selection = selectCenter
                ? conversion.handUncertainIds.filter((id) => added.has(id))
                : [];
            if (tempoChanges.length > 0) {
                // 노트와 타이밍 포인트를 한 번에 — 실행 취소도 한 번. 노트는 박(틱)이라 위치는 그대로
                const state = store.getState();
                state.replaceDocument({
                    ...state.document,
                    timingPoints: applyVid2bmapTempoChanges(
                        state.document.timingPoints,
                        tempoChanges
                    ),
                    notes: merged.notes,
                });
                store.getState().selectNotes(selection);
            } else {
                store.getState().replaceNotes(merged.notes, selection);
            }
            const origin = sortTimingPoints(timingPoints)[0];
            const editorSnap =
                (loaded?.snapDivisor ?? 4) * (origin.denominator === 4 ? 4 : 8);
            if (EDITOR_SNAP_DIVISORS.includes(editorSnap)) {
                store.getState().setSnapDivisor(editorSnap);
            }
            toast.success(
                `영상 추출 노트를 초안에 넣었습니다 — 새로 ${merged.addedIds.length.toLocaleString("ko-KR")} · 뺌 ${merged.removedIds.length.toLocaleString("ko-KR")}${tempoChanges.length > 0 ? ` · 타이밍 포인트 ${tempoChanges.length}` : ""}${selection.length > 0 ? ` · 손 확인 ${selection.length}개 선택됨` : ""}`
            );
            onClose();
        } finally {
            setApplying(false);
        }
    }

    const counts = collected?.counts;
    const estimatedBpm = loaded
        ? estimateVid2bmapBpm(loaded.result, timingPoints)
        : null;
    const startBpm = sortTimingPoints(timingPoints)[0].bpm;
    const warnings = conversion?.warnings ?? [];
    const visibleWarnings = showAllWarnings ? warnings : warnings.slice(0, 3);
    const hasDraft = document.notes.length > 0;
    const firstNote = conversion?.notes.reduce<ChartNote | null>(
        (first, note) => (!first || note.tick < first.tick ? note : first),
        null
    );
    const grids = suggestion
        ? [
              ...GRID_OPTIONS,
              ...(GRID_OPTIONS.includes(suggestion.divisor)
                  ? []
                  : [suggestion.divisor]),
          ]
        : GRID_OPTIONS;

    return (
        <aside className="border-divider bg-surface flex h-full w-80 shrink-0 flex-col border-l">
            <header className="border-divider flex items-start justify-between border-b px-3 py-2.5">
                <div>
                    <h2 className="text-sm font-bold">영상 추출 가져오기</h2>
                    <p className="text-micro mt-0.5">
                        vid2bmap 결과 → 미리보기 → 초안
                    </p>
                </div>
                <button
                    type="button"
                    onClick={onClose}
                    aria-label="가져오기 닫기"
                    className="hover:bg-surface-muted flex size-8 items-center justify-center rounded-md"
                >
                    <X className="size-4" />
                </button>
            </header>

            <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-3">
                <Section label="파일">
                    <div className="border-border flex items-center gap-2 rounded-md border px-2 py-1.5">
                        <FileArchive
                            className="text-text-secondary size-3.5 shrink-0"
                            aria-hidden
                        />
                        <span className="min-w-0 flex-1 truncate text-xs font-semibold">
                            {file.name}
                        </span>
                        <span className="text-micro shrink-0">
                            {formatFileSize(file.size)}
                        </span>
                        <button
                            type="button"
                            onClick={onReplaceFile}
                            className="border-border hover:bg-surface-muted h-6 shrink-0 rounded border px-2 text-xs font-semibold"
                        >
                            바꾸기
                        </button>
                    </div>
                </Section>

                {loadError ? (
                    <p className="text-danger text-xs leading-relaxed">
                        {loadError}
                    </p>
                ) : !loaded || !counts || !conversion ? (
                    <p className="text-micro flex items-center gap-1.5">
                        <LoaderCircle className="size-3.5 animate-spin" />
                        결과 파일을 읽는 중
                    </p>
                ) : (
                    <>
                        <Section
                            label={`찾은 것${counts.duplicates > 0 ? ` (중복 ${counts.duplicates}개 합침)` : ""}`}
                        >
                            <dl className="bg-divider grid grid-cols-4 gap-px overflow-hidden rounded-md">
                                {(
                                    [
                                        ["일반", counts.standard],
                                        ["테누토", counts.tenuto],
                                        ["트릴", counts.trill],
                                        ["글리산도 조각", counts.glissando],
                                    ] as const
                                ).map(([label, value]) => (
                                    <div
                                        key={label}
                                        className="bg-surface-muted px-1 py-1.5 text-center"
                                    >
                                        <dd className="text-sm font-bold tabular-nums">
                                            {value.toLocaleString("ko-KR")}
                                        </dd>
                                        <dt className="text-micro">{label}</dt>
                                    </div>
                                ))}
                            </dl>
                            {estimatedBpm !== null &&
                            !warnings.some(
                                (warning) => warning.kind === "bpmMismatch"
                            ) ? (
                                <p className="text-text-secondary flex gap-1.5 text-xs leading-relaxed">
                                    <Check
                                        className="text-success mt-0.5 size-3.5 shrink-0"
                                        aria-hidden
                                    />
                                    박자선 {counts.bars.toLocaleString("ko-KR")}
                                    개 · 간격으로 본 BPM {estimatedBpm} ≈ 시작
                                    타이밍 {startBpm}
                                </p>
                            ) : null}
                            {tempo?.startMismatch ? (
                                <p className="text-text-secondary flex gap-1.5 text-xs leading-relaxed">
                                    <TriangleAlert
                                        className="text-score mt-0.5 size-3.5 shrink-0"
                                        aria-hidden
                                    />
                                    영상 박자선으로 잰 첫 구간 BPM{" "}
                                    {tempo.startMismatch.measuredBpm} ≠ 시작
                                    타이밍 {tempo.startMismatch.chartBpm} — 시작
                                    타이밍 포인트 확인
                                </p>
                            ) : null}
                            {(tempo?.changes ?? []).map((change) => {
                                const checked = !skippedTempo[change.tick];
                                const slower = change.bpm < change.fromBpm;
                                return (
                                    <div
                                        key={change.tick}
                                        className="border-score/40 bg-score/10 flex flex-col gap-1 rounded-md border px-2 py-1.5"
                                    >
                                        <button
                                            type="button"
                                            onClick={() =>
                                                onSeek(
                                                    Math.max(
                                                        0,
                                                        tickToMilliseconds(
                                                            change.tick,
                                                            timingPoints,
                                                            document.ticksPerQuarter
                                                        ) - FOCUS_LEAD_MS
                                                    )
                                                )
                                            }
                                            title="캔버스에서 이 위치 보기"
                                            className="flex items-center gap-1.5 text-left text-xs font-bold underline-offset-2 hover:underline"
                                        >
                                            <TriangleAlert
                                                className="text-score size-3.5 shrink-0"
                                                aria-hidden
                                            />
                                            {chartPositionLabel(
                                                change.tick,
                                                timingPoints
                                            )}
                                            부터 {slower ? "느려짐" : "빨라짐"}
                                        </button>
                                        <p className="text-micro">
                                            영상 박자선 {change.beats}박으로 잰
                                            BPM {change.measuredBpm} — 지금
                                            타이밍 {change.fromBpm}
                                        </p>
                                        <label className="flex items-center gap-2 text-xs font-semibold">
                                            <input
                                                type="checkbox"
                                                checked={checked}
                                                onChange={(event) =>
                                                    setSkippedTempo(
                                                        (current) => ({
                                                            ...current,
                                                            [change.tick]:
                                                                !event.target
                                                                    .checked,
                                                        })
                                                    )
                                                }
                                                className="accent-text-primary size-3.5"
                                            />
                                            타이밍 포인트 넣기 · BPM{" "}
                                            {change.bpm}
                                        </label>
                                    </div>
                                );
                            })}
                            {visibleWarnings.map((warning, index) => (
                                <p
                                    key={`${warning.kind}-${index}`}
                                    className="text-text-secondary flex gap-1.5 text-xs leading-relaxed"
                                >
                                    <TriangleAlert
                                        className="text-score mt-0.5 size-3.5 shrink-0"
                                        aria-hidden
                                    />
                                    {warningText(warning, timingPoints)}
                                </p>
                            ))}
                            {warnings.length > 3 ? (
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowAllWarnings((value) => !value)
                                    }
                                    className="text-micro self-start underline underline-offset-2"
                                >
                                    {showAllWarnings
                                        ? "경고 접기"
                                        : `경고 ${warnings.length - 3}개 더 보기`}
                                </button>
                            ) : null}
                        </Section>

                        <Section label="첫 박 맞추기">
                            <div className="flex items-center gap-1.5">
                                <button
                                    type="button"
                                    onClick={() => nudge(-1)}
                                    aria-label="한 박 앞으로"
                                    className="border-border hover:bg-surface-muted flex h-8 shrink-0 items-center gap-0.5 rounded-md border px-2 text-xs font-semibold"
                                >
                                    <ChevronLeft className="size-3.5" />
                                    1박
                                </button>
                                <output className="border-border flex h-8 flex-1 items-center justify-center rounded-md border text-xs font-bold tabular-nums">
                                    첫 박자선 ={" "}
                                    {chartPositionLabel(
                                        loaded.firstBarTick,
                                        timingPoints
                                    )}
                                </output>
                                <button
                                    type="button"
                                    onClick={() => nudge(1)}
                                    aria-label="한 박 뒤로"
                                    className="border-border hover:bg-surface-muted flex h-8 shrink-0 items-center gap-0.5 rounded-md border px-2 text-xs font-semibold"
                                >
                                    1박
                                    <ChevronRight className="size-3.5" />
                                </button>
                            </div>
                            <p className="text-micro leading-relaxed">
                                {firstNote
                                    ? `첫 노트 → ${chartPositionLabel(firstNote.tick, timingPoints)}. `
                                    : ""}
                                {typeof loaded.alignedMatches === "number"
                                    ? `지금 초안과 가장 많이 맞는 곳(${loaded.alignedMatches.toLocaleString("ko-KR")}개 일치)으로 맞췄어요. 틀리면 박 단위로 옮기세요.`
                                    : "캔버스의 노랑 노트가 음원 · 메트로놈과 맞을 때까지 박 단위로 옮기세요."}
                            </p>
                        </Section>

                        <Section label="격자">
                            <div
                                className={`grid gap-1 ${grids.length > 4 ? "grid-cols-5" : "grid-cols-4"}`}
                            >
                                {grids.map((divisor) => {
                                    const drift =
                                        suggestion?.candidates.find(
                                            (candidate) =>
                                                candidate.divisor === divisor
                                        )?.drift ?? 0;
                                    const selected =
                                        loaded.snapDivisor === divisor;
                                    return (
                                        <button
                                            key={divisor}
                                            type="button"
                                            aria-pressed={selected}
                                            onClick={() =>
                                                setLoaded({
                                                    ...loaded,
                                                    snapDivisor: divisor,
                                                })
                                            }
                                            className={`flex h-9 flex-col items-center justify-center rounded-md border text-xs leading-tight font-semibold ${
                                                selected
                                                    ? "border-text-secondary bg-surface-muted"
                                                    : "border-border hover:bg-surface-muted/60"
                                            }`}
                                        >
                                            1/{divisor}박
                                            <span className="text-micro font-normal">
                                                {suggestion?.divisor === divisor
                                                    ? "추천 · "
                                                    : ""}
                                                어긋남 {Math.round(drift * 100)}
                                                %
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </Section>

                        <Section label="가져올 것">
                            <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                                {(
                                    [
                                        ["standard", "일반"],
                                        ["tenuto", "테누토"],
                                        ["trill", "트릴"],
                                    ] as const
                                ).map(([key, label]) => (
                                    <label
                                        key={key}
                                        className="flex h-6 items-center gap-2 text-xs font-semibold"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={include[key]}
                                            onChange={(event) =>
                                                setInclude((current) => ({
                                                    ...current,
                                                    [key]: event.target.checked,
                                                }))
                                            }
                                            className="accent-text-primary size-3.5"
                                        />
                                        {label}
                                        {key === "trill" ? (
                                            <span className="text-micro font-normal">
                                                확인 필요
                                            </span>
                                        ) : null}
                                    </label>
                                ))}
                                <label className="text-text-disabled flex h-6 items-center gap-2 text-xs font-semibold">
                                    <input
                                        type="checkbox"
                                        checked={false}
                                        disabled
                                        className="size-3.5"
                                    />
                                    글리산도
                                    <span className="text-micro font-normal">
                                        조각 · 아직 안 됨
                                    </span>
                                </label>
                            </div>
                            <label className="flex items-start gap-2 text-xs font-semibold">
                                <input
                                    type="checkbox"
                                    checked={selectCenter}
                                    onChange={(event) =>
                                        setSelectCenter(event.target.checked)
                                    }
                                    className="accent-text-primary mt-0.5 size-3.5"
                                />
                                <span>
                                    넣은 뒤 가운데(12~16번 칸) 노트 선택해 두기
                                    <span className="text-micro block font-normal">
                                        손은 칸 위치로 추정 — 가운데는 확인 필요
                                        (
                                        {conversion.handUncertainIds.length.toLocaleString(
                                            "ko-KR"
                                        )}
                                        개)
                                    </span>
                                </span>
                            </label>
                        </Section>

                        {hasDraft && plan && diff ? (
                            <Section
                                label="지금 초안과 비교"
                                aside={
                                    <span className="text-micro">
                                        ↑ ↓ 로 이동
                                    </span>
                                }
                            >
                                <dl className="grid grid-cols-2 gap-1">
                                    {(
                                        [
                                            [
                                                "같음",
                                                diff.same.length,
                                                "bg-text-disabled",
                                            ],
                                            [
                                                "달라짐",
                                                diff.changed.length,
                                                "bg-score",
                                            ],
                                            [
                                                "내 초안에만",
                                                diff.onlyCurrent.length,
                                                "border-danger border border-dashed",
                                            ],
                                            [
                                                "가져온 것에만",
                                                diff.onlyIncoming.length,
                                                "bg-score/60",
                                            ],
                                        ] as const
                                    ).map(([label, value, swatch]) => (
                                        <div
                                            key={label}
                                            className="border-border flex items-center justify-between rounded-md border px-2 py-1"
                                        >
                                            <dt className="flex items-center gap-1.5 text-xs">
                                                <span
                                                    className={`size-2.5 rounded-[2px] ${swatch}`}
                                                    aria-hidden
                                                />
                                                {label}
                                            </dt>
                                            <dd className="text-xs font-bold tabular-nums">
                                                {value.toLocaleString("ko-KR")}
                                            </dd>
                                        </div>
                                    ))}
                                </dl>

                                {items.length > 0 ? (
                                    <>
                                        <div className="flex items-center justify-between">
                                            <span className="text-micro">
                                                달라진 곳 {items.length}
                                                {focusIndex !== null
                                                    ? ` · ${focusIndex + 1} / ${items.length}`
                                                    : ""}
                                            </span>
                                            <span className="flex gap-1">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        moveFocus(-1)
                                                    }
                                                    aria-label="이전 곳"
                                                    className="border-border hover:bg-surface-muted flex size-6 items-center justify-center rounded border"
                                                >
                                                    <ArrowUp className="size-3" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => moveFocus(1)}
                                                    aria-label="다음 곳"
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
                                            aria-label="달라진 곳"
                                            className="focus-visible:outline-focus flex max-h-72 flex-col gap-1 overflow-y-auto rounded-md focus-visible:outline-1"
                                        >
                                            {items.map((item, index) => {
                                                const choice =
                                                    choices[item.key] ??
                                                    defaultVid2bmapChoice(item);
                                                const [
                                                    currentLabel,
                                                    incomingLabel,
                                                ] = CHOICE_LABELS[item.kind];
                                                const focused =
                                                    index === focusIndex;
                                                return (
                                                    <div
                                                        key={item.key}
                                                        role="listitem"
                                                        className={`flex flex-col gap-1 rounded-md border px-2 py-1.5 ${
                                                            focused
                                                                ? "border-text-secondary bg-surface-muted"
                                                                : "border-border"
                                                        }`}
                                                    >
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                focusOn(index)
                                                            }
                                                            className="flex items-baseline justify-between gap-2 text-left"
                                                        >
                                                            <span className="shrink-0 text-xs font-bold tabular-nums">
                                                                {chartPositionLabel(
                                                                    item.tick,
                                                                    timingPoints
                                                                )}
                                                            </span>
                                                            <span className="text-text-secondary min-w-0 text-right text-xs">
                                                                {describeItem(
                                                                    item,
                                                                    timingPoints
                                                                )}
                                                            </span>
                                                        </button>
                                                        <div
                                                            role="radiogroup"
                                                            aria-label="고르기"
                                                            className="grid grid-cols-2 gap-1"
                                                        >
                                                            {(
                                                                [
                                                                    [
                                                                        "current",
                                                                        currentLabel,
                                                                    ],
                                                                    [
                                                                        "incoming",
                                                                        incomingLabel,
                                                                    ],
                                                                ] as const
                                                            ).map(
                                                                ([
                                                                    value,
                                                                    label,
                                                                ]) => (
                                                                    <button
                                                                        key={
                                                                            value
                                                                        }
                                                                        type="button"
                                                                        role="radio"
                                                                        aria-checked={
                                                                            choice ===
                                                                            value
                                                                        }
                                                                        onClick={() => {
                                                                            choose(
                                                                                item,
                                                                                value
                                                                            );
                                                                            setFocusIndex(
                                                                                index
                                                                            );
                                                                        }}
                                                                        className={`h-6 rounded border text-xs font-semibold ${
                                                                            choice ===
                                                                            value
                                                                                ? "border-text-primary bg-text-primary text-bg"
                                                                                : "border-border hover:bg-surface-muted"
                                                                        }`}
                                                                    >
                                                                        {label}
                                                                    </button>
                                                                )
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        <div className="grid grid-cols-2 gap-1">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    chooseAll("current")
                                                }
                                                className="border-border hover:bg-surface-muted h-8 rounded-md border text-xs font-semibold"
                                            >
                                                달라진 곳 모두 내 것
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    chooseAll("incoming")
                                                }
                                                className="border-border hover:bg-surface-muted h-8 rounded-md border text-xs font-semibold"
                                            >
                                                모두 가져온 것
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <p className="text-micro">
                                        초안과 겹치는 구간에서 달라진 곳이
                                        없습니다.
                                    </p>
                                )}

                                {plan.newSection.length > 0 ? (
                                    <label className="flex items-start gap-2 text-xs font-semibold">
                                        <input
                                            type="checkbox"
                                            checked={includeNewSection}
                                            onChange={(event) =>
                                                setIncludeNewSection(
                                                    event.target.checked
                                                )
                                            }
                                            className="accent-text-primary mt-0.5 size-3.5"
                                        />
                                        <span>
                                            초안 뒤 새 구간{" "}
                                            {plan.newSection.length.toLocaleString(
                                                "ko-KR"
                                            )}
                                            개 넣기
                                            <span className="text-micro block font-normal">
                                                {chartPositionLabel(
                                                    plan.newSection[0].tick,
                                                    timingPoints
                                                )}
                                                부터
                                            </span>
                                        </span>
                                    </label>
                                ) : null}
                            </Section>
                        ) : null}
                    </>
                )}
            </div>

            <footer className="border-divider flex flex-col gap-2 border-t px-3 py-2.5">
                {newConflicts > 0 ? (
                    <p className="text-danger text-xs leading-relaxed">
                        이대로 넣으면 노트가 겹칩니다(
                        {newConflicts.toLocaleString("ko-KR")}건). 목록에서 「내
                        것 / 가져온 것」 을 바꿔 주세요.
                    </p>
                ) : null}
                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="border-border hover:bg-surface-muted flex h-9 flex-1 items-center justify-center rounded-md border text-xs font-bold"
                    >
                        취소
                    </button>
                    <button
                        type="button"
                        disabled={!merged || applying || newConflicts > 0}
                        onClick={() => void apply()}
                        className="bg-text-primary text-bg flex h-9 flex-[1.4] items-center justify-center gap-1.5 rounded-md text-xs font-bold disabled:cursor-not-allowed disabled:opacity-35"
                    >
                        {applying ? (
                            <LoaderCircle className="size-3.5 animate-spin" />
                        ) : null}
                        초안에 넣기
                        {merged &&
                        (merged.addedIds.length > 0 ||
                            tempoChanges.length === 0)
                            ? ` · ${merged.addedIds.length.toLocaleString("ko-KR")}개`
                            : ""}
                        {tempoChanges.length > 0
                            ? `${merged && merged.addedIds.length > 0 ? " +" : " ·"} 타이밍 ${tempoChanges.length}`
                            : ""}
                    </button>
                </div>
                <p className="text-micro">
                    {merged && hasDraft
                        ? `새로 ${merged.addedIds.length.toLocaleString("ko-KR")} · 뺌 ${merged.removedIds.length.toLocaleString("ko-KR")}${tempoChanges.length > 0 ? ` · 타이밍 포인트 ${tempoChanges.length}` : ""} — 넣기 전 지금 초안을 버전으로 저장합니다.`
                        : "초안에만 들어갑니다. 공개는 따로 합니다."}
                </p>
                <p className="text-micro">
                    추출: vid2bmap — 김영훈 · 최성희(KAIST), MIT
                </p>
            </footer>
        </aside>
    );
}
