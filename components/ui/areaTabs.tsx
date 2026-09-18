"use client";

import * as Tabs from "@radix-ui/react-tabs";
import { useEffect, useId, useRef } from "react";
import type { ReactNode } from "react";

/**
 * 페이지 안 큰 구역을 바꾸는 1단 밑줄 탭(악곡 상세). 항목이 줄 폭을 나눠 채우고(2026-09-16), 모든 폭에서 탭이며 넘치면 가로로 스크롤한다 —
 * 높이 48 · 콘텐츠 폭 전체 구분선 · 글자와 밑줄은 2단 메트릭 탭과 같은 공용 `nl-tabs`. 부품 결정 ② (2026-09-14)
 */
export default function AreaTabs<Value extends string>({
    value,
    options,
    onValueChange,
    label,
    children,
    busy = false,
}: {
    value: Value;
    options: readonly { value: Value; label: ReactNode }[];
    onValueChange: (value: Value) => void;
    label: string;
    children: ReactNode;
    busy?: boolean;
}) {
    const id = useId();
    const list = useRef<HTMLDivElement>(null);
    // 선택된 탭이 가로 스크롤 밖에 있으면 보이는 곳으로 옮긴다 — 페이지는 세로로 움직이지 않는다
    useEffect(() => {
        const row = list.current;
        const active = row?.querySelector<HTMLElement>('[data-state="active"]');
        if (!row || !active) return;
        const left = active.offsetLeft;
        const right = left + active.offsetWidth;
        if (left < row.scrollLeft) row.scrollLeft = left;
        else if (right > row.scrollLeft + row.clientWidth)
            row.scrollLeft = right - row.clientWidth;
    }, [value]);
    return (
        <Tabs.Root
            value={value}
            activationMode="manual"
            onValueChange={(next) => onValueChange(next as Value)}
            className="nl-area"
        >
            <Tabs.List
                ref={list}
                className="nl-tabs nl-tabs--primary"
                aria-label={label}
            >
                {options.map((option) => (
                    <Tabs.Trigger
                        key={option.value}
                        value={option.value}
                        id={`${id}-tab-${option.value}`}
                        aria-controls={id}
                        className="nl-tabs__item nl-control"
                    >
                        {option.label}
                    </Tabs.Trigger>
                ))}
            </Tabs.List>
            <Tabs.Content
                value={value}
                id={id}
                aria-labelledby={`${id}-tab-${value}`}
                className="nl-area__panel"
                aria-busy={busy || undefined}
            >
                {children}
            </Tabs.Content>
        </Tabs.Root>
    );
}
