import { type ComponentPropsWithRef } from "react";

import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
// icon = 컨트롤 높이 정사각(L), icon-sm = 컴팩트 높이 정사각(M) — 아이콘 버튼은 자기 줄의 단계(2026-09-22)
type ButtonSize = "sm" | "md" | "lg" | "icon" | "icon-sm";

interface ButtonProps extends ComponentPropsWithRef<"button"> {
    /** primary 기본. null은 변형 클래스를 생략한다. */
    variant?: ButtonVariant | null;
    /** sm/icon-sm은 M, 그 밖은 L. 네이티브 type 기본은 button이다. */
    size?: ButtonSize | null;
    /** 위험 버튼은 채운 빨강 하나 — variant="danger" 와 같은 모양(2026-10-01 V12) */
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
