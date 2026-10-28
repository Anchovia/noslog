"use client";

import { useEffect, useRef, useState } from "react";

/**
 * 위치 지도는 화면 가까이(200px) 올 때 만든다 — 아래쪽에 있어 안 보는 방문에도 지도 SDK · 지도 · 통계 신호가 나가지 않게(2026-10-15 S14).
 * 그 전에는 지도와 같은 상자(nl-arcade-map)로 자리를 지킨다
 */
export default function LazyLocationMap({
    children,
}: {
    children: React.ReactNode;
}) {
    const placeholder = useRef<HTMLDivElement>(null);
    const [near, setNear] = useState(false);
    useEffect(() => {
        const element = placeholder.current;
        if (near || !element) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setNear(true);
                    observer.disconnect();
                }
            },
            { rootMargin: "200px 0px" }
        );
        observer.observe(element);
        return () => observer.disconnect();
    }, [near]);
    return near ? (
        children
    ) : (
        <div ref={placeholder} className="nl-arcade-map" aria-hidden />
    );
}
