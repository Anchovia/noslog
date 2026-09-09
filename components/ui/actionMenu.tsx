"use client";

import * as Popover from "@radix-ui/react-popover";
import { Ellipsis } from "lucide-react";
import { useRef, useState } from "react";

export default function ActionMenu({
    label,
    items,
}: {
    label: string;
    items: { label: string; onSelect: () => void; destructive?: boolean }[];
}) {
    const [open, setOpen] = useState(false);
    const content = useRef<HTMLDivElement>(null);
    return (
        <Popover.Root open={open} onOpenChange={setOpen}>
            <Popover.Trigger
                className="nl-icon-button"
                aria-label={label}
                aria-haspopup="menu"
            >
                <Ellipsis className="nl-icon nl-icon--large" aria-hidden />
            </Popover.Trigger>
            <Popover.Portal>
                <div className="noslog-ui">
                    <Popover.Content
                        ref={content}
                        className="nl-action-menu"
                        role="menu"
                        aria-label={label}
                        sideOffset={8}
                        align="end"
                        collisionPadding={16}
                        onKeyDown={(event) => {
                            if (event.key === "Tab") {
                                setOpen(false);
                                return;
                            }
                            if (
                                ![
                                    "ArrowDown",
                                    "ArrowUp",
                                    "Home",
                                    "End",
                                ].includes(event.key)
                            )
                                return;
                            event.preventDefault();
                            const buttons = Array.from(
                                content.current?.querySelectorAll<HTMLButtonElement>(
                                    "[role=menuitem]"
                                ) ?? []
                            );
                            const current = buttons.indexOf(
                                document.activeElement as HTMLButtonElement
                            );
                            const next =
                                event.key === "Home"
                                    ? 0
                                    : event.key === "End"
                                      ? buttons.length - 1
                                      : (current +
                                            (event.key === "ArrowDown"
                                                ? 1
                                                : -1) +
                                            buttons.length) %
                                        buttons.length;
                            buttons[next]?.focus();
                        }}
                    >
                        {items.map((item) => (
                            <button
                                className="nl-action-menu__item nl-body-secondary"
                                role="menuitem"
                                type="button"
                                key={item.label}
                                onClick={() => {
                                    setOpen(false);
                                    item.onSelect();
                                }}
                            >
                                {item.label}
                            </button>
                        ))}
                    </Popover.Content>
                </div>
            </Popover.Portal>
        </Popover.Root>
    );
}
