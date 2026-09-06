import { CircleAlert, CircleCheck, Info, TriangleAlert } from "lucide-react";
import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

const statusIcons = {
    info: Info,
    success: CircleCheck,
    warning: TriangleAlert,
    danger: CircleAlert,
};

interface StatusMessageProps extends Omit<
    HTMLAttributes<HTMLDivElement>,
    "title"
> {
    severity?: keyof typeof statusIcons;
    title: ReactNode;
    children?: ReactNode;
    description?: ReactNode;
    action?: ReactNode;
}

export function StatusMessage({
    severity = "info",
    title,
    children,
    description,
    action,
    className,
    ...props
}: StatusMessageProps) {
    const Icon = statusIcons[severity];
    return (
        <div
            className={cn("nl-status", `nl-status--${severity}`, className)}
            {...props}
        >
            <Icon className="nl-icon" aria-hidden="true" />
            <div className="nl-status__copy">
                <p className="nl-emphasis-label">{title}</p>
                {description ? (
                    <p className="nl-body-secondary">{description}</p>
                ) : null}
                {children ? (
                    <div className="nl-body-secondary">{children}</div>
                ) : null}
                {action}
            </div>
        </div>
    );
}
