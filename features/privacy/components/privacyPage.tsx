import Link from "next/link";
import { StatusMessage } from "@/components/ui/statusMessage";
import PrivacyContents from "@/features/privacy/components/privacyContents";
import { getPrivacyCopy } from "@/features/privacy/content/privacyContent";
import type { PrivacyCopy } from "@/features/privacy/schemas/privacyCopySchema";
import { createTranslator, getMessages } from "@/lib/i18n/messages";
import { localizePath } from "@/lib/i18n/routing";
import type { Locale } from "@/lib/i18n/routing";

function PolicyBlock({
    block,
}: {
    block: PrivacyCopy["sections"][number]["blocks"][number];
}) {
    switch (block.kind) {
        case "warning":
            return (
                <StatusMessage
                    severity="warning"
                    title={block.title}
                    description={block.text}
                />
            );
        case "item":
            return (
                <div className="nl-privacy-item">
                    <h3 className="nl-component-title">{block.title}</h3>
                    <p>{block.text}</p>
                </div>
            );
        case "list":
            return (
                <ul className="nl-privacy-list">
                    {block.items.map((text) => (
                        <li key={text}>{text}</li>
                    ))}
                </ul>
            );
        case "contact":
            return (
                <dl className="nl-privacy-contact">
                    <dt>{block.operatorLabel}</dt>
                    <dd>{block.operator}</dd>
                    <dt>{block.emailLabel}</dt>
                    <dd>
                        <a href={`mailto:${block.email}`}>{block.email}</a>
                    </dd>
                </dl>
            );
        default:
            return <p>{block.text}</p>;
    }
}

export default function PrivacyPage({
    locale,
    isAuthenticated,
}: {
    locale: Locale;
    isAuthenticated: boolean;
}) {
    const copy = getPrivacyCopy(locale);
    const t = createTranslator(getMessages(locale));
    const settingsPath = localizePath("/settings", locale);
    return (
        <div className="nl-privacy">
            <header className="nl-privacy-identity">
                <h1 className="nl-page-title">{copy.title}</h1>
                <p className="nl-metadata nl-muted">{copy.dates}</p>
            </header>
            <div className="nl-privacy-summary">
                {copy.summary.map((group) => (
                    <section
                        key={group.target}
                        className="nl-privacy-summary__group"
                    >
                        <h2 className="nl-component-title">{group.title}</h2>
                        <p className="nl-body-secondary">{group.text}</p>
                        <a
                            className="nl-control"
                            href={`#privacy-${group.target}`}
                            aria-label={`${copy.detailLabel}: ${group.title}`}
                        >
                            {copy.detailLabel}
                        </a>
                    </section>
                ))}
            </div>
            <PrivacyContents
                title={copy.contents}
                sections={copy.sections.map(({ id, title }) => ({ id, title }))}
            />
            <article className="nl-privacy-prose nl-body">
                {copy.sections.map((section) => (
                    <section
                        key={section.id}
                        className="nl-privacy-section"
                        aria-labelledby={`privacy-${section.id}`}
                    >
                        <h2
                            className="nl-section-title"
                            id={`privacy-${section.id}`}
                            tabIndex={-1}
                        >
                            {section.title}
                        </h2>
                        {section.blocks.map((block, index) => (
                            <PolicyBlock key={index} block={block} />
                        ))}
                        {section.id === "rights" ? (
                            <div className="nl-privacy-actions">
                                <Link
                                    href={
                                        isAuthenticated
                                            ? settingsPath
                                            : `${localizePath("/login", locale)}?returnTo=${encodeURIComponent(settingsPath)}`
                                    }
                                >
                                    {isAuthenticated
                                        ? t("settings.title")
                                        : copy.settingsLogin}
                                </Link>
                                {isAuthenticated ? (
                                    <Link
                                        href={localizePath(
                                            "/settings?category=account",
                                            locale
                                        )}
                                    >
                                        {t("settings.deleteTitle")}
                                    </Link>
                                ) : null}
                            </div>
                        ) : null}
                        {section.id === "history" ? (
                            <Link
                                href={localizePath("/privacy/history", locale)}
                            >
                                {copy.historyLink}
                            </Link>
                        ) : null}
                    </section>
                ))}
            </article>
        </div>
    );
}
