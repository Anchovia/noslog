"use client";

import * as Slider from "@radix-ui/react-slider";
import type { CSSProperties } from "react";

export default function RangeSlider({
    label,
    minimumLabel,
    maximumLabel,
    min = 1,
    max,
    value,
    onValueChange,
    onValueCommit,
    accent,
}: {
    label: string;
    minimumLabel: string;
    maximumLabel: string;
    min?: number;
    max: number;
    value: number[];
    onValueChange: (value: number[]) => void;
    onValueCommit?: (value: number[]) => void;
    accent?: string;
}) {
    return (
        <div
            className="nl-range"
            style={
                accent
                    ? ({ "--nl-range-accent": accent } as CSSProperties)
                    : undefined
            }
        >
            <div className="nl-range__label nl-control">
                <span>{label}</span>
                <output className="nl-metric-value">
                    {value[0]} – {value[1]}
                </output>
            </div>
            <Slider.Root
                className="nl-range__slider"
                min={min}
                max={max}
                step={1}
                value={value}
                onValueChange={onValueChange}
                onValueCommit={onValueCommit}
            >
                <Slider.Track className="nl-range__track">
                    <Slider.Range className="nl-range__selection" />
                </Slider.Track>
                <Slider.Thumb
                    className="nl-range__thumb"
                    aria-label={minimumLabel}
                />
                <Slider.Thumb
                    className="nl-range__thumb"
                    aria-label={maximumLabel}
                />
            </Slider.Root>
        </div>
    );
}
