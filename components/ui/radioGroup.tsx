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
}: {
    label: string;
    description?: string;
    options: readonly { value: Value; label: ReactNode }[];
    value: Value;
    onValueChange: (value: Value) => void;
    disabled?: boolean;
    /** 고르지 않고 보냈을 때 — 묶음 아래 오류 한 줄(FormField 와 같은 자리 · 모양) */
    error?: ReactNode;
}) {
    const id = useId();
    return (
        <fieldset className="nl-radio-group" disabled={disabled}>
            <legend className="nl-component-title">{label}</legend>
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
