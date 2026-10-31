import type { ReactNode } from "react";

import IntentLink from "@/components/ui/intent-link";
import PrivacyContents from "@/features/privacy/components/privacy-contents";
import { PolicyBlock } from "@/features/privacy/components/privacy-page";
import type { TermsCopy } from "@/features/terms/schemas/terms-copy-schema";
import type { Locale } from "@/lib/i18n/routing";
import { localizePath } from "@/lib/i18n/routing";

// 처리방침과 같은 틀(머리 · 목차 · 절)이라 처리방침 스타일과 목차를 그대로 쓴다
export default function TermsPage({
    locale,
    copy,
    period,
    back,
}: {
    locale: Locale;
    copy: TermsCopy;
    period?: string;
    back?: ReactNode;
}) {
    return (
        <div className="nl-privacy">
            {back ? <div className="nl-privacy-back">{back}</div> : null}
            <header className="nl-privacy-identity">
                <h1 className="nl-page-title">{copy.title}</h1>
                <p className="nl-metadata nl-muted">{copy.dates}</p>
                {period ? (
                    <p className="nl-body-secondary nl-muted">{period}</p>
                ) : null}
            </header>
            <PrivacyContents
                title={copy.contents}
                idPrefix="terms"
                sections={copy.sections.map(({ id, title }) => ({ id, title }))}
            />
            <article className="nl-privacy-prose nl-body">
                {copy.sections.map((section) => (
                    <section
                        key={section.id}
                        className="nl-privacy-section"
                        aria-labelledby={`terms-${section.id}`}
                    >
                        <h2
                            className="nl-section-title"
                            id={`terms-${section.id}`}
                            tabIndex={-1}
                        >
                            {section.title}
                        </h2>
                        {section.blocks.map((block, index) => (
                            <PolicyBlock
                                key={index}
                                block={block}
                                sectionTitle={section.title}
                            />
                        ))}
                        {section.id === "changes" ? (
                            <IntentLink
                                className="nl-link nl-text-link--underlined"
                                href={localizePath("/terms/history", locale)}
                            >
                                {copy.historyLink}
                            </IntentLink>
                        ) : null}
                        {section.id === "withdrawal" ? (
                            <IntentLink
                                className="nl-link nl-text-link--underlined"
                                href={`${localizePath("/privacy", locale)}#privacy-destruction`}
                            >
                                {copy.privacyLink}
                            </IntentLink>
                        ) : null}
                    </section>
                ))}
            </article>
        </div>
    );
}
