import { ChevronDown } from "lucide-react";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export function Select({
    className,
    children,
    ...props
}: ComponentProps<"select">) {
    return (
        <div className="nl-select">
            <select className={cn("nl-input", className)} {...props}>
                {children}
            </select>
            <ChevronDown className="nl-icon" aria-hidden="true" />
        </div>
    );
}
