"use client";

import type { ReactNode } from "react";
import { useEffect, useRef } from "react";

import IntentLink from "@/components/ui/intent-link";
import { cn } from "@/lib/cn";
import useTabIndicator from "@/lib/hooks/use-tab-indicator";

/**
 * 주소가 다른 구역을 잇는 1단 밑줄 탭(프로필 구역 탭, 2026-09-25) — 모양은 AreaTabs 와 같고(높이 48 · 항목이 줄 폭을 나눔 ·
 * 넘치면 가로 스크롤) 항목이 링크다. 선택 = aria-current="page". 탭 내용은 각 주소의 페이지가 그린다
 */
export default function AreaTabLinks({
    label,
    options,
    fit = false,
}: {
    label: string;
    /** 1056 이상에서 항목을 글자 폭으로(프로필 머리 한 줄). 기본은 줄 폭 균등 */
    fit?: boolean;
    options: readonly {
        key: string;
        label: ReactNode;
        href: string;
        selected: boolean;
    }[];
}) {
    const row = useRef<HTMLElement>(null);
    const selected = options.find((option) => option.selected)?.key;
    useTabIndicator(row, selected);
    // 고른 탭이 가로 스크롤 밖에 있으면 보이는 곳으로 — 페이지는 세로로 움직이지 않는다(AreaTabs 와 같음)
    useEffect(() => {
        const list = row.current;
        const active = list?.querySelector<HTMLElement>(
            '[aria-current="page"]'
        );
        if (!list || !active) return;
        const left = active.offsetLeft;
        const right = left + active.offsetWidth;
        if (left < list.scrollLeft) list.scrollLeft = left;
        else if (right > list.scrollLeft + list.clientWidth)
            list.scrollLeft = right - list.clientWidth;
    }, [selected]);
    return (
        <nav
            ref={row}
            aria-label={label}
            className={cn("nl-tabs nl-tabs--primary", fit && "nl-tabs--fit")}
        >
            {options.map((option) => (
                <IntentLink
                    key={option.key}
                    href={option.href}
                    scroll={false}
                    aria-current={option.selected ? "page" : undefined}
                    className="nl-tabs__item nl-control"
                >
                    {option.label}
                </IntentLink>
            ))}
        </nav>
    );
}
