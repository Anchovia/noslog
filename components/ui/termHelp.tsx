"use client";

import * as Popover from "@radix-ui/react-popover";
import { CircleHelp } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * 점선 밑줄 글자 + 위쪽 팝오버 설명. 마우스 올림·포커스·탭으로 열린다.
 * 빙고 용어(테누토 등)에서 시작해 오락실 기체 상태 이유에도 쓴다.
 * 행 끝에 붙어 줄끼리 끝이 맞아야 하는 자리(기체 상태)는 물음표 아이콘을 끈다.
 */
export default function TermHelp({
    children,
    title,
    description,
    ariaLabel,
    icon = true,
}: {
    children: ReactNode;
    title: ReactNode;
    description: ReactNode;
    ariaLabel: string;
    icon?: boolean;
}) {
    const [open, setOpen] = useState(false);
    const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    useEffect(
        () => () => {
            if (closeTimer.current) clearTimeout(closeTimer.current);
        },
        []
    );

    function cancelClose() {
        if (closeTimer.current) clearTimeout(closeTimer.current);
    }

    function scheduleClose() {
        closeTimer.current = setTimeout(() => setOpen(false), 120);
    }

    return (
        <Popover.Root open={open} onOpenChange={setOpen}>
            <span
                className="nl-term"
                onMouseEnter={() => {
                    cancelClose();
                    setOpen(true);
                }}
                onMouseLeave={scheduleClose}
            >
                <Popover.Trigger asChild>
                    <button
                        type="button"
                        aria-label={ariaLabel}
                        className="nl-term__trigger"
                        onFocus={() => setOpen(true)}
                        onClick={(event) => {
                            // Hover or focus may already have opened the help.
                            // A tap must keep it open instead of toggling it shut.
                            event.preventDefault();
                            cancelClose();
                            setOpen(true);
                        }}
                    >
                        <span>{children}</span>
                        {icon ? <CircleHelp size={14} aria-hidden /> : null}
                    </button>
                </Popover.Trigger>
            </span>
            <Popover.Portal>
                <Popover.Content
                    side="top"
                    sideOffset={8}
                    collisionPadding={16}
                    onOpenAutoFocus={(event) => event.preventDefault()}
                    onCloseAutoFocus={(event) => event.preventDefault()}
                    onMouseEnter={cancelClose}
                    onMouseLeave={scheduleClose}
                    className="noslog-ui nl-term__popover nl-body-secondary"
                >
                    <strong className="nl-control">{title}</strong>
                    <p>{description}</p>
                </Popover.Content>
            </Popover.Portal>
        </Popover.Root>
    );
}
