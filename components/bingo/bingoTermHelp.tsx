"use client";

import * as Popover from "@radix-ui/react-popover";
import { CircleHelp } from "lucide-react";
import { Fragment, useEffect, useRef, useState } from "react";
import { useTranslations } from "@/components/i18n/localeProvider";
import type { MessageKey } from "@/lib/i18n/messages";

const BINGO_TERMS: Record<string, MessageKey> = {
    테누토: "bingo.term.tenuto",
    글리산도: "bingo.term.glissando",
    트릴: "bingo.term.trill",
    "◆Just": "bingo.term.sjust",
} as const;

const termPattern = new RegExp(
    `(${Object.keys(BINGO_TERMS)
        .sort((a, b) => b.length - a.length)
        .map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
        .join("|")})`,
    "g"
);

function BingoTerm({ term }: { term: keyof typeof BINGO_TERMS }) {
    const t = useTranslations();
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
                className="nl-bingo-term"
                onMouseEnter={() => {
                    cancelClose();
                    setOpen(true);
                }}
                onMouseLeave={scheduleClose}
            >
                <Popover.Trigger asChild>
                    <button
                        type="button"
                        aria-label={t("bingo.termAria", { term })}
                        className="nl-bingo-term__trigger"
                        onFocus={() => setOpen(true)}
                        onClick={(event) => {
                            // Hover or focus may already have opened the help.
                            // A tap must keep it open instead of toggling it shut.
                            event.preventDefault();
                            cancelClose();
                            setOpen(true);
                        }}
                    >
                        <span>{term}</span>
                        <CircleHelp size={14} aria-hidden />
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
                    className="noslog-ui nl-bingo-term__popover nl-body-secondary"
                >
                    <strong className="nl-control">{term}</strong>
                    <p>{t(BINGO_TERMS[term])}</p>
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
