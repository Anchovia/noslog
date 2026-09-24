/**
 * 뷰어 재생 위치를 뷰어 밖(채보 의견 쓰기 칸)과 나누는 작은 저장소 — 재생 중 60ms 마다 바뀌므로
 * 부모 상태로 올리지 않고 필요한 곳만 구독한다(useSyncExternalStore).
 */
export interface PlaybackClock {
    get: () => number;
    set: (timeMs: number) => void;
    subscribe: (listener: () => void) => () => void;
}

export function createPlaybackClock(initialMs = 0): PlaybackClock {
    let value = initialMs;
    const listeners = new Set<() => void>();
    return {
        get: () => value,
        set: (timeMs) => {
            if (timeMs === value) return;
            value = timeMs;
            for (const listener of listeners) listener();
        },
        subscribe: (listener) => {
            listeners.add(listener);
            return () => listeners.delete(listener);
        },
    };
}

/** 의견 시각 「0:42.3」 — 0.1초 단위(주소 `?t=42.3` 과 같은 정밀도) */
export function formatCommentTime(timeMs: number) {
    const tenths = Math.max(0, Math.round(timeMs / 100));
    const minutes = Math.floor(tenths / 600);
    const seconds = Math.floor((tenths % 600) / 10);
    return `${minutes}:${String(seconds).padStart(2, "0")}.${tenths % 10}`;
}

/** 주소 `?t=` (초, 소수 한 자리까지) → ms. 숫자가 아니거나 음수면 null */
export function parseTimeParam(value: string | null | undefined) {
    if (!value) return null;
    const seconds = Number(value);
    if (!Number.isFinite(seconds) || seconds < 0) return null;
    return Math.round(seconds * 1000);
}

export function timeParam(timeMs: number) {
    return String(Math.round(timeMs / 100) / 10);
}
