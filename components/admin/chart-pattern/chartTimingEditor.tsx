"use client";

import {
    ArrowLeft,
    Clock3,
    Download,
    Eye,
    FileAudio,
    History,
    LoaderCircle,
    Maximize2,
    MousePointer2,
    Pause,
    Play,
    Redo2,
    RotateCcw,
    Save,
    Undo2,
    Upload,
    Volume2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    type ChangeEvent,
    type ReactNode,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
    useSyncExternalStore,
} from "react";
import { toast } from "sonner";

import {
    createChartPatternRevision,
    publishChartPattern,
    restoreChartPatternRevision,
    saveChartPatternDraft,
} from "@/app/admin/music/[index]/[difficulty]/pattern/actions";
import {
    getBrowserSupportSnapshot,
    getServerBrowserSupportSnapshot,
    subscribeBrowserSupport,
} from "@/lib/browserSupport";
import { findChartNoteConflicts } from "@/lib/chart-pattern/editor";
import {
    chartDocumentSchema,
    chartExportSchema,
    type ChartHand,
    type ChartDocument,
    type ChartExport,
    type ChartNoteType,
} from "@/lib/chart-pattern/schema";
import {
    formatEditorTime,
    formatRevisionDateTime,
} from "@/lib/chart-pattern/timing";
import { useMetronomeVolume } from "@/components/chart-pattern/useMetronomeVolume";

import {
    type ChartPlaybackRate,
    ChartEditorStoreProvider,
    useChartEditorStore,
    useChartEditorStoreApi,
} from "./chartEditorStore";
import NoteInspector from "./noteInspector";
import PixiNoteEditor, { type NoteEditorTool } from "./pixiNoteEditor";
import TimingInspector from "./timingInspector";
import TimingRuler from "./timingRuler";
import { useChartAudio } from "./useChartAudio";
import WaveformTimeline from "./waveformTimeline";

export interface ChartEditorRevision {
    id: number;
    number: number;
    kind: string;
    message: string | null;
    createdAt: string;
    createdBy: string | null;
}

export interface ChartEditorMetadata {
    chartId: number;
    musicIndex: string;
    title: string;
    artist: string | null;
    difficulty: string;
    level: number;
}

interface ChartTimingEditorProps {
    metadata: ChartEditorMetadata;
    initialDocument: ChartDocument;
    draftVersion: number;
    savedRevision: number;
    publishedRevision: number | null;
    updatedAt: string | null;
    revisions: ChartEditorRevision[];
}

const playbackRates: ChartPlaybackRate[] = [0.25, 0.5, 0.75, 1, 1.5, 2];
const snapDivisors = [1, 2, 3, 4, 6, 8, 12, 16, 24, 32];
const PIANO_VISIBILITY_STORAGE_KEY = "noslog-chart-editor-piano-visible";
const PIANO_VISIBILITY_CHANGE_EVENT =
    "noslog-chart-editor-piano-visibility-change";
const noteTypeLabels: Record<ChartNoteType, string> = {
    standard: "일반",
    tenuto: "테누토",
    glissando: "글리산도",
    trill: "트릴",
};
const noteToolShortcuts: Record<ChartNoteType, number> = {
    standard: 2,
    tenuto: 3,
    glissando: 4,
    trill: 5,
};

function subscribePianoVisibility(onStoreChange: () => void) {
    window.addEventListener("storage", onStoreChange);
    window.addEventListener(PIANO_VISIBILITY_CHANGE_EVENT, onStoreChange);
    return () => {
        window.removeEventListener("storage", onStoreChange);
        window.removeEventListener(
            PIANO_VISIBILITY_CHANGE_EVENT,
            onStoreChange
        );
    };
}

function getPianoVisibilitySnapshot() {
    return (
        window.localStorage.getItem(PIANO_VISIBILITY_STORAGE_KEY) !== "false"
    );
}

function getServerPianoVisibilitySnapshot() {
    return true;
}

function safeFileName(value: string) {
    return value
        .normalize("NFKC")
        .replace(/[<>:"/\\|?*\u0000-\u001f]/g, "_")
        .replace(/\s+/g, "_")
        .slice(0, 80);
}

function formatSavedTime(value: Date) {
    return new Date(value.getTime() + 9 * 60 * 60 * 1_000)
        .toISOString()
        .slice(11, 16);
}

function EditorButton({
    children,
    label,
    disabled = false,
    onClick,
}: {
    children: ReactNode;
    label: string;
    disabled?: boolean;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            aria-label={label}
            title={label}
            disabled={disabled}
            onClick={onClick}
            className="border-border hover:bg-surface-muted flex size-9 shrink-0 items-center justify-center rounded-md border disabled:cursor-not-allowed disabled:opacity-35"
        >
            {children}
        </button>
    );
}

function ChartTimingEditorWorkspace({
    metadata,
    revisions,
}: Pick<ChartTimingEditorProps, "metadata" | "revisions">) {
    const router = useRouter();
    const store = useChartEditorStoreApi();
    const chartDocument = useChartEditorStore((state) => state.document);
    const savedRevision = useChartEditorStore((state) => state.savedRevision);
    const publishedRevision = useChartEditorStore(
        (state) => state.publishedRevision
    );
    const currentTimeMs = useChartEditorStore((state) => state.currentTimeMs);
    const playbackRate = useChartEditorStore((state) => state.playbackRate);
    const snapDivisor = useChartEditorStore((state) => state.snapDivisor);
    const metronomeEnabled = useChartEditorStore(
        (state) => state.metronomeEnabled
    );
    const changeSerial = useChartEditorStore((state) => state.changeSerial);
    const persistedSerial = useChartEditorStore(
        (state) => state.persistedSerial
    );
    const saveStatus = useChartEditorStore((state) => state.saveStatus);
    const saveMessage = useChartEditorStore((state) => state.saveMessage);
    const noteConflicts = useMemo(
        () =>
            findChartNoteConflicts(
                chartDocument.notes,
                chartDocument.ticksPerQuarter
            ),
        [chartDocument.notes, chartDocument.ticksPerQuarter]
    );
    const hasNoteConflicts = noteConflicts.length > 0;
    const lastSavedAt = useChartEditorStore((state) => state.lastSavedAt);
    const undoStackLength = useChartEditorStore(
        (state) => state.undoStack.length
    );
    const redoStackLength = useChartEditorStore(
        (state) => state.redoStack.length
    );
    const undo = useChartEditorStore((state) => state.undo);
    const redo = useChartEditorStore((state) => state.redo);
    const setPlaybackRate = useChartEditorStore(
        (state) => state.setPlaybackRate
    );
    const setSnapDivisor = useChartEditorStore((state) => state.setSnapDivisor);
    const setMetronomeEnabled = useChartEditorStore(
        (state) => state.setMetronomeEnabled
    );
    const [metronomeVolume, setMetronomeVolume] = useMetronomeVolume();
    const audioInputRef = useRef<HTMLInputElement | null>(null);
    const importInputRef = useRef<HTMLInputElement | null>(null);
    const [pixelsPerSecond, setPixelsPerSecond] = useState(150);
    const [revisionHistory, setRevisionHistory] = useState(revisions);
    const [editorMode, setEditorMode] = useState<"timing" | "notes">("timing");
    const [noteTool, setNoteTool] = useState<NoteEditorTool>("select");
    const [noteHand, setNoteHand] = useState<ChartHand>("left");
    const [noteWidth, setNoteWidth] = useState(2);
    const pianoVisible = useSyncExternalStore(
        subscribePianoVisibility,
        getPianoVisibilitySnapshot,
        getServerPianoVisibilitySnapshot
    );
    const {
        fileName,
        waveformPeaks,
        isDecoding,
        isPlaying,
        error: audioError,
        loadFile,
        togglePlayback,
        seek,
    } = useChartAudio(metronomeVolume);

    const hasUnsavedChanges = changeSerial > persistedSerial;

    const updatePianoVisibility = useCallback((visible: boolean) => {
        window.localStorage.setItem(
            PIANO_VISIBILITY_STORAGE_KEY,
            String(visible)
        );
        window.dispatchEvent(new Event(PIANO_VISIBILITY_CHANGE_EVENT));
    }, []);

    const validateCurrentDocument = useCallback(() => {
        const parsed = chartDocumentSchema.safeParse(store.getState().document);
        if (!parsed.success) {
            const first = parsed.error.issues[0];
            store
                .getState()
                .markSaveError(
                    first?.message ?? "채보 데이터 형식을 확인해주세요."
                );
            return null;
        }
        return parsed.data;
    }, [store]);

    const runAutoSave = useCallback(async () => {
        const state = store.getState();
        if (
            state.saveStatus === "saving" ||
            state.changeSerial <= state.persistedSerial
        ) {
            return;
        }
        const validDocument = validateCurrentDocument();
        if (!validDocument) return;

        const serial = state.changeSerial;
        const version = state.draftVersion;
        state.markSaving();
        try {
            const result = await saveChartPatternDraft({
                chartId: metadata.chartId,
                baseVersion: version,
                document: validDocument,
            });
            if (!result.success || result.draftVersion === undefined) {
                store.getState().markSaveError(result.message);
                if (result.conflict) toast.error(result.message);
                return;
            }
            store.getState().markSaveSuccess({
                draftVersion: result.draftVersion,
                savedRevision: result.savedRevision,
                publishedRevision: result.publishedRevision,
                persistedSerial: serial,
                message: result.message,
            });
        } catch {
            store.getState().markSaveError("자동 저장 중 오류가 발생했습니다.");
        }
    }, [metadata.chartId, store, validateCurrentDocument]);

    const runExplicitSave = useCallback(
        async (kind: "manual" | "publish") => {
            const state = store.getState();
            if (state.saveStatus === "saving") {
                toast.error("현재 저장이 끝난 뒤 다시 시도해주세요.");
                return;
            }
            const conflicts = findChartNoteConflicts(
                state.document.notes,
                state.document.ticksPerQuarter
            );
            if (conflicts.length > 0) {
                toast.error(
                    `겹치는 노트 ${conflicts.length.toLocaleString("ko-KR")}건을 먼저 수정해주세요.`
                );
                return;
            }
            const validDocument = validateCurrentDocument();
            if (!validDocument) {
                toast.error(
                    store.getState().saveMessage ??
                        "채보 데이터를 확인해주세요."
                );
                return;
            }

            const serial = state.changeSerial;
            state.markSaving();
            try {
                const action =
                    kind === "publish"
                        ? publishChartPattern
                        : createChartPatternRevision;
                const result = await action({
                    chartId: metadata.chartId,
                    baseVersion: state.draftVersion,
                    document: validDocument,
                });
                if (!result.success || result.draftVersion === undefined) {
                    store.getState().markSaveError(result.message);
                    toast.error(result.message);
                    return;
                }
                store.getState().markSaveSuccess({
                    draftVersion: result.draftVersion,
                    savedRevision: result.savedRevision,
                    publishedRevision: result.publishedRevision,
                    persistedSerial: serial,
                    message: result.message,
                });
                if (result.revision) {
                    setRevisionHistory((current) =>
                        [
                            result.revision!,
                            ...current.filter(
                                (revision) =>
                                    revision.id !== result.revision!.id
                            ),
                        ].slice(0, 20)
                    );
                }
                toast.success(result.message);
                router.refresh();
            } catch {
                const message =
                    kind === "publish"
                        ? "채보 공개 중 오류가 발생했습니다."
                        : "버전 저장 중 오류가 발생했습니다.";
                store.getState().markSaveError(message);
                toast.error(message);
            }
        },
        [metadata.chartId, router, store, validateCurrentDocument]
    );

    useEffect(() => {
        if (!hasUnsavedChanges || saveStatus === "saving") return;
        const timer = window.setTimeout(() => {
            void runAutoSave();
        }, 1_500);
        return () => window.clearTimeout(timer);
    }, [changeSerial, hasUnsavedChanges, runAutoSave, saveStatus]);

    useEffect(() => {
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, []);

    useEffect(() => {
        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            if (
                store.getState().changeSerial <=
                store.getState().persistedSerial
            )
                return;
            event.preventDefault();
        };
        window.addEventListener("beforeunload", handleBeforeUnload);
        return () =>
            window.removeEventListener("beforeunload", handleBeforeUnload);
    }, [store]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            const target = event.target;
            const editingText =
                target instanceof HTMLInputElement ||
                target instanceof HTMLTextAreaElement ||
                target instanceof HTMLSelectElement;

            if (
                (event.ctrlKey || event.metaKey) &&
                event.key.toLowerCase() === "s"
            ) {
                event.preventDefault();
                void runExplicitSave("manual");
                return;
            }
            if (
                (event.ctrlKey || event.metaKey) &&
                event.key.toLowerCase() === "z"
            ) {
                event.preventDefault();
                if (event.shiftKey) redo();
                else undo();
                return;
            }
            if (
                (event.ctrlKey || event.metaKey) &&
                event.key.toLowerCase() === "y"
            ) {
                event.preventDefault();
                redo();
                return;
            }
            if (!editingText && event.code === "Space") {
                event.preventDefault();
                void togglePlayback();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [redo, runExplicitSave, togglePlayback, undo]);

    async function handleAudioFile(event: ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
        event.target.value = "";
        if (!file) return;
        await loadFile(file);
    }

    async function handleImportFile(event: ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
        event.target.value = "";
        if (!file) return;
        try {
            const raw = JSON.parse(await file.text()) as unknown;
            const parsed = chartExportSchema.safeParse(raw);
            if (!parsed.success) {
                toast.error(
                    parsed.error.issues[0]?.message ??
                        "지원하지 않는 채보 파일입니다."
                );
                return;
            }
            if (
                parsed.data.music.index !== metadata.musicIndex ||
                parsed.data.music.difficulty.toLowerCase() !==
                    metadata.difficulty.toLowerCase()
            ) {
                const confirmed = window.confirm(
                    "다른 악곡 또는 난이도에서 내보낸 채보입니다. 현재 채보를 교체할까요?"
                );
                if (!confirmed) return;
            }
            store.getState().replaceDocument(parsed.data.chart);
            toast.success("채보 파일을 현재 초안으로 불러왔습니다.");
        } catch {
            toast.error("채보 파일을 읽을 수 없습니다.");
        }
    }

    function exportChart() {
        const validDocument = validateCurrentDocument();
        if (!validDocument) {
            toast.error(
                store.getState().saveMessage ?? "채보 데이터를 확인해주세요."
            );
            return;
        }
        const payload: ChartExport = {
            format: "noslog-chart",
            exportVersion: 1,
            exportedAt: new Date().toISOString(),
            music: {
                index: metadata.musicIndex,
                title: metadata.title,
                artist: metadata.artist,
                difficulty: metadata.difficulty,
                level: metadata.level,
            },
            chart: validDocument,
        };
        const blob = new Blob([JSON.stringify(payload, null, 2)], {
            type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = `${safeFileName(metadata.title)}-${metadata.difficulty.toLowerCase()}.noslog-chart.json`;
        anchor.click();
        URL.revokeObjectURL(url);
        toast.success("채보 파일을 내보냈습니다.");
    }

    async function restoreRevision(revision: ChartEditorRevision) {
        const confirmed = window.confirm(
            `버전 ${revision.number}을 현재 초안으로 복원할까요?`
        );
        if (!confirmed) return;

        const state = store.getState();
        state.markSaving();
        try {
            const result = await restoreChartPatternRevision({
                chartId: metadata.chartId,
                revisionId: revision.id,
                baseVersion: state.draftVersion,
            });
            if (
                !result.success ||
                result.draftVersion === undefined ||
                !result.document
            ) {
                state.markSaveError(result.message);
                toast.error(result.message);
                return;
            }
            state.replaceDocument(result.document);
            const nextSerial = store.getState().changeSerial;
            store.getState().markSaveSuccess({
                draftVersion: result.draftVersion,
                persistedSerial: nextSerial,
                message: result.message,
            });
            toast.success(result.message);
        } catch {
            state.markSaveError("저장 버전을 복원하지 못했습니다.");
            toast.error("저장 버전을 복원하지 못했습니다.");
        }
    }

    return (
        <>
            <div className="bg-bg fixed inset-0 z-[100] hidden min-h-0 flex-col min-[1024px]:flex">
                <header className="border-divider bg-surface flex h-14 shrink-0 items-center gap-3 border-b px-3">
                    <Link
                        href={`/admin/music/${encodeURIComponent(metadata.musicIndex)}`}
                        aria-label="악곡 관리로 돌아가기"
                        className="border-border hover:bg-surface-muted flex size-9 shrink-0 items-center justify-center rounded-md border"
                    >
                        <ArrowLeft className="size-4" />
                    </Link>
                    <div className="min-w-0">
                        <div className="flex items-center gap-2">
                            <h1 className="max-w-80 truncate text-sm font-bold">
                                {metadata.title}
                            </h1>
                            <span className="bg-surface-muted text-caption rounded px-1.5 py-0.5 font-semibold">
                                {metadata.difficulty} · Lv {metadata.level}
                            </span>
                        </div>
                        <p className="text-micro mt-0.5 truncate">
                            채보 편집기 ·{" "}
                            {editorMode === "timing" ? "타이밍" : "채보 작성"}
                        </p>
                    </div>

                    <div className="ml-auto flex min-w-0 items-center gap-2">
                        <div
                            className={`mr-1 min-w-36 text-right text-xs ${
                                saveStatus === "error" || hasNoteConflicts
                                    ? "text-danger"
                                    : "text-text-secondary"
                            }`}
                        >
                            <span className="block truncate">
                                {hasNoteConflicts
                                    ? `노트 충돌 ${noteConflicts.length.toLocaleString("ko-KR")}건`
                                    : saveStatus === "saving"
                                      ? "저장 중..."
                                      : hasUnsavedChanges
                                        ? "저장되지 않은 변경"
                                        : (saveMessage ??
                                          (lastSavedAt
                                              ? `${formatSavedTime(lastSavedAt)} 저장`
                                              : "새 채보"))}
                            </span>
                            <span className="text-micro block">
                                저장 v{savedRevision}
                                {publishedRevision
                                    ? ` · 공개 v${publishedRevision}`
                                    : " · 비공개"}
                            </span>
                        </div>
                        <EditorButton
                            label="실행 취소"
                            disabled={undoStackLength === 0}
                            onClick={undo}
                        >
                            <Undo2 className="size-4" />
                        </EditorButton>
                        <EditorButton
                            label="다시 실행"
                            disabled={redoStackLength === 0}
                            onClick={redo}
                        >
                            <Redo2 className="size-4" />
                        </EditorButton>
                        <EditorButton
                            label="채보 가져오기"
                            onClick={() => importInputRef.current?.click()}
                        >
                            <Upload className="size-4" />
                        </EditorButton>
                        <EditorButton
                            label="채보 내보내기"
                            onClick={exportChart}
                        >
                            <Download className="size-4" />
                        </EditorButton>
                        <Link
                            href={`/admin/music/${encodeURIComponent(metadata.musicIndex)}/${metadata.difficulty.toLowerCase()}/pattern/preview`}
                            target="_blank"
                            aria-label="전체 채보 미리보기"
                            title="전체 채보 미리보기"
                            className="border-border hover:bg-surface-muted flex size-9 shrink-0 items-center justify-center rounded-md border"
                        >
                            <Eye className="size-4" />
                        </Link>
                        <button
                            type="button"
                            disabled={
                                saveStatus === "saving" || hasNoteConflicts
                            }
                            title={
                                hasNoteConflicts
                                    ? "겹치는 노트를 먼저 수정해주세요."
                                    : "복구 가능한 버전 저장"
                            }
                            onClick={() => void runExplicitSave("manual")}
                            className="border-border hover:bg-surface-muted flex h-9 items-center gap-1.5 rounded-md border px-3 text-xs font-bold disabled:opacity-40"
                        >
                            {saveStatus === "saving" ? (
                                <LoaderCircle className="size-3.5 animate-spin" />
                            ) : (
                                <Save className="size-3.5" />
                            )}
                            버전 저장
                        </button>
                        <button
                            type="button"
                            disabled={
                                saveStatus === "saving" ||
                                chartDocument.notes.length === 0 ||
                                hasNoteConflicts
                            }
                            title={
                                hasNoteConflicts
                                    ? "겹치는 노트를 먼저 수정해주세요."
                                    : chartDocument.notes.length === 0
                                      ? "노트를 작성한 뒤 공개할 수 있습니다."
                                      : "현재 채보 공개"
                            }
                            onClick={() => {
                                if (
                                    window.confirm(
                                        "현재 초안을 일반 사용자에게 공개할까요?"
                                    )
                                ) {
                                    void runExplicitSave("publish");
                                }
                            }}
                            className="bg-text-primary text-bg flex h-9 items-center rounded-md px-3 text-xs font-bold disabled:cursor-not-allowed disabled:opacity-35"
                        >
                            공개
                        </button>
                    </div>
                </header>

                <div className="flex min-h-0 flex-1">
                    <aside className="border-divider bg-surface flex w-48 shrink-0 flex-col border-r">
                        <nav className="border-divider flex flex-col gap-1 border-b p-2">
                            <button
                                type="button"
                                onClick={() => setEditorMode("timing")}
                                className={`flex h-10 items-center gap-2 rounded-md px-3 text-left text-xs font-bold ${
                                    editorMode === "timing"
                                        ? "bg-surface-muted"
                                        : "text-text-secondary hover:bg-surface-muted/60"
                                }`}
                            >
                                <Clock3
                                    className={`size-4 ${
                                        editorMode === "timing"
                                            ? "text-chart"
                                            : ""
                                    }`}
                                />
                                타이밍
                            </button>
                            <button
                                type="button"
                                onClick={() => setEditorMode("notes")}
                                className={`flex h-10 items-center gap-2 rounded-md px-3 text-left text-xs font-bold ${
                                    editorMode === "notes"
                                        ? "bg-surface-muted"
                                        : "text-text-secondary hover:bg-surface-muted/60"
                                }`}
                            >
                                <Maximize2 className="size-4" />
                                채보 작성
                            </button>
                        </nav>

                        {editorMode === "notes" ? (
                            <section className="border-divider border-b p-2">
                                <p className="text-micro mb-1.5 px-1">
                                    작성 도구
                                </p>
                                <button
                                    type="button"
                                    onClick={() => setNoteTool("select")}
                                    className={`flex h-9 w-full items-center gap-2 rounded-md px-2 text-left text-xs font-semibold ${
                                        noteTool === "select"
                                            ? "bg-surface-muted text-text-primary"
                                            : "text-text-secondary hover:bg-surface-muted/60"
                                    }`}
                                >
                                    <MousePointer2 className="size-3.5" />
                                    선택
                                    <kbd className="text-micro ml-auto">1</kbd>
                                </button>
                                <div className="mt-1 grid grid-cols-2 gap-1">
                                    {Object.entries(noteTypeLabels).map(
                                        ([value, label]) => (
                                            <button
                                                key={value}
                                                type="button"
                                                onClick={() =>
                                                    setNoteTool(
                                                        value as ChartNoteType
                                                    )
                                                }
                                                className={`h-9 rounded-md px-1 text-xs font-semibold ${
                                                    noteTool === value
                                                        ? "bg-surface-muted text-text-primary"
                                                        : "text-text-secondary hover:bg-surface-muted/60"
                                                }`}
                                            >
                                                {label}
                                                <kbd className="text-micro ml-1">
                                                    {
                                                        noteToolShortcuts[
                                                            value as ChartNoteType
                                                        ]
                                                    }
                                                </kbd>
                                            </button>
                                        )
                                    )}
                                </div>

                                <p className="text-micro mt-3 mb-1.5 px-1">
                                    연주 안내 손
                                </p>
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
                                            onClick={() => setNoteHand(hand)}
                                            className={`h-8 rounded-md border text-xs font-semibold ${
                                                noteHand === hand
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

                                <p className="text-micro mt-3 mb-1.5 px-1">
                                    기본 폭
                                </p>
                                <div className="grid grid-cols-4 gap-1">
                                    {[1, 2, 3, 4].map((width) => (
                                        <button
                                            key={width}
                                            type="button"
                                            onClick={() => setNoteWidth(width)}
                                            className={`h-8 rounded-md border text-xs font-semibold ${
                                                noteWidth === width
                                                    ? "border-text-secondary bg-surface-muted"
                                                    : "border-border text-text-secondary"
                                            }`}
                                        >
                                            {width}
                                        </button>
                                    ))}
                                </div>
                                <p className="text-micro mt-2 px-1 leading-relaxed">
                                    좌클릭으로 작성·선택하고 우클릭으로
                                    삭제합니다. 선택 도구에서 빈 공간을
                                    드래그하면 여러 노트를 선택할 수 있습니다.
                                </p>
                            </section>
                        ) : null}

                        <section className="min-h-0 flex-1 overflow-y-auto p-2">
                            <div className="mb-2 flex items-center gap-1.5 px-1">
                                <History className="size-3.5" />
                                <h2 className="text-xs font-semibold">
                                    저장 이력
                                </h2>
                            </div>
                            {revisionHistory.length > 0 ? (
                                <div className="flex flex-col gap-1">
                                    {revisionHistory.map((revision) => (
                                        <button
                                            key={revision.id}
                                            type="button"
                                            onClick={() =>
                                                void restoreRevision(revision)
                                            }
                                            className="hover:bg-surface-muted rounded-md px-2 py-2 text-left"
                                        >
                                            <span className="flex items-center justify-between text-xs">
                                                <strong>
                                                    v{revision.number}
                                                </strong>
                                                <span className="text-micro">
                                                    {revision.kind === "publish"
                                                        ? "공개"
                                                        : "저장"}
                                                </span>
                                            </span>
                                            <span className="text-micro mt-1 block">
                                                {formatRevisionDateTime(
                                                    revision.createdAt
                                                )}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-micro px-1 leading-relaxed">
                                    Ctrl+S 또는 버전 저장을 누르면 복구 지점이
                                    만들어집니다.
                                </p>
                            )}
                        </section>
                    </aside>

                    <main className="relative min-w-0 flex-1 overflow-hidden">
                        {editorMode === "timing" ? (
                            <TimingRuler
                                pixelsPerSecond={pixelsPerSecond}
                                pianoVisible={pianoVisible}
                                onSeek={(time) => void seek(time)}
                            />
                        ) : (
                            <PixiNoteEditor
                                pixelsPerSecond={pixelsPerSecond}
                                pianoVisible={pianoVisible}
                                tool={noteTool}
                                hand={noteHand}
                                defaultWidth={noteWidth}
                                onSeek={(time) => void seek(time)}
                                onToolChange={setNoteTool}
                            />
                        )}
                        <div className="border-border bg-surface/95 absolute top-3 left-3 flex items-center gap-1 rounded-md border p-1 shadow-lg">
                            <button
                                type="button"
                                onClick={() =>
                                    setPixelsPerSecond((value) =>
                                        Math.max(60, value - 30)
                                    )
                                }
                                className="hover:bg-surface-muted size-7 rounded text-sm"
                                aria-label="타이밍 화면 축소"
                            >
                                −
                            </button>
                            <span className="text-micro w-14 text-center tabular-nums">
                                {pixelsPerSecond}px/s
                            </span>
                            <button
                                type="button"
                                onClick={() =>
                                    setPixelsPerSecond((value) =>
                                        Math.min(420, value + 30)
                                    )
                                }
                                className="hover:bg-surface-muted size-7 rounded text-sm"
                                aria-label="타이밍 화면 확대"
                            >
                                +
                            </button>
                        </div>
                    </main>

                    {editorMode === "timing" ? (
                        <TimingInspector />
                    ) : (
                        <NoteInspector />
                    )}
                </div>

                <footer className="border-divider bg-surface shrink-0 border-t">
                    <div className="flex h-12 items-center gap-2 px-3">
                        <input
                            ref={audioInputRef}
                            type="file"
                            accept="audio/*,.mp3,.ogg,.wav,.m4a,.flac"
                            className="sr-only"
                            onChange={(event) => void handleAudioFile(event)}
                        />
                        <input
                            ref={importInputRef}
                            type="file"
                            accept=".json,.noslog-chart.json,application/json"
                            className="sr-only"
                            onChange={(event) => void handleImportFile(event)}
                        />
                        <button
                            type="button"
                            disabled={isDecoding}
                            onClick={() => audioInputRef.current?.click()}
                            className="border-border hover:bg-surface-muted flex h-8 max-w-48 items-center gap-1.5 rounded-md border px-2.5 text-xs font-semibold disabled:opacity-40"
                        >
                            {isDecoding ? (
                                <LoaderCircle className="size-3.5 animate-spin" />
                            ) : (
                                <FileAudio className="size-3.5" />
                            )}
                            <span className="truncate">
                                {fileName ?? "로컬 음원 불러오기"}
                            </span>
                        </button>
                        <EditorButton
                            label={isPlaying ? "일시정지" : "재생"}
                            onClick={() => void togglePlayback()}
                        >
                            {isPlaying ? (
                                <Pause className="size-4" />
                            ) : (
                                <Play className="size-4" />
                            )}
                        </EditorButton>
                        <EditorButton
                            label="처음으로 이동"
                            disabled={currentTimeMs <= 0}
                            onClick={() => void seek(0)}
                        >
                            <RotateCcw className="size-4" />
                        </EditorButton>
                        <span className="w-23 text-center font-mono text-xs tabular-nums">
                            {formatEditorTime(currentTimeMs)}
                        </span>

                        <label className="text-micro ml-1 flex items-center gap-1">
                            속도
                            <select
                                value={playbackRate}
                                onChange={(event) =>
                                    setPlaybackRate(
                                        Number(
                                            event.target.value
                                        ) as ChartPlaybackRate
                                    )
                                }
                                className="border-border bg-bg h-8 rounded-md border px-2 text-xs"
                            >
                                {playbackRates.map((rate) => (
                                    <option key={rate} value={rate}>
                                        {Math.round(rate * 100)}%
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label className="text-micro flex items-center gap-1">
                            스냅
                            <select
                                value={snapDivisor}
                                onChange={(event) =>
                                    setSnapDivisor(Number(event.target.value))
                                }
                                className="border-border bg-bg h-8 rounded-md border px-2 text-xs"
                            >
                                {snapDivisors.map((divisor) => (
                                    <option key={divisor} value={divisor}>
                                        1/{divisor}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label className="hover:bg-surface-muted flex h-8 items-center gap-2 rounded-md px-2 text-xs font-semibold">
                            <input
                                type="checkbox"
                                checked={metronomeEnabled}
                                onChange={(event) =>
                                    setMetronomeEnabled(event.target.checked)
                                }
                                className="accent-text-primary size-3.5"
                            />
                            메트로놈
                        </label>

                        <label className="border-border flex h-8 items-center gap-1.5 rounded-md border px-2">
                            <Volume2
                                className="text-text-secondary size-3.5"
                                aria-hidden
                            />
                            <input
                                type="range"
                                min="0"
                                max="100"
                                step="5"
                                value={metronomeVolume}
                                onChange={(event) =>
                                    setMetronomeVolume(
                                        Number(event.target.value)
                                    )
                                }
                                aria-label="메트로놈 음량"
                                className="accent-text-primary w-16"
                            />
                            <span className="text-micro w-8 text-right tabular-nums">
                                {metronomeVolume}%
                            </span>
                        </label>

                        <label className="hover:bg-surface-muted flex h-8 items-center gap-2 rounded-md px-2 text-xs font-semibold">
                            <input
                                type="checkbox"
                                checked={pianoVisible}
                                onChange={(event) =>
                                    updatePianoVisibility(event.target.checked)
                                }
                                className="accent-text-primary size-3.5"
                            />
                            피아노
                        </label>

                        {audioError ? (
                            <span className="text-danger ml-auto max-w-72 truncate text-xs">
                                {audioError}
                            </span>
                        ) : (
                            <span className="text-micro ml-auto">
                                음원은 브라우저에서만 사용되며 업로드되지
                                않습니다.
                            </span>
                        )}
                    </div>
                    <div className="border-divider border-t px-3 py-2">
                        <WaveformTimeline
                            peaks={waveformPeaks}
                            onSeek={(time) => void seek(time)}
                        />
                    </div>
                </footer>
            </div>

            <div className="bg-bg fixed inset-0 z-[100] flex items-center justify-center p-6 min-[1024px]:hidden">
                <div className="max-w-sm text-center">
                    <div className="bg-surface mx-auto flex size-12 items-center justify-center rounded-full">
                        <Maximize2 className="size-5" />
                    </div>
                    <h1 className="text-title mt-4">
                        큰 화면에서 편집해주세요
                    </h1>
                    <p className="text-body-muted mt-2">
                        28칸 채보와 타이밍 도구를 정확하게 다루기 위해 데스크톱
                        또는 가로형 태블릿을 지원합니다.
                    </p>
                    <Link
                        href={`/admin/music/${encodeURIComponent(metadata.musicIndex)}`}
                        className="border-border mt-5 inline-flex h-10 items-center rounded-md border px-4 text-sm font-semibold"
                    >
                        악곡 관리로 돌아가기
                    </Link>
                </div>
            </div>
        </>
    );
}

export default function ChartTimingEditor(props: ChartTimingEditorProps) {
    const browserSupport = useSyncExternalStore(
        subscribeBrowserSupport,
        getBrowserSupportSnapshot,
        getServerBrowserSupportSnapshot
    );

    if (browserSupport === "checking") {
        return <div className="bg-bg fixed inset-0 z-[100]" aria-hidden />;
    }

    if (browserSupport === "safari") {
        return (
            <div className="bg-bg fixed inset-0 z-[100] flex items-center justify-center p-6">
                <div className="max-w-sm text-center">
                    <div className="bg-surface mx-auto flex size-12 items-center justify-center rounded-full">
                        <Maximize2 className="size-5" />
                    </div>
                    <h1 className="text-title mt-4">
                        Safari에서는 편집할 수 없습니다
                    </h1>
                    <p className="text-body-muted mt-2">
                        채보 편집기는 Chrome 또는 Edge를 지원합니다. macOS에서도
                        Chrome으로 다시 열어주세요.
                    </p>
                    <Link
                        href={`/admin/music/${encodeURIComponent(props.metadata.musicIndex)}`}
                        className="border-border mt-5 inline-flex h-10 items-center rounded-md border px-4 text-sm font-semibold"
                    >
                        악곡 관리로 돌아가기
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <ChartEditorStoreProvider
            initialState={{
                document: props.initialDocument,
                draftVersion: props.draftVersion,
                savedRevision: props.savedRevision,
                publishedRevision: props.publishedRevision,
                updatedAt: props.updatedAt ? new Date(props.updatedAt) : null,
            }}
        >
            <ChartTimingEditorWorkspace
                metadata={props.metadata}
                revisions={props.revisions}
            />
        </ChartEditorStoreProvider>
    );
}
