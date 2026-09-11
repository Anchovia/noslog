"use client";

import type { KeyboardEvent, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SegmentOption<Value extends string> {
    value: Value;
    label: ReactNode;
    /** 아이콘 전용일 때 보이는 내용. label 은 접근 이름·툴팁으로 남는다 */
    icon?: ReactNode;
    disabled?: boolean;
}

interface SegmentedControlProps<Value extends string> {
    label: string;
    value: Value;
    onValueChange: (value: Value) => void;
    options: readonly SegmentOption<Value>[];
    /** 세그먼트를 아이콘만으로 그린다 — 라벨은 aria-label·title 로 유지 (Material 3·HIG: 한 컨트롤 안에서 아이콘·텍스트 혼용 금지) */
    iconOnly?: boolean;
    className?: string;
}

export function SegmentedControl<Value extends string>({
    label,
    value,
    onValueChange,
    options,
    iconOnly = false,
    className,
}: SegmentedControlProps<Value>) {
    function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
        const enabled = options.filter((option) => !option.disabled);
        const index = enabled.findIndex((option) => option.value === value);
        const direction =
            event.key === "ArrowRight" || event.key === "ArrowDown"
                ? 1
                : event.key === "ArrowLeft" || event.key === "ArrowUp"
                  ? -1
                  : 0;
        if (
            !enabled.length ||
            (!direction && event.key !== "Home" && event.key !== "End")
        )
            return;
        event.preventDefault();
        const next =
            event.key === "Home"
                ? 0
                : event.key === "End"
                  ? enabled.length - 1
                  : (index + direction + enabled.length) % enabled.length;
        const nextOption = enabled[next];
        onValueChange(nextOption.value);
        const buttons = Array.from(
            event.currentTarget.querySelectorAll<HTMLButtonElement>(
                "button:not(:disabled)"
            )
        );
        buttons[next]?.focus();
    }

    return (
        <div
            role="radiogroup"
            aria-label={label}
            className={cn(
                "nl-segments",
                iconOnly && "nl-segments--icons",
                className
            )}
            onKeyDown={handleKeyDown}
        >
            {options.map((option) => (
                <button
                    key={option.value}
                    type="button"
                    role="radio"
                    aria-checked={option.value === value}
                    disabled={option.disabled}
                    tabIndex={option.value === value ? 0 : -1}
                    className="nl-segments__item"
                    aria-label={
                        iconOnly && typeof option.label === "string"
                            ? option.label
                            : undefined
                    }
                    title={
                        iconOnly && typeof option.label === "string"
                            ? option.label
                            : undefined
                    }
                    onClick={() => onValueChange(option.value)}
                >
                    {iconOnly && option.icon ? option.icon : option.label}
                </button>
            ))}
        </div>
    );
}
