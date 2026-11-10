"use client";

import * as SelectPrimitive from "@radix-ui/react-select";
import type { ReactNode } from "react";

import { overlayPosition } from "@/components/ui/overlay-position";
import { useSelectOpen } from "@/components/ui/use-select-open";

export function SelectFrame({
    value,
    onValueChange,
    disabled,
    trigger,
    menuClassName,
    unwrapped,
    container,
    children,
}: {
    value: string;
    onValueChange: (value: string) => void;
    disabled?: boolean;
    trigger: ReactNode;
    menuClassName: string;
    unwrapped?: boolean;
    container?: HTMLElement | null;
    children: ReactNode;
}) {
    const { root: openState, onEscapeKeyDown } = useSelectOpen();
    const content = (
        <SelectPrimitive.Content
            className={menuClassName}
            onEscapeKeyDown={onEscapeKeyDown}
            position="popper"
            sideOffset={overlayPosition.sideOffset}
            align="start"
            collisionPadding={overlayPosition.collisionPadding}
        >
            <SelectPrimitive.Viewport>{children}</SelectPrimitive.Viewport>
        </SelectPrimitive.Content>
    );
    return (
        <SelectPrimitive.Root
            {...openState}
            value={value}
            onValueChange={onValueChange}
            disabled={disabled}
        >
            {trigger}
            <SelectPrimitive.Portal container={container ?? undefined}>
                {unwrapped ? (
                    content
                ) : (
                    <div className="noslog-ui">{content}</div>
                )}
            </SelectPrimitive.Portal>
        </SelectPrimitive.Root>
    );
}
