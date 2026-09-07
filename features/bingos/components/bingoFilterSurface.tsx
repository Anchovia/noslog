"use client";

import * as Popover from "@radix-ui/react-popover";
import type { ReactNode } from "react";
import FullScreenDialog from "@/components/ui/fullScreenDialog";

export default function BingoFilterSurface({
    wide,
    open,
    onOpenChange,
    title,
    trigger,
    footer,
    children,
}: {
    wide: boolean;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    trigger: ReactNode;
    footer: ReactNode;
    children: ReactNode;
}) {
    if (!wide) {
        return (
            <FullScreenDialog
                {...{ open, onOpenChange, title, trigger, footer }}
            >
                {children}
            </FullScreenDialog>
        );
    }
    return (
        <Popover.Root open={open} onOpenChange={onOpenChange}>
            <Popover.Trigger asChild>{trigger}</Popover.Trigger>
            <Popover.Portal>
                <div className="noslog-ui">
                    <Popover.Content
                        className="nl-bingo-filter-popover"
                        align="start"
                        sideOffset={8}
                        collisionPadding={16}
                        aria-label={title}
                    >
                        {children}
                    </Popover.Content>
                </div>
            </Popover.Portal>
        </Popover.Root>
    );
}
