import Markdown from "react-markdown";
import { ExternalLink } from "lucide-react";
import { getLocalizedHref } from "@/lib/i18n/routing";
import type { Locale } from "@/lib/i18n/routing";

export function announcementLink(
    href: string,
    locale: Locale,
    siteUrl: string
) {
    if (!href || /[\u0000-\u0020\\]/u.test(href)) return null;
    try {
        const url = new URL(href, siteUrl);
        if (url.protocol !== "http:" && url.protocol !== "https:") return null;
        const external = url.origin !== new URL(siteUrl).origin;
        return {
            href: external
                ? url.href
                : href.startsWith("#")
                  ? href
                  : getLocalizedHref(
                        `${url.pathname}${url.search}${url.hash}`,
                        locale
                    ),
            external,
        };
    } catch {
        return null;
    }
}

export default function AnnouncementBody({
    content,
    locale,
    siteUrl,
    externalLabel,
}: {
    content: string;
    locale: Locale;
    siteUrl: string;
    externalLabel: string;
}) {
    return (
        <div className="nl-announcement-body nl-body">
            <Markdown
                skipHtml
                allowedElements={[
                    "p",
                    "h2",
                    "h3",
                    "ul",
                    "ol",
                    "li",
                    "strong",
                    "a",
                ]}
                urlTransform={(url) =>
                    announcementLink(url, locale, siteUrl)?.href ?? ""
                }
                components={{
                    h2: ({ children }) => (
                        <h2 className="nl-section-title">{children}</h2>
                    ),
                    h3: ({ children }) => (
                        <h3 className="nl-component-title">{children}</h3>
                    ),
                    a: ({ href, children }) => {
                        const link = announcementLink(
                            href ?? "",
                            locale,
                            siteUrl
                        );
                        if (!link) return <>{children}</>;
                        return (
                            <a href={link.href}>
                                {children}
                                {link.external ? (
                                    <>
                                        <ExternalLink aria-hidden />
                                        <span className="sr-only">
                                            {" "}
                                            ({externalLabel})
                                        </span>
                                    </>
                                ) : null}
                            </a>
                        );
                    },
                }}
            >
                {content}
            </Markdown>
        </div>
    );
}
