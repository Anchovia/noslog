"use client";

import { useCallback, useSyncExternalStore } from "react";

export default function useMediaQuery(query: string) {
    const subscribe = useCallback(
        (onChange: () => void) => {
            const media = window.matchMedia(query);
            media.addEventListener("change", onChange);
            return () => media.removeEventListener("change", onChange);
        },
        [query]
    );
    const getSnapshot = useCallback(
        () => window.matchMedia(query).matches,
        [query]
    );
    return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
