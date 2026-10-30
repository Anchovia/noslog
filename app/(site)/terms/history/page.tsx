import type { Metadata } from "next";

import BackLink from "@/components/ui/back-link";
import IntentLink from "@/components/ui/intent-link";
import {
    privacyHistoryCopy,
    privacyVersionPeriod,
} from "@/features/privacy/content/privacy-content";
import {
    getTermsCopy,
    TERMS_PREVIOUS_VERSIONS,
} from "@/features/terms/content/terms-content";
import { localizePath } from "@/lib/i18n/routing";
import { getServerI18n } from "@/lib/i18n/server";
import { createPageMetadata } from "@/lib/metadata/site";

export async function generateMetadata(): Promise<Metadata> {
    const { locale } = await getServerI18n();
    return createPageMetadata({
        title: privacyHistoryCopy[locale].title,
        path: localizePath("/terms/history", locale),
    });
}
export default async function TermsHistoryPage() {
    const { locale } = await getServerI18n();
    const copy = privacyHistoryCopy[locale];
    return (
        <div className="nl-privacy-history">
            <BackLink href={localizePath("/terms", locale)}>
                {getTermsCopy(locale).title}
            </BackLink>
            <h1 className="nl-page-title">{copy.title}</h1>
            {TERMS_PREVIOUS_VERSIONS.length > 0 ? (
                <ul className="nl-privacy-history__list nl-body">
                    {TERMS_PREVIOUS_VERSIONS.map((version) => (
                        <li key={version.id}>
                            <IntentLink
                                className="nl-link nl-text-link--underlined"
                                href={localizePath(
                                    `/terms/history/${version.id}`,
                                    locale
                                )}
                            >
                                {privacyVersionPeriod(version, locale)}
                            </IntentLink>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="nl-body nl-muted">{copy.empty}</p>
            )}
        </div>
    );
}
