"use client";

import { Minus, Plus } from "lucide-react";

import { cn } from "@/lib/cn";

/**
 * 숫자 스테퍼(2026-10-21 전면 대조 ⑩ — Apple 스테퍼 · 대수처럼 작은 정수) — − · 값(+ 단위) · + 한 줄.
 * 높이 = 컨트롤 높이, 버튼 = 정사각, 경계 = 입력칸 선 · 모서리 4. 값 바뀜은 화면 읽기에 알린다
 */
export default function Stepper({
    value,
    onValueChange,
    min = 0,
    max = Number.POSITIVE_INFINITY,
    unit,
    decrementLabel,
    incrementLabel,
    disabled = false,
    className,
    "aria-labelledby": labelledBy,
}: {
    value: number;
    onValueChange: (value: number) => void;
    min?: number;
    max?: number;
    /** 값 뒤 단위(대 · 개) */
    unit?: string;
    decrementLabel: string;
    incrementLabel: string;
    disabled?: boolean;
    className?: string;
    "aria-labelledby"?: string;
}) {
    return (
        <div
            className={cn("nl-stepper", className)}
            role="group"
            aria-labelledby={labelledBy}
            data-disabled={disabled || undefined}
        >
            <button
                type="button"
                className="nl-stepper__button"
                aria-label={decrementLabel}
                disabled={disabled || value <= min}
                onClick={() => onValueChange(Math.max(min, value - 1))}
            >
                <Minus className="nl-icon" aria-hidden />
            </button>
            <output className="nl-stepper__value nl-body" aria-live="polite">
                {value}
                {unit}
            </output>
            <button
                type="button"
                className="nl-stepper__button"
                aria-label={incrementLabel}
                disabled={disabled || value >= max}
                onClick={() => onValueChange(Math.min(max, value + 1))}
            >
                <Plus className="nl-icon" aria-hidden />
            </button>
        </div>
    );
}
