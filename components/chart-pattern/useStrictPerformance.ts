"use client";

import { useCallback, useSyncExternalStore } from "react";

const STRICT_PERFORMANCE_STORAGE_KEY = "noslog-strict-performance-enabled";
const STRICT_PERFORMANCE_CHANGE_EVENT = "noslog-strict-performance-change";

function subscribe(onStoreChange: () => void) {
    window.addEventListener("storage", onStoreChange);
    window.addEventListener(STRICT_PERFORMANCE_CHANGE_EVENT, onStoreChange);
    return () => {
        window.removeEventListener("storage", onStoreChange);
        window.removeEventListener(
            STRICT_PERFORMANCE_CHANGE_EVENT,
            onStoreChange
        );
    };
}

function getSnapshot() {
    return (
        window.localStorage.getItem(STRICT_PERFORMANCE_STORAGE_KEY) === "true"
    );
}

function getServerSnapshot() {
    return false;
}

export function useStrictPerformance() {
    const enabled = useSyncExternalStore(
        subscribe,
        getSnapshot,
        getServerSnapshot
    );
    const setEnabled = useCallback((nextEnabled: boolean) => {
        window.localStorage.setItem(
            STRICT_PERFORMANCE_STORAGE_KEY,
            String(nextEnabled)
        );
        window.dispatchEvent(new Event(STRICT_PERFORMANCE_CHANGE_EVENT));
    }, []);

    return [enabled, setEnabled] as const;
}
