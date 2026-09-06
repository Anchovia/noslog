"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ReactNode } from "react";
import useElementWidth from "@/lib/hooks/useElementWidth";

export default function Pagination({
    page,
    totalPages,
    onPageChange,
    label,
    pageLabel,
    previousLabel,
    nextLabel,
    busy = false,
    pageHref,
}: {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    label: string;
    pageLabel: (page: number) => string;
    previousLabel: string;
    nextLabel: string;
    busy?: boolean;
    pageHref?: (page: number) => string;
}) {
    const { ref, width } = useElementWidth<HTMLElement>();
    if (totalPages <= 1) return null;
    const compact = width < 356;
    const capacity = compact ? 3 : 5;
    const pages: (number | "gap")[] =
        totalPages <= capacity
            ? Array.from({ length: totalPages }, (_, index) => index + 1)
            : compact
              ? [
                    1,
                    page === 1 || page === totalPages ? "gap" : page,
                    totalPages,
                ]
              : page <= 3
                ? [1, 2, 3, "gap", totalPages]
                : page >= totalPages - 2
                  ? [1, "gap", totalPages - 2, totalPages - 1, totalPages]
                  : [1, "gap", page, "gap", totalPages];
    return (
        <nav className="nl-pagination" ref={ref} aria-label={label}>
            <div className="nl-pagination__controls">
                <PaginationControl
                    label={previousLabel}
                    href={pageHref?.(page - 1)}
                    disabled={page <= 1 || busy}
                    onClick={() => onPageChange(page - 1)}
                >
                    <ChevronLeft className="nl-icon" aria-hidden />
                </PaginationControl>
                {pages.map((value, index) =>
                    value === "gap" ? (
                        <span
                            key={`gap-${index}`}
                            className="nl-pagination__item nl-control"
                            aria-hidden
                        >
                            …
                        </span>
                    ) : (
                        <PaginationControl
                            key={value}
                            label={pageLabel(value)}
                            href={pageHref?.(value)}
                            current={value === page}
                            disabled={busy}
                            onClick={() =>
                                value !== page && onPageChange(value)
                            }
                        >
                            {value}
                        </PaginationControl>
                    )
                )}
                <PaginationControl
                    label={nextLabel}
                    href={pageHref?.(page + 1)}
                    disabled={page >= totalPages || busy}
                    onClick={() => onPageChange(page + 1)}
                >
                    <ChevronRight className="nl-icon" aria-hidden />
                </PaginationControl>
            </div>
        </nav>
    );
}

function PaginationControl({
    href,
    label,
    disabled,
    current,
    onClick,
    children,
}: {
    href?: string;
    label: string;
    disabled: boolean;
    current?: boolean;
    onClick: () => void;
    children: ReactNode;
}) {
    const props = {
        className: "nl-pagination__item nl-control",
        "aria-label": label,
        "aria-current": current ? ("page" as const) : undefined,
    };
    if (!href)
        return (
            <button
                type="button"
                {...props}
                disabled={disabled}
                onClick={onClick}
            >
                {children}
            </button>
        );
    if (disabled)
        return (
            <button type="button" {...props} disabled>
                {children}
            </button>
        );
    return (
        <a
            {...props}
            href={href}
            onClick={(event) => {
                if (
                    event.button !== 0 ||
                    event.metaKey ||
                    event.ctrlKey ||
                    event.shiftKey ||
                    event.altKey
                )
                    return;
                event.preventDefault();
                if (!current) onClick();
            }}
        >
            {children}
        </a>
    );
}
