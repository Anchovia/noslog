"use client";

import type { Ref } from "react";

export default function RatingScale({
    name,
    value,
    onChange,
    onBlur,
    labelId,
    disabled,
    inputRef,
}: {
    name: string;
    value: number | null;
    onChange: (value: number) => void;
    onBlur?: () => void;
    labelId: string;
    disabled?: boolean;
    inputRef?: Ref<HTMLInputElement>;
}) {
    return (
        <div
            className="nl-rating-scale"
            role="radiogroup"
            aria-labelledby={labelId}
        >
            {[0, 1, 2, 3, 4].map((rating) => (
                <label key={rating}>
                    <input
                        ref={rating === 0 ? inputRef : undefined}
                        className="nl-rating-scale__input"
                        type="radio"
                        name={name}
                        value={rating}
                        checked={value === rating}
                        onChange={() => onChange(rating)}
                        onBlur={onBlur}
                        disabled={disabled}
                    />
                    <span className="nl-control">{rating}</span>
                </label>
            ))}
        </div>
    );
}
