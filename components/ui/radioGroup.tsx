"use client";

import { useId } from "react";
import type { ReactNode } from "react";

export default function RadioGroup<Value extends string>({
    label,
    description,
    options,
    value,
    onValueChange,
    disabled = false,
    error,
    labelStyle = "section",
}: {
    label: string;
    description?: string;
    options: readonly { value: Value; label: ReactNode }[];
    value: Value;
    onValueChange: (value: Value) => void;
    disabled?: boolean;
    /** 고르지 않고 보냈을 때 — 묶음 아래 오류 한 줄(FormField 와 같은 자리 · 모양) */
    error?: ReactNode;
    /** 제목 모양 — section = 설정 구역 제목(component-title), field = 창 안 폼의 칸 라벨(2026-09-26 점검 C1) */
    labelStyle?: "section" | "field";
}) {
    const id = useId();
    return (
        <fieldset
            className={
                labelStyle === "field"
                    ? "nl-radio-group nl-radio-group--field"
                    : "nl-radio-group"
            }
            disabled={disabled}
        >
            <legend
                className={
                    labelStyle === "field"
                        ? "nl-field__label"
                        : "nl-component-title"
                }
            >
                {label}
            </legend>
            {description ? (
                <p id={`${id}-help`} className="nl-body-secondary nl-muted">
                    {description}
                </p>
            ) : null}
            <div>
                {options.map((option) => (
                    <label
                        className="nl-radio-group__option nl-control"
                        key={option.value}
                    >
                        <input
                            type="radio"
                            name={id}
                            value={option.value}
                            checked={value === option.value}
                            aria-describedby={
                                [
                                    description && `${id}-help`,
                                    error && `${id}-error`,
                                ]
                                    .filter(Boolean)
                                    .join(" ") || undefined
                            }
                            onChange={() => onValueChange(option.value)}
                        />
                        <span>{option.label}</span>
                    </label>
                ))}
            </div>
            {error ? (
                <p
                    id={`${id}-error`}
                    className="nl-field__help nl-field__error"
                    role="alert"
                >
                    {error}
                </p>
            ) : null}
        </fieldset>
    );
}
