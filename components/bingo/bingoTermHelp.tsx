"use client";

import * as Popover from "@radix-ui/react-popover";
import { CircleHelp } from "lucide-react";
import { Fragment, useRef, useState } from "react";

const BINGO_TERMS = {
    테누토: "노트가 표시된 시간 동안 건반을 누르고 연주하는 노트입니다.",
    글리산도: "건반 위를 미끄러뜨리듯 여러 음을 연속으로 입력하는 노트입니다.",
    트릴: "인접한 음을 빠르게 번갈아 연주하는 노트입니다.",
    "◆Just": "판정 타이밍을 매우 정확하게 맞췄을 때 받는 상위 Just 판정입니다.",
} as const;

const termPattern = new RegExp(
    `(${Object.keys(BINGO_TERMS)
        .sort((a, b) => b.length - a.length)
        .map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
        .join("|")})`,
    "g"
);

function BingoTerm({ term }: { term: keyof typeof BINGO_TERMS }) {
    const [open, setOpen] = useState(false);
    const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    function cancelClose() {
        if (closeTimer.current) clearTimeout(closeTimer.current);
    }

    function scheduleClose() {
        closeTimer.current = setTimeout(() => setOpen(false), 120);
    }

    return (
        <Popover.Root open={open} onOpenChange={setOpen}>
            <span
                className="inline-flex items-baseline gap-0.5"
                onMouseEnter={() => {
                    cancelClose();
                    setOpen(true);
                }}
                onMouseLeave={scheduleClose}
            >
                <span className="decoration-text-disabled underline decoration-dotted underline-offset-2">
                    {term}
                </span>
                <Popover.Trigger asChild>
                    <button
                        type="button"
                        aria-label={`${term} 설명`}
                        className="text-text-disabled hover:text-text-primary inline-flex cursor-help align-middle transition-colors"
                        onFocus={() => setOpen(true)}
                    >
                        <CircleHelp className="size-3" />
                    </button>
                </Popover.Trigger>
            </span>
            <Popover.Portal>
                <Popover.Content
                    side="top"
                    sideOffset={6}
                    collisionPadding={12}
                    onMouseEnter={cancelClose}
                    onMouseLeave={scheduleClose}
                    className="border-border bg-surface-muted text-body-muted z-50 w-56 rounded-md border p-3 shadow-xl"
                >
                    <strong className="text-text-primary mb-1 block text-sm">
                        {term}
                    </strong>
                    {BINGO_TERMS[term]}
                    <Popover.Arrow className="fill-border" />
                </Popover.Content>
            </Popover.Portal>
        </Popover.Root>
    );
}

export default function BingoTermHelp({ text }: { text: string }) {
    return text
        .split(termPattern)
        .map((part, index) =>
            part in BINGO_TERMS ? (
                <BingoTerm
                    key={`${part}-${index}`}
                    term={part as keyof typeof BINGO_TERMS}
                />
            ) : (
                <Fragment key={`${part}-${index}`}>{part}</Fragment>
            )
        );
}
