import { cn } from "@/lib/utils";
import { type ComponentPropsWithRef } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
// icon = 컨트롤 높이 정사각(L), icon-sm = 컴팩트 높이 정사각(M) — 아이콘 버튼은 자기 줄의 단계(2026-09-22)
type ButtonSize = "sm" | "md" | "lg" | "icon" | "icon-sm";

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
        (size === "icon" || size === "icon-sm") && "nl-button--icon",
        (size === "sm" || size === "icon-sm") && "nl-button--compact",
        destructiveFilled && "nl-button--danger-filled"
    );
}
