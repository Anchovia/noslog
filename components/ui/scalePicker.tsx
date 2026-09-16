"use client";

import { useRef } from "react";
import type { KeyboardEvent, Ref } from "react";

import { cn } from "@/lib/utils";

/**
 * 숫자 척도 고르기 — 0 ~ 4 같은 짧은 척도를 숫자 버튼 한 줄로 (2026-09-17 · Tally · Jotform · Typeform 형).
 * 버튼 = 컨트롤 M 정사각 · 모서리 8 · 사이 8(375 미만 4), 숫자는 버튼 안. 고른 값은 주 버튼 면 + 어두운 글자.
 * 같은 값을 다시 누르면 해제(값 없음). 라디오 묶음 — 방향키로 이동하며 고르고, 고른 값(없으면 첫 값)만 탭 순서에 든다.
 */
export default function ScalePicker({
    labelId,
    value,
    onChange,
    onBlur,
    disabled,
    min = 0,
    max = 4,
    inputRef,
}: {
    labelId: string;
    value: number | null;
    onChange: (value: number | null) => void;
    onBlur?: () => void;
    disabled?: boolean;
    min?: number;
    max?: number;
    inputRef?: Ref<HTMLDivElement>;
}) {
    const buttons = useRef<(HTMLButtonElement | null)[]>([]);
    const steps = Array.from(
        { length: max - min + 1 },
        (_, index) => min + index
    );
    const focusable = value ?? min;
    const move = (event: KeyboardEvent<HTMLButtonElement>, step: number) => {
        const next =
            event.key === "ArrowRight" || event.key === "ArrowDown"
                ? Math.min(max, step + 1)
                : event.key === "ArrowLeft" || event.key === "ArrowUp"
                  ? Math.max(min, step - 1)
                  : event.key === "Home"
                    ? min
                    : event.key === "End"
                      ? max
                      : null;
        if (next === null) return;
        event.preventDefault();
        onChange(next);
        buttons.current[next - min]?.focus();
    };
    return (
        <div
            ref={inputRef}
            role="radiogroup"
            aria-labelledby={labelId}
            aria-disabled={disabled || undefined}
            className="nl-scale-picker"
            // 값을 고른 줄은 나머지 숫자를 한 단계 흐리게 (2026-09-17 S1)
            data-has-value={value !== null || undefined}
        >
            {steps.map((step) => {
                const checked = value === step;
                return (
                    <button
                        key={step}
                        ref={(element) => {
                            buttons.current[step - min] = element;
                        }}
                        type="button"
                        role="radio"
                        aria-checked={checked}
                        tabIndex={step === focusable ? 0 : -1}
                        disabled={disabled}
                        className={cn(
                            "nl-scale-picker__option nl-control",
                            checked && "nl-scale-picker__option--checked"
                        )}
                        onClick={() => onChange(checked ? null : step)}
                        onKeyDown={(event) => move(event, step)}
                        onBlur={onBlur}
                    >
                        {step}
                    </button>
                );
            })}
        </div>
    );
}
