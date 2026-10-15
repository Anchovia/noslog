"use client";

import Link from "next/link";
import { type ComponentProps, useState } from "react";

/**
 * 손이 갈 때(가리킴 · 포커스 · 터치)만 프리패치하는 링크(2026-10-15 D3).
 * 기본 Link 는 화면에 보이기만 해도 링크마다 서버를 부른다 — 헤더 · 목록처럼 링크가 많은 곳에 쓴다.
 * Next 문서 「Hover-triggered prefetch」 방식: 손이 가기 전에는 prefetch={false}, 그 뒤에는 원래 값(기본 null)
 */
export default function IntentLink({
    prefetch,
    onPointerEnter,
    onFocus,
    onTouchStart,
    ...props
}: ComponentProps<typeof Link>) {
    const [intent, setIntent] = useState(false);
    return (
        <Link
            {...props}
            prefetch={intent ? (prefetch ?? null) : false}
            onPointerEnter={(event) => {
                setIntent(true);
                onPointerEnter?.(event);
            }}
            onFocus={(event) => {
                setIntent(true);
                onFocus?.(event);
            }}
            onTouchStart={(event) => {
                setIntent(true);
                onTouchStart?.(event);
            }}
        />
    );
}
