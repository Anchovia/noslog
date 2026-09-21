import type { AriaRole } from "react";

export const adminInputClass =
    "border-border bg-bg text-input h-11 w-full rounded-md border px-3";

export const adminCompactInputClass =
    "border-border bg-bg text-input h-10 min-w-0 rounded-md border px-3 outline-none focus:border-focus";

export const adminSecondaryButtonClass =
    "border-border hover:bg-surface-muted focus-visible:ring-focus/40 flex h-9 items-center justify-center gap-1.5 rounded-md border px-3 text-sm font-bold transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:opacity-50";

export function AdminFieldError({
    message,
    as: Tag = "p",
    className = "text-danger mt-1 text-xs",
    role = "alert",
}: {
    message?: string;
    as?: "p" | "span";
    className?: string;
    role?: AriaRole | null;
}) {
    return message ? (
        <Tag className={className} {...(role ? { role } : {})}>
            {message}
        </Tag>
    ) : null;
}
