"use client";

import {
    ArrowLeft,
    Check,
    Clock3,
    Download,
    Eye,
    FileAudio,
    History,
    Maximize2,
    MessageSquare,
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
    saveMyChartDraft,
    submitMyChartDraft,
    withdrawMyChartDraft,
} from "@/app/(site)/music/[index]/[difficulty]/draft-actions";
import { reviewChartDraft } from "@/app/admin/contributions/actions";
import {
    createChartPatternRevision,
    createChartPatternVid2bmapRevision,
    publishChartPattern,
    restoreChartPatternRevision,
    saveChartPatternDraft,
} from "@/app/admin/music/[index]/[difficulty]/pattern/actions";
import { useLocale, useTranslations } from "@/components/i18n/locale-provider";
import ContributionLabel from "@/features/contributions/components/contribution-label";
import type { NameLabel } from "@/features/contributions/contribution-level";
import type { ChartDraftStatus } from "@/features/contributions/schemas/chart-draft-schema";
import {
    getBrowserSupportSnapshot,
    getServerBrowserSupportSnapshot,
    subscribeBrowserSupport,
} from "@/lib/browser-support";
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
import ChartReviewPanel, { useDraftComments } from "./chartReviewPanel";
import NoteInspector from "./noteInspector";
import PixiNoteEditor, { type NoteEditorTool } from "./pixiNoteEditor";
import TimingInspector from "./timingInspector";
import TimingRuler from "./timingRuler";
import Vid2bmapImportPanel from "./vid2bmapImportPanel";
import { useChartAudio } from "./useChartAudio";
import WaveformTimeline from "./waveformTimeline";
import { foundationButtonClass } from "@/components/ui/button";
import { cn } from "@/lib/cn";

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
    /** 악곡 정보의 노트 수 — 영상 추출 가져오기가 판정 수와 비교한다(운영자 에디터만) */
    noteCount?: number | null;
}

/**
 * 에디터 모드(2026-09-24 유저 기여 3단계) — 캔버스 · 편집 조작은 같고 셸(위 막대 버튼 · 레일 탭)만 다르다.
 * admin = 운영자 초안(버전 저장 · 공개 · 영상 추출), contributor = 내 초안(자동 저장 · 검토 요청),
 * review = 운영자가 유저 초안을 읽기 전용으로(시각 댓글 · 수정 요청 · 공개).
 */
export type ChartEditorMode =
    | { kind: "admin"; revisions: ChartEditorRevision[] }
    | {
          kind: "contributor";
          draftId: number;
          status: ChartDraftStatus;
          backHref: string;
      }
    | {
          kind: "review";
          draftId: number;
          status: ChartDraftStatus;
          author: { name: string; label: NameLabel | null };
          backHref: string;
      };

interface ChartTimingEditorProps {
    metadata: ChartEditorMetadata;
    initialDocument: ChartDocument;
    draftVersion: number;
    savedRevision: number;
    publishedRevision: number | null;
    updatedAt: string | null;
    mode: ChartEditorMode;
}

type EditorTab = "timing" | "notes" | "review";

const playbackRates: ChartPlaybackRate[] = [0.25, 0.5, 0.75, 1, 1.5, 2];
const snapDivisors = [1, 2, 3, 4, 6, 8, 12, 16, 24, 32];
const PIANO_VISIBILITY_STORAGE_KEY = "noslog-chart-editor-piano-visible";
const PIANO_VISIBILITY_CHANGE_EVENT =
    "noslog-chart-editor-piano-visibility-change";
const noteTypes: ChartNoteType[] = ["standard", "tenuto", "glissando", "trill"];
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

const STATUS_TONES: Partial<Record<ChartDraftStatus, string>> = {
    pending: "warning",
    changes_requested: "info",
    approved: "success",
};

function StatusTag({ status }: { status: ChartDraftStatus }) {
    const t = useTranslations();
    const tone = STATUS_TONES[status];
    return (
        <span
            // 태그 글자 12/600(가이드) — 에디터 셸에는 글자 크기를 물려줄 부모가 없다
            className={
                tone
                    ? "nl-tag nl-tag--status nl-metadata"
                    : "nl-tag nl-metadata"
            }
            data-tone={tone}
        >
            {t(`contribution.draftStatus.${status}`)}
        </span>
    );
}

/** 읽기 전용일 때 도구 전환 요청을 버린다 */
function ignoreTool() {}

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
            className={cn(
                foundationButtonClass({
                    variant: "secondary",
                    size: "icon-sm",
                }),
                "shrink-0"
            )}
        >
            {children}
        </button>
    );
}

function ChartTimingEditorWorkspace({
    metadata,
    mode,
}: Pick<ChartTimingEditorProps, "metadata" | "mode">) {
    const t = useTranslations();
    const locale = useLocale();
    const router = useRouter();
    const store = useChartEditorStoreApi();
    const chartDocument = useChartEditorStore((state) => state.document);
    const readOnly = useChartEditorStore((state) => state.readOnly);
    const setReadOnly = useChartEditorStore((state) => state.setReadOnly);
    const draftId = mode.kind === "admin" ? null : mode.draftId;
    const [draftStatus, setDraftStatus] = useState<ChartDraftStatus | null>(
        mode.kind === "admin" ? null : mode.status
    );
    const [statusPending, setStatusPending] = useState(false);
    const comments = useDraftComments(metadata.chartId, draftId);
    const openComments = comments.filter((comment) => !comment.resolved);
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
    /** 겹친 채로 넣은 영상 추출(2026-09-26 A) — 겹침을 고친 뒤 첫 버전 저장을 「영상 추출」 버전으로 남긴다 */
    const pendingVid2bmapRef = useRef<string | null>(null);
    const vid2bmapInputRef = useRef<HTMLInputElement | null>(null);
    const importMenuRef = useRef<HTMLDivElement | null>(null);
    const [importMenuOpen, setImportMenuOpen] = useState(false);
    const [vid2bmapFile, setVid2bmapFile] = useState<File | null>(null);
    const importTimingCount = useChartEditorStore(
        (state) => state.importPreview?.timingTicks.length ?? 0
    );
    const [pixelsPerSecond, setPixelsPerSecond] = useState(150);
    const [revisionHistory, setRevisionHistory] = useState(
        mode.kind === "admin" ? mode.revisions : []
    );
    // 검토 모드 · 수정 요청을 받은 초안은 「검토」 탭부터, 기여자는 노트가 있으면 「채보 작성」 부터
    const [editorMode, setEditorMode] = useState<EditorTab>(() =>
        mode.kind === "review" ||
        (mode.kind === "contributor" && mode.status === "changes_requested")
            ? "review"
            : mode.kind === "contributor" && chartDocument.notes.length
              ? "notes"
              : "timing"
    );
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
                .markSaveError(first?.message ?? t("editor.checkFormat"));
            return null;
        }
        return parsed.data;
    }, [store, t]);

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
            // 기여자 초안은 내 초안 자리(chart_drafts)에 — 버전이 맞을 때만 쓴다
            if (mode.kind === "contributor") {
                const result = await saveMyChartDraft(
                    {
                        chartId: metadata.chartId,
                        baseVersion: version,
                        document: validDocument,
                    },
                    locale
                );
                if (!result.success || result.version === undefined) {
                    store.getState().markSaveError(result.message);
                    if (result.conflict) toast.error(result.message);
                    return;
                }
                store.getState().markSaveSuccess({
                    draftVersion: result.version,
                    persistedSerial: serial,
                    message: result.message,
                });
                return;
            }
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
            store.getState().markSaveError(t("editor.autoSaveError"));
        }
    }, [
        locale,
        metadata.chartId,
        mode.kind,
        store,
        t,
        validateCurrentDocument,
    ]);

    /** 검토 요청 전 — 저장 중이면 기다리고, 안 된 변경이 있으면 지금 저장한다 */
    const flushSave = useCallback(async () => {
        for (let attempt = 0; attempt < 40; attempt += 1) {
            const state = store.getState();
            if (state.saveStatus === "saving") {
                await new Promise((resolve) => window.setTimeout(resolve, 150));
                continue;
            }
            if (state.changeSerial <= state.persistedSerial) return true;
            await runAutoSave();
            if (store.getState().saveStatus === "error") return false;
        }
        return false;
    }, [runAutoSave, store]);

    async function submitDraft() {
        if (!window.confirm(t("editor.contributor.submitConfirm"))) return;
        setStatusPending(true);
        try {
            if (!(await flushSave())) {
                toast.error(
                    store.getState().saveMessage ?? t("editor.autoSaveError")
                );
                return;
            }
            const result = await submitMyChartDraft(metadata.chartId, locale);
            if (!result.success) {
                toast.error(result.message);
                return;
            }
            toast.success(result.message);
            setDraftStatus("pending");
            setReadOnly(true);
            setNoteTool("select");
        } catch {
            toast.error(t("contribution.submitError"));
        } finally {
            setStatusPending(false);
        }
    }

    async function withdrawDraft() {
        setStatusPending(true);
        try {
            const result = await withdrawMyChartDraft(metadata.chartId, locale);
            if (!result.success) {
                toast.error(result.message);
                return;
            }
            toast.success(result.message);
            setDraftStatus("draft");
            setReadOnly(false);
        } catch {
            toast.error(t("contribution.submitError"));
        } finally {
            setStatusPending(false);
        }
    }

    /** 운영자 결정(검토 모드) — 끝나면 기여 「채보」 목록으로 */
    async function decide(decision: "request_changes" | "publish") {
        if (mode.kind !== "review") return;
        if (
            !window.confirm(
                decision === "publish"
                    ? "이 초안을 공개 채보로 바꿀까요? 운영자 초안에 공개 안 한 변경이 있으면 먼저 이력으로 보관합니다."
                    : "작성자에게 수정을 요청할까요? 요청 전에 고칠 곳을 시각 댓글로 남겨 주세요."
            )
        )
            return;
        setStatusPending(true);
        try {
            const result = await reviewChartDraft({
                draftId: mode.draftId,
                decision,
            });
            if (!result.success) {
                toast.error(result.message);
                return;
            }
            toast.success(result.message);
            router.push(mode.backHref);
        } catch {
            toast.error("처리하지 못했습니다.");
        } finally {
            setStatusPending(false);
        }
    }

    const runExplicitSave = useCallback(
        async (
            requestedKind: "manual" | "publish" | "vid2bmap",
            requestedMessage?: string
        ) => {
            // 겹친 채로 넣은 영상 추출이 아직 버전으로 안 남았으면, 겹침을 고친 뒤 첫 버전 저장을 그 버전으로
            const pending =
                requestedKind === "manual" ? pendingVid2bmapRef.current : null;
            const kind = pending ? "vid2bmap" : requestedKind;
            const message = pending ?? requestedMessage;
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
                        : kind === "vid2bmap"
                          ? createChartPatternVid2bmapRevision
                          : createChartPatternRevision;
                const result = await action({
                    chartId: metadata.chartId,
                    baseVersion: state.draftVersion,
                    document: validDocument,
                    ...(message ? { message } : {}),
                });
                if (!result.success || result.draftVersion === undefined) {
                    store.getState().markSaveError(result.message);
                    toast.error(result.message);
                    return;
                }
                if (kind === "vid2bmap") pendingVid2bmapRef.current = null;
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
                // 버전 저장은 운영자 초안만 — 기여자 초안은 바로 자동 저장
                if (mode.kind === "admin") void runExplicitSave("manual");
                else if (mode.kind === "contributor") void runAutoSave();
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
    }, [mode.kind, redo, runAutoSave, runExplicitSave, togglePlayback, undo]);

    useEffect(() => {
        if (!importMenuOpen) return;
        const close = (event: MouseEvent) => {
            if (!importMenuRef.current?.contains(event.target as Node)) {
                setImportMenuOpen(false);
            }
        };
        const escape = (event: KeyboardEvent) => {
            if (event.key === "Escape") setImportMenuOpen(false);
        };
        window.addEventListener("mousedown", close);
        window.addEventListener("keydown", escape);
        return () => {
            window.removeEventListener("mousedown", close);
            window.removeEventListener("keydown", escape);
        };
    }, [importMenuOpen]);

    function handleVid2bmapFile(event: ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
        event.target.value = "";
        if (!file) return;
        setVid2bmapFile(file);
        // 미리보기는 노트 캔버스에만 그린다
        setEditorMode("notes");
    }

    /** 넣은 직후 「영상 추출」 버전으로 — 이 버전이 공개 채보 출처 표기의 근거(2026-09-24 C2) */
    const saveAfterImport = useCallback(
        async (message: string) => {
            const state = store.getState();
            // 겹친 채로 넣었으면(가져오기 창이 알림) 지금은 버전 저장 안 됨 — 고친 뒤 첫 버전 저장을 이 버전으로
            if (
                findChartNoteConflicts(
                    state.document.notes,
                    state.document.ticksPerQuarter
                ).length > 0
            ) {
                pendingVid2bmapRef.current = message;
                return false;
            }
            const before = store.getState().savedRevision;
            await runExplicitSave("vid2bmap", message);
            return store.getState().savedRevision > before;
        },
        [runExplicitSave, store]
    );

    /** 가져오기 직전 지금 초안을 복구 가능한 버전으로 — 저장 버전 번호가 올랐으면 성공 */
    const saveBeforeImport = useCallback(async () => {
        const before = store.getState().savedRevision;
        await runExplicitSave("manual");
        return store.getState().savedRevision > before;
    }, [runExplicitSave, store]);

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
                        t("editor.file.unsupported")
                );
                return;
            }
            if (
                parsed.data.music.index !== metadata.musicIndex ||
                parsed.data.music.difficulty.toLowerCase() !==
                    metadata.difficulty.toLowerCase()
            ) {
                const confirmed = window.confirm(t("editor.file.otherChart"));
                if (!confirmed) return;
            }
            store.getState().replaceDocument(parsed.data.chart);
            toast.success(t("editor.file.imported"));
        } catch {
            toast.error(t("editor.file.unreadable"));
        }
    }

    function exportChart() {
        const validDocument = validateCurrentDocument();
        if (!validDocument) {
            toast.error(store.getState().saveMessage ?? t("editor.checkData"));
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
        toast.success(t("editor.file.exported"));
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
            <div className="fixed inset-0 z-nl-fullscreen hidden min-h-0 flex-col bg-nl-canvas min-[1024px]:flex">
                <header className="flex h-nl-header shrink-0 items-center gap-nl-12 border-b-nl-stroke border-nl-divider bg-nl-surface px-nl-12">
                    <Link
                        href={
                            mode.kind === "admin"
                                ? `/admin/music/${encodeURIComponent(metadata.musicIndex)}`
                                : mode.backHref
                        }
                        aria-label={
                            mode.kind === "contributor"
                                ? t("editor.back")
                                : mode.kind === "review"
                                  ? "기여 채보 목록으로 돌아가기"
                                  : "악곡 관리로 돌아가기"
                        }
                        className={cn(
                            foundationButtonClass({
                                variant: "secondary",
                                size: "icon-sm",
                            }),
                            "shrink-0"
                        )}
                    >
                        <ArrowLeft className="nl-icon-small" />
                    </Link>
                    <div className="min-w-0">
                        <div className="flex items-center gap-nl-8">
                            <h1 className="nl-editor-title nl-emphasis-label truncate">
                                {metadata.title}
                            </h1>
                            <span className="nl-metadata rounded-nl-control bg-nl-surface px-nl-8 py-nl-4 text-nl-subdued">
                                {metadata.difficulty} · Lv {metadata.level}
                            </span>
                        </div>
                        <p className="nl-metadata mt-nl-4 truncate text-nl-subdued">
                            {mode.kind === "review"
                                ? `채보 검토 · ${mode.author.name}`
                                : t("editor.subtitle", {
                                      tab:
                                          mode.kind === "contributor"
                                              ? t("editor.myDraft")
                                              : t(`editor.tab.${editorMode}`),
                                  })}
                        </p>
                    </div>

                    <div className="ml-auto flex min-w-0 items-center gap-nl-8">
                        <div
                            className={`nl-editor-status nl-metadata mr-nl-4 text-right ${
                                saveStatus === "error" || hasNoteConflicts
                                    ? "text-nl-error"
                                    : "text-nl-subdued"
                            }`}
                        >
                            <span className="block truncate">
                                {hasNoteConflicts
                                    ? t("editor.status.conflicts", {
                                          count: noteConflicts.length.toLocaleString(
                                              locale
                                          ),
                                      })
                                    : saveStatus === "saving"
                                      ? t("editor.saving")
                                      : hasUnsavedChanges
                                        ? t("editor.status.unsaved")
                                        : mode.kind === "review"
                                          ? "읽기 전용"
                                          : readOnly
                                            ? t("editor.status.locked")
                                            : (saveMessage ??
                                              (lastSavedAt
                                                  ? t("editor.status.savedAt", {
                                                        time: formatSavedTime(
                                                            lastSavedAt
                                                        ),
                                                    })
                                                  : t("editor.status.new")))}
                            </span>
                            {mode.kind === "admin" ? (
                                <span className="nl-metadata block text-nl-subdued">
                                    저장 v{savedRevision}
                                    {publishedRevision
                                        ? ` · 공개 v${publishedRevision}`
                                        : " · 비공개"}
                                </span>
                            ) : null}
                        </div>
                        {mode.kind === "review" ? null : (
                            <>
                                <EditorButton
                                    label={t("editor.undo")}
                                    disabled={readOnly || undoStackLength === 0}
                                    onClick={undo}
                                >
                                    <Undo2 className="nl-icon-small" />
                                </EditorButton>
                                <EditorButton
                                    label={t("editor.redo")}
                                    disabled={readOnly || redoStackLength === 0}
                                    onClick={redo}
                                >
                                    <Redo2 className="nl-icon-small" />
                                </EditorButton>
                            </>
                        )}
                        {mode.kind === "admin" ? (
                            <div ref={importMenuRef} className="relative">
                                <EditorButton
                                    label="채보 가져오기"
                                    onClick={() =>
                                        setImportMenuOpen((open) => !open)
                                    }
                                >
                                    <Upload className="nl-icon-small" />
                                </EditorButton>
                                {importMenuOpen ? (
                                    <div
                                        role="menu"
                                        aria-label="채보 가져오기"
                                        className="nl-editor-menu absolute top-full right-0 z-nl-popover mt-nl-8 flex flex-col gap-nl-4 rounded-nl-overlay border-nl-stroke border-nl-divider bg-nl-surface p-nl-4 shadow-nl-overlay"
                                    >
                                        <button
                                            type="button"
                                            role="menuitem"
                                            onClick={() => {
                                                setImportMenuOpen(false);
                                                importInputRef.current?.click();
                                            }}
                                            className="nl-hover-layer rounded-nl-field px-nl-12 py-nl-8 text-left"
                                        >
                                            <span className="nl-metadata block">
                                                NosLog 채보 파일
                                            </span>
                                            <span className="nl-metadata block text-nl-subdued">
                                                .noslog-chart.json — 지금 초안을
                                                교체
                                            </span>
                                        </button>
                                        <button
                                            type="button"
                                            role="menuitem"
                                            onClick={() => {
                                                setImportMenuOpen(false);
                                                vid2bmapInputRef.current?.click();
                                            }}
                                            className="nl-hover-layer rounded-nl-field px-nl-12 py-nl-8 text-left"
                                        >
                                            <span className="nl-metadata block">
                                                영상 추출 결과
                                            </span>
                                            <span className="nl-metadata block text-nl-subdued">
                                                vid2bmap 결과 zip → 미리보고
                                                초안에 넣기
                                            </span>
                                        </button>
                                    </div>
                                ) : null}
                            </div>
                        ) : mode.kind === "contributor" ? (
                            // 기여자는 NosLog 채보 파일만(영상 추출은 운영자 도구)
                            <EditorButton
                                label={t("editor.file.import")}
                                disabled={readOnly}
                                onClick={() => importInputRef.current?.click()}
                            >
                                <Upload className="nl-icon-small" />
                            </EditorButton>
                        ) : null}
                        <EditorButton
                            label={t("editor.file.export")}
                            onClick={exportChart}
                        >
                            <Download className="nl-icon-small" />
                        </EditorButton>
                        {mode.kind === "admin" ? (
                            <>
                                <Link
                                    href={`/admin/music/${encodeURIComponent(metadata.musicIndex)}/${metadata.difficulty.toLowerCase()}/pattern/preview`}
                                    target="_blank"
                                    aria-label="전체 채보 미리보기"
                                    title="전체 채보 미리보기"
                                    className={cn(
                                        foundationButtonClass({
                                            variant: "secondary",
                                            size: "icon-sm",
                                        }),
                                        "shrink-0"
                                    )}
                                >
                                    <Eye className="nl-icon-small" />
                                </Link>
                                <button
                                    type="button"
                                    disabled={
                                        saveStatus === "saving" ||
                                        hasNoteConflicts
                                    }
                                    title={
                                        hasNoteConflicts
                                            ? "겹치는 노트를 먼저 수정해주세요."
                                            : "복구 가능한 버전 저장"
                                    }
                                    onClick={() =>
                                        void runExplicitSave("manual")
                                    }
                                    className={foundationButtonClass({
                                        variant: "secondary",
                                        size: "sm",
                                    })}
                                >
                                    {saveStatus === "saving" ? (
                                        <span
                                            className="nl-spinner"
                                            aria-hidden
                                        />
                                    ) : (
                                        <Save className="nl-icon-small" />
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
                                    className={foundationButtonClass({
                                        size: "sm",
                                    })}
                                >
                                    공개
                                </button>
                            </>
                        ) : mode.kind === "contributor" && draftStatus ? (
                            <span className="flex items-center gap-nl-8">
                                <StatusTag status={draftStatus} />
                                {draftStatus === "pending" ? (
                                    <button
                                        type="button"
                                        disabled={statusPending}
                                        onClick={() => void withdrawDraft()}
                                        className={foundationButtonClass({
                                            variant: "secondary",
                                            size: "sm",
                                        })}
                                    >
                                        {statusPending ? (
                                            <span
                                                className="nl-spinner"
                                                aria-hidden
                                            />
                                        ) : null}
                                        {t("editor.contributor.withdraw")}
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        disabled={
                                            statusPending ||
                                            saveStatus === "saving" ||
                                            chartDocument.notes.length === 0 ||
                                            hasNoteConflicts
                                        }
                                        title={
                                            hasNoteConflicts
                                                ? t(
                                                      "editor.contributor.fixConflicts"
                                                  )
                                                : chartDocument.notes.length ===
                                                    0
                                                  ? t(
                                                        "editor.contributor.needNotes"
                                                    )
                                                  : undefined
                                        }
                                        onClick={() => void submitDraft()}
                                        className={foundationButtonClass({
                                            size: "sm",
                                        })}
                                    >
                                        {statusPending ? (
                                            <span
                                                className="nl-spinner"
                                                aria-hidden
                                            />
                                        ) : null}
                                        {t("editor.contributor.submit")}
                                    </button>
                                )}
                            </span>
                        ) : mode.kind === "review" && draftStatus ? (
                            <span className="flex items-center gap-nl-8">
                                <StatusTag status={draftStatus} />
                                <span className="nl-metadata flex items-center gap-nl-8 text-nl-subdued">
                                    {mode.author.name}
                                    <ContributionLabel
                                        label={mode.author.label}
                                    />
                                </span>
                                <button
                                    type="button"
                                    disabled={
                                        statusPending ||
                                        draftStatus !== "pending"
                                    }
                                    onClick={() =>
                                        void decide("request_changes")
                                    }
                                    className={foundationButtonClass({
                                        variant: "secondary",
                                        size: "sm",
                                    })}
                                >
                                    수정 요청
                                </button>
                                <button
                                    type="button"
                                    disabled={
                                        statusPending ||
                                        draftStatus !== "pending" ||
                                        hasNoteConflicts
                                    }
                                    onClick={() => void decide("publish")}
                                    className={foundationButtonClass({
                                        size: "sm",
                                    })}
                                >
                                    공개
                                </button>
                            </span>
                        ) : null}
                    </div>
                </header>

                <div className="flex min-h-0 flex-1">
                    <aside className="nl-editor-rail flex shrink-0 flex-col border-r-nl-stroke border-nl-divider bg-nl-surface">
                        <nav className="flex flex-col gap-nl-4 border-b-nl-stroke border-nl-divider p-nl-8">
                            <button
                                type="button"
                                onClick={() => setEditorMode("timing")}
                                className={`nl-metadata flex min-h-nl-control items-center gap-nl-8 rounded-nl-field px-nl-12 text-left ${
                                    editorMode === "timing"
                                        ? "bg-nl-surface"
                                        : "nl-hover-layer text-nl-subdued"
                                }`}
                            >
                                <Clock3
                                    className={`nl-icon-small ${
                                        editorMode === "timing"
                                            ? "text-nl-chart"
                                            : ""
                                    }`}
                                />
                                {t("editor.tab.timing")}
                            </button>
                            <button
                                type="button"
                                onClick={() => setEditorMode("notes")}
                                className={`nl-metadata flex min-h-nl-control items-center gap-nl-8 rounded-nl-field px-nl-12 text-left ${
                                    editorMode === "notes"
                                        ? "bg-nl-surface"
                                        : "nl-hover-layer text-nl-subdued"
                                }`}
                            >
                                <Maximize2 className="nl-icon-small" />
                                {t("editor.tab.notes")}
                            </button>
                            {draftId !== null ? (
                                // 「검토」 탭(2026-09-24 B1) — 단계 줄 · 시각 댓글. 남은 댓글 수를 붙인다
                                <button
                                    type="button"
                                    onClick={() => setEditorMode("review")}
                                    className={`nl-metadata flex min-h-nl-control items-center gap-nl-8 rounded-nl-field px-nl-12 text-left ${
                                        editorMode === "review"
                                            ? "bg-nl-surface"
                                            : "nl-hover-layer text-nl-subdued"
                                    }`}
                                >
                                    <MessageSquare className="nl-icon-small" />
                                    <span>
                                        {t("editor.tab.review")}
                                        {openComments.length
                                            ? ` · ${openComments.length}`
                                            : ""}
                                    </span>
                                </button>
                            ) : null}
                        </nav>

                        {editorMode === "review" && draftId !== null ? (
                            <ChartReviewPanel
                                chartId={metadata.chartId}
                                draftId={draftId}
                                status={draftStatus ?? "draft"}
                                comments={comments}
                                canModerate={mode.kind === "review"}
                                onSeek={(time) => void seek(time)}
                            />
                        ) : null}

                        {editorMode === "notes" && !readOnly ? (
                            <section className="border-b-nl-stroke border-nl-divider p-nl-8">
                                <p className="nl-metadata mb-nl-8 px-nl-4 text-nl-subdued">
                                    {t("editor.tools")}
                                </p>
                                <button
                                    type="button"
                                    onClick={() => setNoteTool("select")}
                                    className={`nl-metadata flex min-h-nl-control-compact w-full items-center gap-nl-8 rounded-nl-field px-nl-8 text-left ${
                                        noteTool === "select"
                                            ? "bg-nl-surface text-nl-content"
                                            : "nl-hover-layer text-nl-subdued"
                                    }`}
                                >
                                    <MousePointer2 className="nl-icon-small" />
                                    {t("editor.toolSelect")}
                                    <kbd className="nl-metadata ml-auto text-nl-subdued">
                                        1
                                    </kbd>
                                </button>
                                <div className="mt-nl-4 grid grid-cols-2 gap-nl-4">
                                    {noteTypes.map((value) => (
                                        <button
                                            key={value}
                                            type="button"
                                            onClick={() => setNoteTool(value)}
                                            className={`nl-metadata min-h-nl-control-compact rounded-nl-field px-nl-4 ${
                                                noteTool === value
                                                    ? "bg-nl-surface text-nl-content"
                                                    : "nl-hover-layer text-nl-subdued"
                                            }`}
                                        >
                                            {t(`editor.noteType.${value}`)}
                                            <kbd className="nl-metadata ml-nl-4 text-nl-subdued">
                                                {noteToolShortcuts[value]}
                                            </kbd>
                                        </button>
                                    ))}
                                </div>

                                <p className="nl-metadata mt-nl-12 mb-nl-8 px-nl-4 text-nl-subdued">
                                    {t("editor.note.hand")}
                                </p>
                                <div className="grid grid-cols-2 gap-nl-4">
                                    {(["left", "right"] as const).map(
                                        (hand) => (
                                            <button
                                                key={hand}
                                                type="button"
                                                onClick={() =>
                                                    setNoteHand(hand)
                                                }
                                                className={`nl-metadata h-nl-32 rounded-nl-field border-nl-stroke ${
                                                    noteHand === hand
                                                        ? hand === "left"
                                                            ? "border-cyan-400/50 bg-cyan-400/10 text-cyan-200"
                                                            : "border-red-400/50 bg-red-400/10 text-red-200"
                                                        : "border-nl-divider text-nl-subdued"
                                                }`}
                                            >
                                                {t(`editor.hand.${hand}`)}
                                            </button>
                                        )
                                    )}
                                </div>

                                <p className="nl-metadata mt-nl-12 mb-nl-8 px-nl-4 text-nl-subdued">
                                    {t("editor.defaultWidth")}
                                </p>
                                <div className="grid grid-cols-4 gap-nl-4">
                                    {[1, 2, 3, 4].map((width) => (
                                        <button
                                            key={width}
                                            type="button"
                                            onClick={() => setNoteWidth(width)}
                                            className={`nl-metadata h-nl-32 rounded-nl-field border-nl-stroke ${
                                                noteWidth === width
                                                    ? "border-nl-subdued bg-nl-surface"
                                                    : "border-nl-divider text-nl-subdued"
                                            }`}
                                        >
                                            {width}
                                        </button>
                                    ))}
                                </div>
                                <p className="nl-metadata nl-metadata--long mt-nl-8 px-nl-4 text-nl-subdued">
                                    {t("editor.toolHelp")}
                                </p>
                            </section>
                        ) : null}

                        {mode.kind === "admin" ? (
                            <section className="min-h-0 flex-1 overflow-y-auto p-nl-8">
                                <div className="mb-nl-8 flex items-center gap-nl-8 px-nl-4">
                                    <History className="nl-icon-small" />
                                    <h2 className="nl-metadata">저장 이력</h2>
                                </div>
                                {revisionHistory.length > 0 ? (
                                    <div className="flex flex-col gap-nl-4">
                                        {revisionHistory.map((revision) => (
                                            <button
                                                key={revision.id}
                                                type="button"
                                                onClick={() =>
                                                    void restoreRevision(
                                                        revision
                                                    )
                                                }
                                                className="nl-hover-layer rounded-nl-field px-nl-8 py-nl-8 text-left"
                                            >
                                                <span className="nl-metadata flex items-center justify-between">
                                                    <strong>
                                                        v{revision.number}
                                                    </strong>
                                                    <span className="nl-metadata text-nl-subdued">
                                                        {revision.kind ===
                                                        "publish"
                                                            ? "공개"
                                                            : revision.kind ===
                                                                "vid2bmap"
                                                              ? "영상 추출"
                                                              : revision.kind ===
                                                                  "contribution"
                                                                ? "기여 공개"
                                                                : "저장"}
                                                    </span>
                                                </span>
                                                <span className="nl-metadata mt-nl-4 block text-nl-subdued">
                                                    {formatRevisionDateTime(
                                                        revision.createdAt
                                                    )}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="nl-metadata nl-metadata--long px-nl-4 text-nl-subdued">
                                        Ctrl+S 또는 버전 저장을 누르면 복구
                                        지점이 만들어집니다.
                                    </p>
                                )}
                            </section>
                        ) : null}
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
                                // 읽기 전용이면 선택 도구만(숫자 키로도 바꾸지 않는다)
                                tool={readOnly ? "select" : noteTool}
                                hand={noteHand}
                                defaultWidth={noteWidth}
                                onSeek={(time) => void seek(time)}
                                onToolChange={
                                    readOnly ? ignoreTool : setNoteTool
                                }
                            />
                        )}
                        {vid2bmapFile && editorMode === "notes" ? (
                            <dl
                                aria-label="가져오기 미리보기 범례"
                                className="nl-metadata pointer-events-none absolute top-nl-12 right-nl-12 flex flex-col gap-nl-4 rounded-nl-field border-nl-stroke border-nl-divider bg-nl-canvas px-nl-12 py-nl-8 shadow-nl-overlay"
                            >
                                <div className="flex items-center gap-nl-8">
                                    <dt className="h-nl-8 w-nl-16 bg-nl-warning" />
                                    <dd>넣을 노트</dd>
                                </div>
                                <div className="flex items-center gap-nl-8">
                                    <dt className="h-nl-8 w-nl-16 bg-nl-disabled" />
                                    <dd>지금 초안(흐리게)</dd>
                                </div>
                                <div className="flex items-center gap-nl-8">
                                    <dt className="h-nl-8 w-nl-16 border-nl-stroke-strong border-nl-error" />
                                    <dd>빠질 노트</dd>
                                </div>
                                <div className="flex items-center gap-nl-8">
                                    <dt className="h-nl-8 w-nl-16 border-x-nl-stroke-strong border-nl-content bg-nl-surface" />
                                    <dd>목록에서 고른 곳</dd>
                                </div>
                                {importTimingCount > 0 ? (
                                    <div className="flex items-center gap-nl-8">
                                        <dt className="h-0 w-nl-16 border-t-nl-stroke-strong border-dashed border-nl-warning" />
                                        <dd>넣을 타이밍 포인트</dd>
                                    </div>
                                ) : null}
                            </dl>
                        ) : null}
                        <div className="absolute top-nl-12 left-nl-12 flex items-center gap-nl-4 rounded-nl-field border-nl-stroke border-nl-divider bg-nl-surface p-nl-4 shadow-nl-overlay">
                            <button
                                type="button"
                                onClick={() =>
                                    setPixelsPerSecond((value) =>
                                        Math.max(60, value - 30)
                                    )
                                }
                                className={foundationButtonClass({
                                    variant: "ghost",
                                    size: "icon-sm",
                                })}
                                aria-label={t("editor.zoomOut")}
                            >
                                −
                            </button>
                            <span className="nl-metadata w-nl-64 text-center text-nl-subdued">
                                {pixelsPerSecond}px/s
                            </span>
                            <button
                                type="button"
                                onClick={() =>
                                    setPixelsPerSecond((value) =>
                                        Math.min(420, value + 30)
                                    )
                                }
                                className={foundationButtonClass({
                                    variant: "ghost",
                                    size: "icon-sm",
                                })}
                                aria-label={t("editor.zoomIn")}
                            >
                                +
                            </button>
                        </div>
                    </main>

                    {vid2bmapFile ? (
                        <Vid2bmapImportPanel
                            key={`${vid2bmapFile.name}-${vid2bmapFile.lastModified}`}
                            file={vid2bmapFile}
                            onClose={() => setVid2bmapFile(null)}
                            onReplaceFile={() =>
                                vid2bmapInputRef.current?.click()
                            }
                            onSeek={(time) => void seek(time)}
                            onBeforeApply={saveBeforeImport}
                            onAfterApply={saveAfterImport}
                            officialNoteCount={metadata.noteCount ?? null}
                        />
                    ) : editorMode === "timing" ? (
                        <TimingInspector />
                    ) : (
                        <NoteInspector />
                    )}
                </div>

                <footer className="shrink-0 border-t-nl-stroke border-nl-divider bg-nl-surface">
                    <div className="flex h-nl-48 items-center gap-nl-8 px-nl-12">
                        <input
                            ref={audioInputRef}
                            type="file"
                            accept="audio/*,.mp3,.ogg,.wav,.m4a,.flac"
                            className="sr-only"
                            onChange={(event) => void handleAudioFile(event)}
                        />
                        <input
                            ref={vid2bmapInputRef}
                            type="file"
                            accept=".zip,application/zip"
                            className="sr-only"
                            onChange={handleVid2bmapFile}
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
                            className={cn(
                                foundationButtonClass({
                                    variant: "secondary",
                                    size: "sm",
                                }),
                                "nl-admin-cell"
                            )}
                        >
                            {isDecoding ? (
                                <span className="nl-spinner" aria-hidden />
                            ) : (
                                <FileAudio className="nl-icon-small" />
                            )}
                            <span className="truncate">
                                {fileName ?? t("editor.loadAudio")}
                            </span>
                        </button>
                        <EditorButton
                            label={
                                isPlaying ? t("chart.pause") : t("chart.play")
                            }
                            onClick={() => void togglePlayback()}
                        >
                            {isPlaying ? (
                                <Pause className="nl-icon-small" />
                            ) : (
                                <Play className="nl-icon-small" />
                            )}
                        </EditorButton>
                        <EditorButton
                            label={t("chart.restart")}
                            disabled={currentTimeMs <= 0}
                            onClick={() => void seek(0)}
                        >
                            <RotateCcw className="nl-icon-small" />
                        </EditorButton>
                        <span className="nl-admin-number-input nl-metadata text-center font-nl-mono">
                            {formatEditorTime(currentTimeMs)}
                        </span>

                        <label className="nl-metadata ml-nl-4 flex items-center gap-nl-4 text-nl-subdued">
                            {t("editor.speed")}
                            <select
                                value={playbackRate}
                                onChange={(event) =>
                                    setPlaybackRate(
                                        Number(
                                            event.target.value
                                        ) as ChartPlaybackRate
                                    )
                                }
                                className="nl-input"
                            >
                                {playbackRates.map((rate) => (
                                    <option key={rate} value={rate}>
                                        {Math.round(rate * 100)}%
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label className="nl-metadata flex items-center gap-nl-4 text-nl-subdued">
                            {t("editor.snap")}
                            <select
                                value={snapDivisor}
                                onChange={(event) =>
                                    setSnapDivisor(Number(event.target.value))
                                }
                                className="nl-input"
                            >
                                {snapDivisors.map((divisor) => (
                                    <option key={divisor} value={divisor}>
                                        1/{divisor}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label className="nl-check nl-control nl-hover-layer rounded-nl-field px-nl-8">
                            <input
                                type="checkbox"
                                checked={metronomeEnabled}
                                onChange={(event) =>
                                    setMetronomeEnabled(event.target.checked)
                                }
                            />
                            <span className="nl-check__box" aria-hidden="true">
                                <Check />
                            </span>
                            {t("chart.metronome")}
                        </label>

                        <label className="flex h-nl-32 items-center gap-nl-8 rounded-nl-field border-nl-stroke border-nl-divider px-nl-8">
                            <Volume2
                                className="nl-icon-small text-nl-subdued"
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
                                aria-label={t("chart.metronomeVolume")}
                                className="w-nl-64 accent-nl-primary"
                            />
                            <span className="nl-metadata w-nl-32 text-right text-nl-subdued">
                                {metronomeVolume}%
                            </span>
                        </label>

                        <label className="nl-check nl-control nl-hover-layer rounded-nl-field px-nl-8">
                            <input
                                type="checkbox"
                                checked={pianoVisible}
                                onChange={(event) =>
                                    updatePianoVisibility(event.target.checked)
                                }
                            />
                            <span className="nl-check__box" aria-hidden="true">
                                <Check />
                            </span>
                            {t("editor.piano")}
                        </label>

                        {audioError ? (
                            <span className="nl-editor-error nl-metadata ml-auto truncate text-nl-error">
                                {audioError}
                            </span>
                        ) : (
                            <span className="nl-metadata ml-auto text-nl-subdued">
                                {t("editor.audioNote")}
                            </span>
                        )}
                    </div>
                    <div className="border-t-nl-stroke border-nl-divider px-nl-12 py-nl-8">
                        <WaveformTimeline
                            peaks={waveformPeaks}
                            onSeek={(time) => void seek(time)}
                        />
                    </div>
                </footer>
            </div>

            <div className="fixed inset-0 z-nl-fullscreen flex items-center justify-center bg-nl-canvas p-nl-24 min-[1024px]:hidden">
                <div className="nl-admin-phone-frame text-center">
                    <div className="mx-auto flex size-nl-48 items-center justify-center rounded-nl-full bg-nl-surface">
                        <Maximize2 className="nl-icon" />
                    </div>
                    <h1 className="nl-section-title mt-nl-16 text-nl-content">
                        {t("editor.narrowTitle")}
                    </h1>
                    <p className="nl-body-secondary mt-nl-8 text-nl-subdued">
                        {t("editor.narrowBody")}
                    </p>
                    <Link
                        href={
                            mode.kind === "admin"
                                ? `/admin/music/${encodeURIComponent(metadata.musicIndex)}`
                                : mode.backHref
                        }
                        className={cn(
                            foundationButtonClass({ variant: "secondary" }),
                            "mt-nl-24"
                        )}
                    >
                        {t("editor.goBack")}
                    </Link>
                </div>
            </div>
        </>
    );
}

export default function ChartTimingEditor(props: ChartTimingEditorProps) {
    const t = useTranslations();
    const browserSupport = useSyncExternalStore(
        subscribeBrowserSupport,
        getBrowserSupportSnapshot,
        getServerBrowserSupportSnapshot
    );

    if (browserSupport === "checking") {
        return (
            <div
                className="fixed inset-0 z-nl-fullscreen bg-nl-canvas"
                aria-hidden
            />
        );
    }

    if (browserSupport === "safari") {
        return (
            <div className="fixed inset-0 z-nl-fullscreen flex items-center justify-center bg-nl-canvas p-nl-24">
                <div className="nl-admin-phone-frame text-center">
                    <div className="mx-auto flex size-nl-48 items-center justify-center rounded-nl-full bg-nl-surface">
                        <Maximize2 className="nl-icon" />
                    </div>
                    <h1 className="nl-section-title mt-nl-16 text-nl-content">
                        {t("editor.safariTitle")}
                    </h1>
                    <p className="nl-body-secondary mt-nl-8 text-nl-subdued">
                        {t("editor.safariBody")}
                    </p>
                    <Link
                        href={
                            props.mode.kind === "admin"
                                ? `/admin/music/${encodeURIComponent(props.metadata.musicIndex)}`
                                : props.mode.backHref
                        }
                        className={cn(
                            foundationButtonClass({ variant: "secondary" }),
                            "mt-nl-24"
                        )}
                    >
                        {t("editor.goBack")}
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <ChartEditorStoreProvider
            initialState={{
                // 검토 모드와 검토 요청 중인 내 초안은 읽기 전용으로 연다
                readOnly:
                    props.mode.kind === "review" ||
                    (props.mode.kind === "contributor" &&
                        props.mode.status === "pending"),
                text: {
                    overlap: t("editor.overlap"),
                    saving: t("editor.saving"),
                },
                document: props.initialDocument,
                draftVersion: props.draftVersion,
                savedRevision: props.savedRevision,
                publishedRevision: props.publishedRevision,
                updatedAt: props.updatedAt ? new Date(props.updatedAt) : null,
            }}
        >
            <ChartTimingEditorWorkspace
                metadata={props.metadata}
                mode={props.mode}
            />
        </ChartEditorStoreProvider>
    );
}
