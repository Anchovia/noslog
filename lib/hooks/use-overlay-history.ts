"use client";

import { useEffect, useEffectEvent, useId } from "react";

/**
 * 전체 화면 레이어의 뒤로 가기 닫기(U2 · 2026-09-23) — 열 때 기록을 하나 쌓고, 뒤로 가기를 그 레이어를 닫는 데 쓴다.
 * 주소는 그대로 두므로 링크 공유는 하지 않는다. 전체 화면 창 · 사진 뷰어가 같이 쓴다
 */
export default function useOverlayHistory(open: boolean, onClose: () => void) {
    const historyId = useId();
    const closeFromHistory = useEffectEvent(() => onClose());
    useEffect(() => {
        if (!open) return;
        window.history.pushState(
            { ...window.history.state, noslogOverlay: historyId },
            ""
        );
        const handleBack = () => {
            if (window.history.state?.noslogOverlay !== historyId)
                closeFromHistory();
        };
        window.addEventListener("popstate", handleBack);
        return () => {
            window.removeEventListener("popstate", handleBack);
            if (window.history.state?.noslogOverlay === historyId)
                window.history.back();
        };
    }, [open, historyId]);
}
