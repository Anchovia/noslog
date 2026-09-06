"use client";

import type { KeyboardEvent, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SegmentOption<Value extends string> {
    value: Value;
    label: ReactNode;
    disabled?: boolean;
}

interface SegmentedControlProps<Value extends string> {
    label: string;
    value: Value;
    onValueChange: (value: Value) => void;
    options: readonly SegmentOption<Value>[];
    className?: string;
}

export function SegmentedControl<Value extends string>({
    label,
    value,
    onValueChange,
    options,
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
            className={cn("nl-segments", className)}
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
                    onClick={() => onValueChange(option.value)}
                >
                    {option.label}
                </button>
            ))}
        </div>
    );
}
