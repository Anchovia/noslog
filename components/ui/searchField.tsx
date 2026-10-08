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
    /** 제어된 문자열. 입력 onChange는 네이티브 input 이벤트다. */
    value: string;
    /** 지우기 버튼의 번역된 접근성 이름. */
    clearLabel: string;
    /** 값 지우기를 요청한다. 호출부가 value를 빈 문자열로 갱신한다. */
    onClear: () => void;
    /** false 기본. 지우기보다 우선하지만 입력은 자동 잠그지 않는다. */
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
