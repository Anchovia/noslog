"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import type { ReactNode } from "react";

/**
 * 주소가 다른 구역을 잇는 1단 밑줄 탭(프로필 구역 탭, 2026-09-25) — 모양은 AreaTabs 와 같고(높이 48 · 항목이 줄 폭을 나눔 ·
 * 넘치면 가로 스크롤) 항목이 링크다. 선택 = aria-current="page". 탭 내용은 각 주소의 페이지가 그린다
 */
export default function AreaTabLinks({
    label,
    options,
}: {
    label: string;
    options: readonly {
        key: string;
        label: ReactNode;
        href: string;
        selected: boolean;
    }[];
}) {
    const row = useRef<HTMLElement>(null);
    const selected = options.find((option) => option.selected)?.key;
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
        <nav ref={row} aria-label={label} className="nl-tabs nl-tabs--primary">
            {options.map((option) => (
                <Link
                    key={option.key}
                    href={option.href}
                    scroll={false}
                    aria-current={option.selected ? "page" : undefined}
                    className="nl-tabs__item nl-control"
                >
                    {option.label}
                </Link>
            ))}
        </nav>
    );
}
