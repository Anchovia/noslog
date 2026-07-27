"use client";

import { createContext, type ReactNode, useContext, useState } from "react";
import { useStore } from "zustand";
import { createStore, type StoreApi } from "zustand/vanilla";

import type {
    ChartDocument,
    ChartNote,
    ChartTimingPoint,
} from "@/lib/chart-pattern/schema";
import { sortTimingPoints } from "@/lib/chart-pattern/timing";

export type ChartSaveStatus = "idle" | "saving" | "saved" | "error";
export type ChartPlaybackRate = 0.25 | 0.5 | 0.75 | 1;

type HistoryEntry =
    | {
          kind: "timing";
          before: ChartTimingPoint[];
          after: ChartTimingPoint[];
      }
    | {
          kind: "document";
          before: ChartDocument;
          after: ChartDocument;
      }
    | {
          kind: "notes";
          before: ChartNote[];
          after: ChartNote[];
      };

interface ChartEditorState {
    document: ChartDocument;
    draftVersion: number;
    savedRevision: number;
    publishedRevision: number | null;
    selectedTimingPointId: string;
    selectedNoteId: string | null;
    currentTimeMs: number;
    playbackRate: ChartPlaybackRate;
    snapDivisor: number;
    metronomeEnabled: boolean;
    changeSerial: number;
    persistedSerial: number;
    saveStatus: ChartSaveStatus;
    saveMessage: string | null;
    lastSavedAt: Date | null;
    undoStack: HistoryEntry[];
    redoStack: HistoryEntry[];
    selectTimingPoint: (id: string) => void;
    selectNote: (id: string | null) => void;
    setCurrentTimeMs: (timeMs: number) => void;
    setPlaybackRate: (rate: ChartPlaybackRate) => void;
    setSnapDivisor: (divisor: number) => void;
    setMetronomeEnabled: (enabled: boolean) => void;
    replaceTimingPoints: (points: ChartTimingPoint[]) => void;
    replaceNotes: (notes: ChartNote[], selectedNoteId?: string | null) => void;
    replaceDocument: (document: ChartDocument) => void;
    setDurationMs: (durationMs: number) => void;
    undo: () => void;
    redo: () => void;
    markSaving: () => void;
    markSaveSuccess: (input: {
        draftVersion: number;
        savedRevision?: number;
        publishedRevision?: number | null;
        persistedSerial: number;
        message: string;
    }) => void;
    markSaveError: (message: string) => void;
}

interface CreateChartEditorStoreInput {
    document: ChartDocument;
    draftVersion: number;
    savedRevision: number;
    publishedRevision: number | null;
    updatedAt: Date | null;
}

function pushHistory(stack: HistoryEntry[], entry: HistoryEntry) {
    return [...stack.slice(-99), entry];
}

function applyHistoryDocument(
    current: ChartDocument,
    entry: HistoryEntry,
    direction: "before" | "after"
) {
    if (entry.kind === "document") return entry[direction];
    if (entry.kind === "notes") {
        return {
            ...current,
            notes: entry[direction],
        };
    }
    return {
        ...current,
        timingPoints: entry[direction],
    };
}

function createChartEditorStore(input: CreateChartEditorStoreInput) {
    return createStore<ChartEditorState>((set, get) => ({
        document: input.document,
        draftVersion: input.draftVersion,
        savedRevision: input.savedRevision,
        publishedRevision: input.publishedRevision,
        selectedTimingPointId: input.document.timingPoints[0].id,
        selectedNoteId: null,
        currentTimeMs: Math.max(0, input.document.timingPoints[0]?.timeMs ?? 0),
        playbackRate: 1,
        snapDivisor: 4,
        metronomeEnabled: false,
        changeSerial: 0,
        persistedSerial: 0,
        saveStatus: "idle",
        saveMessage: null,
        lastSavedAt: input.updatedAt,
        undoStack: [],
        redoStack: [],
        selectTimingPoint: (id) => set({ selectedTimingPointId: id }),
        selectNote: (id) => set({ selectedNoteId: id }),
        setCurrentTimeMs: (timeMs) =>
            set((state) => ({
                currentTimeMs: Math.min(
                    Math.max(0, timeMs),
                    Math.max(state.document.durationMs, 0)
                ),
            })),
        setPlaybackRate: (playbackRate) => set({ playbackRate }),
        setSnapDivisor: (snapDivisor) => set({ snapDivisor }),
        setMetronomeEnabled: (metronomeEnabled) => set({ metronomeEnabled }),
        replaceTimingPoints: (points) => {
            const state = get();
            const next = sortTimingPoints(points);
            if (
                JSON.stringify(state.document.timingPoints) ===
                JSON.stringify(next)
            ) {
                return;
            }
            set({
                document: { ...state.document, timingPoints: next },
                changeSerial: state.changeSerial + 1,
                saveStatus: "idle",
                saveMessage: null,
                undoStack: pushHistory(state.undoStack, {
                    kind: "timing",
                    before: state.document.timingPoints,
                    after: next,
                }),
                redoStack: [],
            });
        },
        replaceNotes: (notes, selectedNoteId) => {
            const state = get();
            if (
                JSON.stringify(state.document.notes) === JSON.stringify(notes)
            ) {
                if (selectedNoteId !== undefined) {
                    set({ selectedNoteId });
                }
                return;
            }
            set({
                document: { ...state.document, notes },
                selectedNoteId:
                    selectedNoteId === undefined
                        ? state.selectedNoteId
                        : selectedNoteId,
                changeSerial: state.changeSerial + 1,
                saveStatus: "idle",
                saveMessage: null,
                undoStack: pushHistory(state.undoStack, {
                    kind: "notes",
                    before: state.document.notes,
                    after: notes,
                }),
                redoStack: [],
            });
        },
        replaceDocument: (document) => {
            const state = get();
            set({
                document,
                selectedTimingPointId: document.timingPoints[0].id,
                selectedNoteId: null,
                currentTimeMs: Math.min(
                    state.currentTimeMs,
                    document.durationMs
                ),
                changeSerial: state.changeSerial + 1,
                saveStatus: "idle",
                saveMessage: null,
                undoStack: pushHistory(state.undoStack, {
                    kind: "document",
                    before: state.document,
                    after: document,
                }),
                redoStack: [],
            });
        },
        setDurationMs: (durationMs) => {
            const state = get();
            const rounded = Math.max(0, Math.round(durationMs));
            if (state.document.durationMs === rounded) return;
            const next = { ...state.document, durationMs: rounded };
            set({
                document: next,
                changeSerial: state.changeSerial + 1,
                saveStatus: "idle",
                saveMessage: null,
                undoStack: pushHistory(state.undoStack, {
                    kind: "document",
                    before: state.document,
                    after: next,
                }),
                redoStack: [],
            });
        },
        undo: () => {
            const state = get();
            const entry = state.undoStack.at(-1);
            if (!entry) return;
            set({
                document: applyHistoryDocument(state.document, entry, "before"),
                selectedNoteId: null,
                changeSerial: state.changeSerial + 1,
                saveStatus: "idle",
                saveMessage: null,
                undoStack: state.undoStack.slice(0, -1),
                redoStack: pushHistory(state.redoStack, entry),
            });
        },
        redo: () => {
            const state = get();
            const entry = state.redoStack.at(-1);
            if (!entry) return;
            set({
                document: applyHistoryDocument(state.document, entry, "after"),
                selectedNoteId: null,
                changeSerial: state.changeSerial + 1,
                saveStatus: "idle",
                saveMessage: null,
                undoStack: pushHistory(state.undoStack, entry),
                redoStack: state.redoStack.slice(0, -1),
            });
        },
        markSaving: () =>
            set({
                saveStatus: "saving",
                saveMessage: "저장 중...",
            }),
        markSaveSuccess: ({
            draftVersion,
            savedRevision,
            publishedRevision,
            persistedSerial,
            message,
        }) =>
            set((state) => ({
                draftVersion,
                savedRevision: savedRevision ?? state.savedRevision,
                publishedRevision:
                    publishedRevision === undefined
                        ? state.publishedRevision
                        : publishedRevision,
                persistedSerial: Math.max(
                    state.persistedSerial,
                    persistedSerial
                ),
                saveStatus: "saved",
                saveMessage: message,
                lastSavedAt: new Date(),
            })),
        markSaveError: (message) =>
            set({
                saveStatus: "error",
                saveMessage: message,
            }),
    }));
}

const ChartEditorStoreContext =
    createContext<StoreApi<ChartEditorState> | null>(null);

export function ChartEditorStoreProvider({
    children,
    initialState,
}: {
    children: ReactNode;
    initialState: CreateChartEditorStoreInput;
}) {
    const [store] = useState(() => createChartEditorStore(initialState));

    return (
        <ChartEditorStoreContext.Provider value={store}>
            {children}
        </ChartEditorStoreContext.Provider>
    );
}

export function useChartEditorStore<T>(
    selector: (state: ChartEditorState) => T
) {
    const store = useContext(ChartEditorStoreContext);
    if (!store) {
        throw new Error(
            "useChartEditorStore must be used inside ChartEditorStoreProvider"
        );
    }
    return useStore(store, selector);
}

export function useChartEditorStoreApi() {
    const store = useContext(ChartEditorStoreContext);
    if (!store) {
        throw new Error(
            "useChartEditorStoreApi must be used inside ChartEditorStoreProvider"
        );
    }
    return store;
}
