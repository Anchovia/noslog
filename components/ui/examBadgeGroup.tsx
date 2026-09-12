"use client";

import { useLayoutEffect, useRef, useState, type ReactNode } from "react";

// 모드 이름(BASIC·RECITAL)은 칸에 다 들어갈 때만 쓰고 아니면 이니셜(B·R)로 줄인다.
// 칸 폭이 위치·로케일·폰트마다 달라 고정 임계값 대신 실제 폭을 잰다.
// 서버 렌더는 이니셜로 시작해 넓은 칸에서만 단어로 바뀐다 — 줄바꿈으로 높이가 튀지 않게.
export default function ExamBadgeGroup({
    className,
    children,
}: {
    className: string;
    children: ReactNode;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const [label, setLabel] = useState<"full" | "short">("short");
    useLayoutEffect(() => {
        const element = ref.current;
        if (!element) return;
        const measure = () => {
            const badges = [
                ...element.querySelectorAll<HTMLElement>(".nl-exam-badge"),
            ];
            const gap = parseFloat(getComputedStyle(element).columnGap) || 0;
            let needed = gap * Math.max(badges.length - 1, 0);
            for (const badge of badges) {
                needed += badge.getBoundingClientRect().width;
                const full = badge.querySelector<HTMLElement>(
                    ".nl-exam-badge__full"
                );
                const short = badge.querySelector<HTMLElement>(
                    ".nl-exam-badge__short"
                );
                if (full && short && element.dataset.examLabel !== "full")
                    needed +=
                        full.getBoundingClientRect().width -
                        short.getBoundingClientRect().width;
            }
            setLabel(needed <= element.clientWidth ? "full" : "short");
        };
        measure();
        const observer = new ResizeObserver(measure);
        observer.observe(element);
        void document.fonts?.ready.then(measure);
        return () => observer.disconnect();
    }, []);
    return (
        <div ref={ref} className={className} data-exam-label={label}>
            {children}
        </div>
    );
}
