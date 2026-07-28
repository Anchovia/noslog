"use client";

import { useCallback, useSyncExternalStore } from "react";

import {
    DEFAULT_METRONOME_VOLUME,
    METRONOME_VOLUME_STORAGE_KEY,
    normalizeMetronomeVolume,
} from "@/lib/chart-pattern/metronome";

const METRONOME_VOLUME_CHANGE_EVENT = "noslog-metronome-volume-change";

function subscribe(onStoreChange: () => void) {
    window.addEventListener("storage", onStoreChange);
    window.addEventListener(METRONOME_VOLUME_CHANGE_EVENT, onStoreChange);
    return () => {
        window.removeEventListener("storage", onStoreChange);
        window.removeEventListener(
            METRONOME_VOLUME_CHANGE_EVENT,
            onStoreChange
        );
    };
}

function getSnapshot() {
    const stored = window.localStorage.getItem(METRONOME_VOLUME_STORAGE_KEY);
    if (stored === null) return DEFAULT_METRONOME_VOLUME;
    return normalizeMetronomeVolume(Number(stored));
}

function getServerSnapshot() {
    return DEFAULT_METRONOME_VOLUME;
}

export function useMetronomeVolume() {
    const volume = useSyncExternalStore(
        subscribe,
        getSnapshot,
        getServerSnapshot
    );
    const setVolume = useCallback((nextVolume: number) => {
        window.localStorage.setItem(
            METRONOME_VOLUME_STORAGE_KEY,
            String(normalizeMetronomeVolume(nextVolume))
        );
        window.dispatchEvent(new Event(METRONOME_VOLUME_CHANGE_EVENT));
    }, []);

    return [volume, setVolume] as const;
}
