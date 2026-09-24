"use client";

import { type RefObject, useCallback, useEffect, useState } from "react";

/** off = 보통 · native = 브라우저 전체화면 · fill = 화면 채우기(요소 전체화면이 없는 iPhone Safari 대신) */
export type FullscreenMode = "off" | "native" | "fill";

/**
 * 채보 뷰어 전체화면(2026-09-25 B1) — 낙하형 무대 · 전체 악보 띠가 같이 쓴다.
 * 브라우저 전체화면(Fullscreen API)을 먼저 쓰고, 없으면 화면을 채우는 고정 배치로 대신한다(Esc 로 나감).
 */
export function useFullscreen(ref: RefObject<HTMLElement | null>) {
    const [mode, setMode] = useState<FullscreenMode>("off");

    useEffect(() => {
        const sync = () => {
            if (document.fullscreenElement === ref.current) return;
            setMode((current) => (current === "native" ? "off" : current));
        };
        document.addEventListener("fullscreenchange", sync);
        return () => document.removeEventListener("fullscreenchange", sync);
    }, [ref]);

    // 화면 채우기는 브라우저가 Esc 를 잡아 주지 않는다 — 직접 닫고, 뒤 페이지 스크롤을 막는다
    useEffect(() => {
        if (mode !== "fill") return;
        const close = (event: KeyboardEvent) => {
            if (event.key === "Escape") setMode("off");
        };
        const overflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        window.addEventListener("keydown", close);
        return () => {
            document.body.style.overflow = overflow;
            window.removeEventListener("keydown", close);
        };
    }, [mode]);

    const toggle = useCallback(async () => {
        const element = ref.current;
        if (!element) return;
        if (mode === "native") {
            await document.exitFullscreen().catch(() => undefined);
            setMode("off");
            return;
        }
        if (mode === "fill") {
            setMode("off");
            return;
        }
        if (typeof element.requestFullscreen === "function") {
            try {
                await element.requestFullscreen();
                setMode("native");
                return;
            } catch {
                // 막히면(권한 · 브라우저) 화면 채우기로
            }
        }
        setMode("fill");
    }, [mode, ref]);

    return { mode, active: mode !== "off", toggle };
}
