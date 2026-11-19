"use client";

import type { RefObject } from "react";
import { useLayoutEffect } from "react";

const ACTIVE_TAB =
    ':scope > :is([data-state="active"], [aria-pressed="true"], [aria-current="page"])';

/**
 * 밑줄 탭(`nl-tabs`)의 고른 표시선을 줄 하나로 그려, 고른 탭이 바뀌면 그 자리로 옮겨 가게 한다(tabs.css).
 * 고른 탭의 왼쪽 · 폭을 재서 줄에 넘긴다. 탭 폭이 글자 폭이라 소수점이 생겨 offset 값 대신 실제 상자로 잰다
 */
export default function useTabIndicator(
    list: RefObject<HTMLElement | null>,
    selected: unknown
) {
    useLayoutEffect(() => {
        const row = list.current;
        if (!row) return;
        function place() {
            if (!row) return;
            const active = row.querySelector<HTMLElement>(ACTIVE_TAB);
            if (!active) {
                row.removeAttribute("data-indicator");
                return;
            }
            const rowBox = row.getBoundingClientRect();
            const box = active.getBoundingClientRect();
            row.style.setProperty(
                "--nl-tabs-indicator-x",
                `${box.left - rowBox.left + row.scrollLeft}px`
            );
            row.style.setProperty(
                "--nl-tabs-indicator-width",
                `${box.width}px`
            );
            row.setAttribute("data-indicator", "");
        }
        place();
        // 줄 폭 · 글자 폭이 바뀌면(글꼴 받기 · 창 크기) 다시 잰다
        const observer = new ResizeObserver(place);
        observer.observe(row);
        Array.from(row.children).forEach((item) => observer.observe(item));
        return () => observer.disconnect();
    }, [list, selected]);
}
