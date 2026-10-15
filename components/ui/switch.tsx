import type { ComponentProps } from "react";

import { cn } from "@/lib/cn";

interface SwitchProps extends Omit<
    ComponentProps<"button">,
    "role" | "type" | "onChange"
> {
    /** 현재 제어 값. defaultChecked를 대신 사용하지 않는다. */
    checked: boolean;
    /** 누를 때 다음 boolean 값을 요청한다. 실제 저장/실패 복구는 호출부 책임이다. */
    onCheckedChange: (checked: boolean) => void;
}

/**
 * 스위치(2026-10-01 A1) — 누르는 즉시 적용되는 켜고 끄기에만 쓴다. 저장 버튼이 있는 폼 안은 체크박스(가이드 「부품」).
 * 보이는 라벨은 `<label htmlFor>` 로 이어 붙여 줄 글자를 눌러도 켜고 끈다
 */
export function Switch({
    checked,
    onCheckedChange,
    className,
    ...props
}: SwitchProps) {
    return (
        <button
            {...props}
            type="button"
            role="switch"
            aria-checked={checked}
            className={cn("nl-switch", className)}
            onClick={() => onCheckedChange(!checked)}
        />
    );
}
