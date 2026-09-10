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
}: {
    label: string;
    description?: string;
    options: readonly { value: Value; label: ReactNode }[];
    value: Value;
    onValueChange: (value: Value) => void;
    disabled?: boolean;
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
                                description ? `${id}-help` : undefined
                            }
                            onChange={() => onValueChange(option.value)}
                        />
                        <span>{option.label}</span>
                    </label>
                ))}
            </div>
        </fieldset>
    );
}
