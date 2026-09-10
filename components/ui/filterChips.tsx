"use client";

import { Check } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface FilterChipOption<Value extends string> {
    value: Value;
    label: ReactNode;
    /** 항목 옆 보조 수치(개수 등) — metadata 로 그린다 */
    count?: ReactNode;
    disabled?: boolean;
    /** 난이도 색 글자(DU-01 텍스트 램프). 선택되면 중립으로 돌아간다 */
    tone?: "normal" | "hard" | "expert" | "real";
}

/**
 * 짧은 열거를 고르는 토글 칩 (Material 3 filter chip 형태).
 * 높이 36 · 선택 = surface/raised + border/strong + 체크 16 + 굵기(세그먼트 선택 언어 재사용).
 * multiple=false 면 라디오처럼 하나만 유지하고, 선택된 것을 다시 눌러도 해제되지 않는다.
 */
export default function FilterChips<Value extends string>({
    label,
    options,
    value,
    onValueChange,
    multiple = true,
    className,
}: {
    label: string;
    options: readonly FilterChipOption<Value>[];
    value: readonly Value[];
    onValueChange: (values: Value[]) => void;
    multiple?: boolean;
    className?: string;
    /** SelectionList 와 같은 자리에서 쓰기 위한 호환 속성 — 칩은 항상 aria-label 만 쓰므로 무시한다 */
    hideLabel?: boolean;
}) {
    return (
        <div
            role="group"
            aria-label={label}
            className={cn("nl-chips", className)}
        >
            {options.map((option) => {
                const selected = value.includes(option.value);
                return (
                    <button
                        key={option.value}
                        type="button"
                        className="nl-chip nl-control"
                        aria-pressed={selected}
                        disabled={option.disabled}
                        data-tone={option.tone}
                        onClick={() => {
                            if (multiple)
                                onValueChange(
                                    selected
                                        ? value.filter(
                                              (item) => item !== option.value
                                          )
                                        : [...value, option.value]
                                );
                            else if (!selected) onValueChange([option.value]);
                        }}
                    >
                        {selected ? (
                            <Check className="nl-icon-small" aria-hidden />
                        ) : null}
                        <span>{option.label}</span>
                        {option.count !== undefined ? (
                            <span className="nl-chip__count nl-metadata">
                                {option.count}
                            </span>
                        ) : null}
                    </button>
                );
            })}
        </div>
    );
}
