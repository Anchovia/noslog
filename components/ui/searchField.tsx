"use client";

import { Search, X } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/lib/utils";

export default function SearchField({
    leading,
    clearLabel,
    busyLabel,
    busy = false,
    onClear,
    value,
    className,
    ...props
}: Omit<ComponentProps<"input">, "value"> & {
    leading?: ReactNode;
    value: string;
    clearLabel: string;
    onClear: () => void;
    busy?: boolean;
    busyLabel?: string;
}) {
    return (
        <div
            className={cn("nl-search", className)}
            aria-busy={busy || undefined}
        >
            {leading ? (
                <>
                    {leading}
                    <span className="nl-search__divider" aria-hidden />
                </>
            ) : null}
            <Search className="nl-icon" aria-hidden />
            <input
                {...props}
                type="search"
                value={value}
                className="nl-search__input nl-body"
            />
            {busy ? (
                <span
                    className="nl-search__busy nl-control nl-muted"
                    role="status"
                >
                    {busyLabel}
                </span>
            ) : value ? (
                <button
                    type="button"
                    className="nl-search__clear"
                    aria-label={clearLabel}
                    onClick={onClear}
                >
                    <X className="nl-icon" aria-hidden />
                </button>
            ) : null}
        </div>
    );
}
