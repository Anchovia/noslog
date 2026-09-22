"use client";

import * as Popover from "@radix-ui/react-popover";
import { Ellipsis } from "lucide-react";
import { useRef, useState, type ReactNode, type Ref } from "react";

import IconButton from "@/components/ui/iconButton";

export default function ActionMenu({
    label,
    items,
    triggerRef,
    icon,
    disabled,
}: {
    label: string;
    items: { label: string; onSelect: () => void; destructive?: boolean }[];
    /** 항목이 창을 열 때, 창을 닫으면 포커스를 ⋯ 로 돌려주기 위한 ref */
    triggerRef?: Ref<HTMLButtonElement>;
    /** ⋯ 대신 쓸 아이콘 — 같은 계열 변종을 묶는 메뉴(마크다운 소제목 단계 등, 2026-09-23) */
    icon?: ReactNode;
    disabled?: boolean;
}) {
    const [open, setOpen] = useState(false);
    const content = useRef<HTMLDivElement>(null);
    return (
        <Popover.Root open={open} onOpenChange={setOpen}>
            <Popover.Trigger asChild>
                <IconButton
                    label={label}
                    aria-haspopup="menu"
                    ref={triggerRef}
                    disabled={disabled}
                >
                    {icon ?? <Ellipsis className="nl-icon" aria-hidden />}
                </IconButton>
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
                                data-destructive={item.destructive || undefined}
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
