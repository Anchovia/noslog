import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/lib/utils";

export default function PageContainer({
    width = "standard",
    className,
    ...props
}: ComponentProps<"div"> & { width?: "reading" | "standard" | "wide" }) {
    return (
        <div
            className={cn("nl-container", `nl-container--${width}`, className)}
            {...props}
        />
    );
}

export function PageHeading({
    title,
    description,
    action,
}: {
    title: ReactNode;
    description?: ReactNode;
    action?: ReactNode;
}) {
    return (
        <div className="nl-page-heading">
            <div className="nl-page-heading__copy">
                <h1 className="nl-page-title">{title}</h1>
                {description ? (
                    <p className="nl-body-secondary nl-muted">{description}</p>
                ) : null}
            </div>
            {action}
        </div>
    );
}
