"use client";

import type { KeyboardEvent } from "react";

export default function MetricSwitch<Value extends string>({
    label,
    value,
    options,
    onValueChange,
}: {
    label: string;
    value: Value;
    options: readonly { value: Value; label: string; shortLabel: string }[];
    onValueChange: (value: Value) => void;
}) {
    function moveFocus(event: KeyboardEvent<HTMLDivElement>) {
        const buttons = Array.from(
            event.currentTarget.querySelectorAll<HTMLButtonElement>("button")
        );
        const current = buttons.indexOf(event.target as HTMLButtonElement);
        const direction =
            event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
        if (
            (!direction && event.key !== "Home" && event.key !== "End") ||
            current < 0
        )
            return;
        event.preventDefault();
        const next =
            event.key === "Home"
                ? 0
                : event.key === "End"
                  ? buttons.length - 1
                  : (current + direction + buttons.length) % buttons.length;
        buttons[next]?.focus();
    }
    return (
        <div
            className="nl-metric-switch"
            role="group"
            aria-label={label}
            onKeyDown={moveFocus}
        >
            {options.map((option) => (
                <button
                    key={option.value}
                    type="button"
                    className="nl-metric-switch__item nl-control"
                    aria-label={option.label}
                    aria-pressed={value === option.value}
                    onClick={() => onValueChange(option.value)}
                >
                    <span className="nl-metric-switch__full" aria-hidden>
                        {option.label}
                    </span>
                    <span className="nl-metric-switch__short" aria-hidden>
                        {option.shortLabel}
                    </span>
                    <span className="nl-metric-switch__indicator" aria-hidden />
                </button>
            ))}
        </div>
    );
}
