import { cn } from "@/lib/utils";
import { type ComponentPropsWithRef } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg" | "icon";

interface ButtonProps extends ComponentPropsWithRef<"button"> {
    variant?: ButtonVariant | null;
    size?: ButtonSize | null;
    destructiveFilled?: boolean;
}

export default function Button({
    className,
    variant,
    size,
    destructiveFilled = false,
    type = "button",
    ...props
}: ButtonProps) {
    return (
        <button
            type={type}
            className={cn(
                foundationButtonClass({
                    variant,
                    size,
                    destructiveFilled,
                }),
                className
            )}
            {...props}
        />
    );
}

export function foundationButtonClass({
    variant = "primary",
    size,
    destructiveFilled = false,
}: Pick<ButtonProps, "variant" | "size" | "destructiveFilled"> = {}) {
    return cn(
        "nl-button",
        variant && `nl-button--${variant}`,
        size === "icon" && "nl-button--icon",
        size === "sm" && "nl-button--compact",
        destructiveFilled && "nl-button--danger-filled"
    );
}
