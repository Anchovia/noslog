import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface FormFieldProps {
    id: string;
    label: ReactNode;
    help?: ReactNode;
    error?: ReactNode;
    children: ReactNode;
    className?: string;
}

export function FormField({
    id,
    label,
    help,
    error,
    children,
    className,
}: FormFieldProps) {
    return (
        <div className={cn("nl-field", className)}>
            <label htmlFor={id} className="nl-field__label">
                {label}
            </label>
            {children}
            {help ? (
                <p id={`${id}-help`} className="nl-field__help">
                    {help}
                </p>
            ) : null}
            {error ? (
                <p
                    id={`${id}-error`}
                    className="nl-field__help nl-field__error"
                    role="alert"
                >
                    {error}
                </p>
            ) : null}
        </div>
    );
}

export function Input({ className, ...props }: ComponentProps<"input">) {
    return <input className={cn("nl-input", className)} {...props} />;
}

export function TextArea({ className, ...props }: ComponentProps<"textarea">) {
    return <textarea className={cn("nl-input", className)} {...props} />;
}

export function fieldDescription(
    id: string,
    options: { help?: boolean; error?: boolean }
) {
    return (
        [options.help && `${id}-help`, options.error && `${id}-error`]
            .filter(Boolean)
            .join(" ") || undefined
    );
}
