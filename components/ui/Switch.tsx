"use client";

import * as SwitchPrimitive from "@radix-ui/react-switch";
import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils";

type SwitchProps = ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>;

// 이진 설정의 스위치 스타일을 한곳에서 관리함
export function Switch({ className, ...props }: SwitchProps) {
    return (
        <SwitchPrimitive.Root
            className={cn(
                "bg-switch-track data-[state=checked]:bg-switch-active focus-visible:ring-focus/40 relative h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
                className
            )}
            {...props}
        >
            <SwitchPrimitive.Thumb className="bg-switch-thumb data-[state=checked]:bg-switch-thumb-active block size-5 translate-x-0.5 rounded-full shadow-sm transition-transform data-[state=checked]:translate-x-5" />
        </SwitchPrimitive.Root>
    );
}
