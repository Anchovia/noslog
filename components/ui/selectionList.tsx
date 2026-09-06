"use client";

import { Check } from "lucide-react";
import { useId } from "react";
import type { ReactNode } from "react";

export default function SelectionList<Value extends string>({
    label,
    options,
    value,
    onValueChange,
    multiple = false,
}: {
    label: string;
    options: readonly {
        value: Value;
        label: ReactNode;
        disabled?: boolean;
        description?: string;
    }[];
    value: readonly Value[];
    onValueChange: (values: Value[]) => void;
    multiple?: boolean;
}) {
    const id = useId();
    return (
        <fieldset className="nl-selection-list">
            <legend className="nl-component-title">{label}</legend>
            {options.map((option) => (
                <label
                    key={option.value}
                    className="nl-selection-list__option nl-control"
                    data-selected={value.includes(option.value)}
                    data-disabled={option.disabled || undefined}
                >
                    <input
                        className="sr-only"
                        type={multiple ? "checkbox" : "radio"}
                        name={id}
                        value={option.value}
                        checked={value.includes(option.value)}
                        disabled={option.disabled}
                        aria-describedby={
                            option.description
                                ? `${id}-${option.value}`
                                : undefined
                        }
                        onChange={() =>
                            onValueChange(
                                multiple
                                    ? value.includes(option.value)
                                        ? value.filter(
                                              (item) => item !== option.value
                                          )
                                        : [...value, option.value]
                                    : [option.value]
                            )
                        }
                        onClick={() => {
                            if (!multiple && value.includes(option.value))
                                onValueChange([option.value]);
                        }}
                    />
                    <span>
                        {option.label}
                        {option.description ? (
                            <span
                                className="nl-selection-list__description nl-metadata nl-muted"
                                id={`${id}-${option.value}`}
                            >
                                {option.description}
                            </span>
                        ) : null}
                    </span>
                    {value.includes(option.value) ? (
                        <Check className="nl-icon" aria-hidden />
                    ) : null}
                </label>
            ))}
        </fieldset>
    );
}
