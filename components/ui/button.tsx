import { type ComponentPropsWithRef } from "react";

import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
// sm · md = 32 · lg = 혼자 놓인 주 버튼 48. icon · icon-sm · icon-lg = 32 정사각
type ButtonSize = "sm" | "md" | "lg" | "icon" | "icon-sm" | "icon-lg";

interface ButtonProps extends ComponentPropsWithRef<"button"> {
    /** primary 기본. */
    variant?: ButtonVariant;
    /** lg는 혼자 놓인 주 버튼(48), 그 밖은 32. 네이티브 type 기본은 button이다. */
    size?: ButtonSize | null;
}

export default function Button({
    className,
    variant,
    size,
    type = "button",
    ...props
}: ButtonProps) {
    return (
        <button
            type={type}
            className={cn(foundationButtonClass({ variant, size }), className)}
            {...props}
        />
    );
}

export function foundationButtonClass({
    variant = "primary",
    size,
}: Pick<ButtonProps, "variant" | "size"> = {}) {
    return cn(
        "nl-button",
        `nl-button--${variant}`,
        (size === "icon" || size === "icon-sm" || size === "icon-lg") &&
            "nl-button--icon",
        (size === "sm" || size === "icon-sm") && "nl-button--xsmall",
        size === "lg" && "nl-button--large"
    );
}
