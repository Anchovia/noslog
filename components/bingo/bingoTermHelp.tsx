"use client";

import { Fragment } from "react";
import { useTranslations } from "@/components/i18n/localeProvider";
import TermHelp from "@/components/ui/termHelp";
import type { MessageKey } from "@/lib/i18n/messages";

const BINGO_TERMS: Record<string, MessageKey> = {
    테누토: "bingo.term.tenuto",
    글리산도: "bingo.term.glissando",
    트릴: "bingo.term.trill",
    "◆JUST": "bingo.term.sjust",
} as const;

// DB 미션 문구에는 「◆Just」 가 남아 있다 — 대소문자를 가리지 않고 찾고, 보여 줄 때는 정해 둔 표기 「◆JUST」 로 쓴다(2026-09-14)
const canonicalTerms = new Map(
    Object.keys(BINGO_TERMS).map((term) => [term.toLowerCase(), term])
);

const termPattern = new RegExp(
    `(${Object.keys(BINGO_TERMS)
        .sort((a, b) => b.length - a.length)
        .map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
        .join("|")})`,
    "gi"
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
    return text.split(termPattern).map((part, index) => {
        const term = canonicalTerms.get(part.toLowerCase());
        return term ? (
            <BingoTerm key={`${part}-${index}`} term={term} />
        ) : (
            <Fragment key={`${part}-${index}`}>{part}</Fragment>
        );
    });
}
