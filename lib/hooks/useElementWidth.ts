"use client";

import { useEffect, useState } from "react";

export default function useElementWidth<Element extends HTMLElement>() {
    const [element, setElement] = useState<Element | null>(null);
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);
    useEffect(() => {
        if (!element) return;
        const observer = new ResizeObserver(([entry]) => {
            setWidth(entry.contentRect.width);
            setHeight(entry.contentRect.height);
        });
        observer.observe(element);
        return () => observer.disconnect();
    }, [element]);
    return { ref: setElement, width, height };
}
