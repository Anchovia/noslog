"use client";

import { useEffect, useState } from "react";

/** box: 「border-box」 면 안쪽 여백 · 테두리까지 잰다(툴팁처럼 자기 폭으로 자리를 잡을 때) */
export default function useElementWidth<Element extends HTMLElement>(
    box: ResizeObserverBoxOptions = "content-box"
) {
    const [element, setElement] = useState<Element | null>(null);
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);
    useEffect(() => {
        if (!element) return;
        const observer = new ResizeObserver(([entry]) => {
            const size = box === "border-box" ? entry.borderBoxSize?.[0] : null;
            setWidth(size ? size.inlineSize : entry.contentRect.width);
            setHeight(size ? size.blockSize : entry.contentRect.height);
        });
        observer.observe(element, { box });
        return () => observer.disconnect();
    }, [element, box]);
    return { ref: setElement, width, height };
}
