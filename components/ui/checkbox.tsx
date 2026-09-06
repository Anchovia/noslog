import { Check } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CheckboxProps extends Omit<ComponentProps<"input">, "type"> {
    label: ReactNode;
}

export function Checkbox({ label, className, ...props }: CheckboxProps) {
    return (
        <label className={cn("nl-check nl-control", className)}>
            <input type="checkbox" {...props} />
            <span className="nl-check__box" aria-hidden="true">
                <Check />
            </span>
            <span>{label}</span>
        </label>
    );
}
