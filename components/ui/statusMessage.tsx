import { CircleAlert, CircleCheck, Info, TriangleAlert } from "lucide-react";
import type { ComponentType, HTMLAttributes, ReactNode, SVGProps } from "react";
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
    // severity 기본 아이콘 대신 쓸 아이콘 (예: 공지 배너의 확성기)
    icon?: ComponentType<SVGProps<SVGSVGElement>>;
    title: ReactNode;
    children?: ReactNode;
    description?: ReactNode;
    action?: ReactNode;
}

export function StatusMessage({
    severity = "info",
    icon,
    title,
    children,
    description,
    action,
    className,
    ...props
}: StatusMessageProps) {
    const Icon = icon ?? statusIcons[severity];
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
