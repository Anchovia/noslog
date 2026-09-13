"use client";

import { Fragment } from "react";
import { useTranslations } from "@/components/i18n/localeProvider";
import TermHelp from "@/components/ui/termHelp";
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
    return (
        <TermHelp
            title={term}
            description={t(BINGO_TERMS[term])}
            ariaLabel={t("bingo.termAria", { term })}
        >
            {term}
        </TermHelp>
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
