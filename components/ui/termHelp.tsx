"use client";

import * as Popover from "@radix-ui/react-popover";
import { CircleHelp } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * 용어 뜻 도움말 — 점선 밑줄 글자 + ? 16, 마우스 올림·포커스·탭으로 위쪽 작은 창(부품 결정 ④ 2026-09-15).
 * 빙고 용어(테누토 등) · 오락실 기체 상태 이유에 쓴다.
 * 행 끝에 붙어 줄끼리 끝이 맞아야 하는 자리(기체 상태)는 물음표 아이콘을 끈다.
 * plain = 점선 밑줄 · 물음표 없이 내용(태그 등)을 그대로 누르는 자리로 — 기여 라벨(2026-09-24)
 * content = 제목 · 설명 두 줄 대신 창 안을 통째로(업적 배지 정보 카드, 2026-09-25 M1). popoverClassName 으로 창 폭 · 안쪽 여백만 바꾼다
 */
export default function TermHelp({
    children,
    title,
    description,
    ariaLabel,
    icon = true,
    plain = false,
    content,
    popoverClassName,
}: {
    children: ReactNode;
    title?: ReactNode;
    description?: ReactNode;
    ariaLabel: string;
    icon?: boolean;
    plain?: boolean;
    content?: ReactNode;
    popoverClassName?: string;
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
                className={plain ? "nl-term nl-term--plain" : "nl-term"}
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
                        className={
                            plain
                                ? "nl-term__trigger nl-term__trigger--plain"
                                : "nl-term__trigger"
                        }
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
                        {icon && !plain ? (
                            <CircleHelp className="nl-icon-small" aria-hidden />
                        ) : null}
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
                    className={
                        popoverClassName
                            ? `noslog-ui nl-term__popover ${popoverClassName}`
                            : "noslog-ui nl-term__popover"
                    }
                >
                    {content ?? (
                        <>
                            <strong className="nl-control">{title}</strong>
                            <p className="nl-body-secondary">{description}</p>
                        </>
                    )}
                </Popover.Content>
            </Popover.Portal>
        </Popover.Root>
    );
}
