import { ChevronDown, ChevronRight } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/lib/utils";

export default function Disclosure({
    title,
    children,
    className,
    heading = "component",
    compact = false,
    meta,
    ...props
}: Omit<ComponentProps<"details">, "title"> & {
    title: ReactNode;
    heading?: "component" | "section";
    compact?: boolean;
    meta?: ReactNode;
}) {
    return (
        <details
            className={cn(
                "nl-disclosure",
                compact && "nl-disclosure--compact",
                className
            )}
            {...props}
        >
            <summary
                className={
                    compact
                        ? "nl-control"
                        : heading === "section"
                          ? "nl-section-title"
                          : "nl-component-title"
                }
            >
                {compact ? (
                    <ChevronRight className="nl-icon" aria-hidden />
                ) : null}
                <span>{title}</span>
                {meta ? (
                    <span className="nl-metadata nl-muted">{meta}</span>
                ) : null}
                {!compact ? (
                    <ChevronDown className="nl-icon" aria-hidden />
                ) : null}
            </summary>
            <div className="nl-disclosure__body">{children}</div>
        </details>
    );
}
