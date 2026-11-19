"use client";

import type { TransitionEvent } from "react";
import { useState } from "react";

/**
 * 열 때만 그리는 펼침 판(`nl-disclosure-panel`)이 닫히는 움직임을 마칠 때까지 남아 있게 한다(disclosure.css ⑦).
 * 닫으면 `hidden` 으로 접고, 높이가 0 이 된 뒤에 지운다. 동작 줄이기(0ms)면 transitionend 가 없어 숨긴 채 남는다
 */
export default function useDisclosurePresence(open: boolean) {
    const [mounted, setMounted] = useState(open);
    if (open && !mounted) setMounted(true);
    // 끝에서 display 가 none 으로 바뀌면 브라우저가 높이 움직임을 transitionend 대신 transitioncancel 로 끝낸다
    const settle = (event: TransitionEvent<HTMLElement>) => {
        if (
            !open &&
            event.target === event.currentTarget &&
            event.propertyName === "height"
        )
            setMounted(false);
    };
    return {
        mounted,
        panelProps: {
            hidden: !open,
            onTransitionEnd: settle,
            onTransitionCancel: settle,
        },
    };
}
