"use client";

import { useRef, useState } from "react";

/** 트리거를 다시 눌러 닫은 직후 같은 누름이 다시 여는 것을 무시하는 시간 */
const REOPEN_GUARD_MS = 200;

/**
 * 셀렉트 열림 상태(2026-10-01 사용자) — 열린 채로 트리거를 누르면 닫히고 끝나야 한다.
 * Radix 는 「바깥 누름으로 닫기」 와 「트리거 누름으로 열기」 가 같은 누름에서 잇달아 일어나
 * 목록이 깜빡이며 다시 열린다. 닫힌 직후 잠깐은 열기 요청을 받지 않는다.
 */
export function useSelectOpen() {
    const [open, setOpen] = useState(false);
    const closedAt = useRef(0);
    return {
        open,
        onOpenChange: (next: boolean) => {
            if (next && Date.now() - closedAt.current < REOPEN_GUARD_MS) return;
            if (!next) closedAt.current = Date.now();
            setOpen(next);
        },
    };
}
