import { type ComponentPropsWithRef } from "react";

import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
// sm · md · lg = 작게 · 기본 · 크게. icon = 기본 높이 정사각, icon-sm = 작은 높이 정사각 — 아이콘 버튼은 자기 줄의 단계(2026-09-22)
type ButtonSize = "sm" | "md" | "lg" | "icon" | "icon-sm";

interface ButtonProps extends ComponentPropsWithRef<"button"> {
    /** primary 기본. */
    variant?: ButtonVariant;
    /** sm/icon-sm은 작게, lg는 크게, 그 밖은 기본. 네이티브 type 기본은 button이다. */
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
        (size === "icon" || size === "icon-sm") && "nl-button--icon",
        (size === "sm" || size === "icon-sm") && "nl-button--compact",
        size === "lg" && "nl-button--large"
    );
}
