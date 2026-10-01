"use client";

import * as Popover from "@radix-ui/react-popover";
import { CircleHelp } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";

/** 닫은 직후 같은 손짓이 다시 여는 것을 무시하는 시간 — 셀렉트(useSelectOpen)와 같은 규칙 */
const REOPEN_GUARD_MS = 200;
/** 지금 열린 도움말의 닫기 함수 — 한 번에 하나만 연다(2026-10-01 V10) */
let closeOpenTerm: (() => void) | null = null;

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
    const trigger = useRef<HTMLButtonElement>(null);
    /** 눌러서 연 창인지 — 올림으로 열린 창은 누름이 「고정」 이고, 고정된 창을 다시 누르면 닫는다(2026-10-01 사용자) */
    const pinned = useRef(false);
    const closedAt = useRef(0);
    /** 이 도움말을 곧바로 닫는다 — 다른 도움말이 열릴 때도 이것을 부른다 */
    const closeNow = useRef(() => {
        if (closeTimer.current) clearTimeout(closeTimer.current);
        pinned.current = false;
        closedAt.current = Date.now();
        if (closeOpenTerm === closeNow.current) closeOpenTerm = null;
        setOpen(false);
    });
    useEffect(() => {
        const close = closeNow.current;
        return () => {
            if (closeTimer.current) clearTimeout(closeTimer.current);
            if (closeOpenTerm === close) closeOpenTerm = null;
        };
    }, []);

    function cancelClose() {
        if (closeTimer.current) clearTimeout(closeTimer.current);
    }

    /** 열기 — 먼저 열린 다른 도움말은 바로 닫는다(늦게 닫혀 겹치면 번쩍인다). 닫은 직후 200ms 는 다시 열지 않는다 */
    function openNow() {
        cancelClose();
        if (Date.now() - closedAt.current < REOPEN_GUARD_MS) return false;
        if (closeOpenTerm && closeOpenTerm !== closeNow.current)
            closeOpenTerm();
        closeOpenTerm = closeNow.current;
        setOpen(true);
        return true;
    }

    function scheduleClose() {
        closeTimer.current = setTimeout(closeNow.current, 120);
    }

    return (
        <Popover.Root
            open={open}
            onOpenChange={(next) => {
                if (next) openNow();
                else closeNow.current();
            }}
        >
            <span
                className={plain ? "nl-term nl-term--plain" : "nl-term"}
                onMouseEnter={openNow}
                onMouseLeave={scheduleClose}
            >
                <Popover.Trigger asChild>
                    <button
                        ref={trigger}
                        type="button"
                        aria-label={ariaLabel}
                        className={
                            plain
                                ? "nl-term__trigger nl-term__trigger--plain"
                                : "nl-term__trigger"
                        }
                        onFocus={openNow}
                        onClick={(event) => {
                            // 올림 · 포커스로 이미 열려 있을 수 있다 — 첫 누름은 그 자리에 고정, 고정된 창을 누르면 닫는다
                            event.preventDefault();
                            cancelClose();
                            if (open && pinned.current) {
                                closeNow.current();
                                return;
                            }
                            if (open || openNow()) pinned.current = true;
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
                    onPointerDownOutside={(event) => {
                        // 제 트리거를 누른 것은 바깥 누름이 아니다 — 여기서 닫으면 눌러 여는 것과 부딪혀 깜빡인다
                        if (trigger.current?.contains(event.target as Node))
                            event.preventDefault();
                    }}
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
