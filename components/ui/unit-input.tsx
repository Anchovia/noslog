import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/lib/cn";

/**
 * 단위 붙은 입력칸(2026-10-21 뮤즈캣 「기체 정보」 시안 — 「1 대」 · 「500 원」).
 * 겉 상자가 공용 입력칸(nl-input)과 같은 모양 · 올림 · 포커스 · 잘못된 칸 경계를 맡고, 안의 입력 오른쪽에 단위 글자(컨트롤 글자 · 흐림).
 * 값은 모두 토큰(foundation.css)
 */
export default function UnitInput({
    unit,
    className,
    ...props
}: ComponentProps<"input"> & { unit: ReactNode }) {
    return (
        <span
            className={cn("nl-input nl-unit-input", className)}
            data-disabled={props.disabled || undefined}
        >
            <input className="nl-unit-input__field" {...props} />
            <span className="nl-unit-input__unit nl-control" aria-hidden>
                {unit}
            </span>
        </span>
    );
}
