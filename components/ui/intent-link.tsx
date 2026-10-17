"use client";

import Link from "next/link";
import { type ComponentProps, useEffect, useState } from "react";

import { createHoverIntent } from "@/lib/hover-intent";

// 마우스를 이만큼 올려 둬야 미리 불러온다 — React Router intent · Turbo · htmx 와 같은 100ms(2026-10-17 B)
export const INTENT_HOVER_DELAY_MS = 100;

/**
 * 손이 갈 때만 프리패치하는 링크(2026-10-15 D3 → 2026-10-17 B).
 * 기본 Link 는 화면에 보이기만 해도 링크마다 서버를 부른다 — 동적 페이지라 그때마다 서버 함수가 돈다.
 * - 마우스: 링크 위에 100ms 머물면. 떠나거나 그동안 스크롤되면 취소(휠로 지나가는 줄은 받지 않음)
 * - 키보드: 포커스가 보일 때(:focus-visible) 바로. 마우스로 누를 때 생기는 포커스는 이동과 겹쳐 받지 않음
 * - 터치: 받지 않음 — 손가락 스크롤도 터치 시작으로 잡혀서(탭하면 그때 이동이 시작된다)
 */
export default function IntentLink({
    prefetch,
    onPointerEnter,
    onPointerLeave,
    onFocus,
    ...props
}: ComponentProps<typeof Link>) {
    const [intent, setIntent] = useState(false);
    // 렌더마다 새로 만들지 않는 한 벌 — 스크롤 리스너를 붙인 함수와 떼는 함수가 같아야 한다
    const [hover] = useState(() => {
        const cancel = () => {
            intentTimer.cancel();
            window.removeEventListener("scroll", cancel, true);
        };
        const intentTimer = createHoverIntent(INTENT_HOVER_DELAY_MS, () => {
            window.removeEventListener("scroll", cancel, true);
            setIntent(true);
        });
        return { enter: intentTimer.enter, cancel };
    });
    useEffect(() => hover.cancel, [hover]);

    return (
        <Link
            {...props}
            prefetch={intent ? (prefetch ?? null) : false}
            onPointerEnter={(event) => {
                onPointerEnter?.(event);
                if (intent || !hover.enter(event.pointerType)) return;
                window.addEventListener("scroll", hover.cancel, {
                    capture: true,
                    passive: true,
                });
            }}
            onPointerLeave={(event) => {
                onPointerLeave?.(event);
                hover.cancel();
            }}
            onFocus={(event) => {
                onFocus?.(event);
                if (!intent && event.currentTarget.matches(":focus-visible")) {
                    setIntent(true);
                }
            }}
        />
    );
}
