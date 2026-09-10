import type { Metadata } from "next";
import BackLink from "@/components/ui/backLink";
import {
    getPrivacyCopy,
    privacyHistoryCopy,
} from "@/features/privacy/content/privacyContent";
import { getServerI18n } from "@/lib/i18n/server";
import { localizePath } from "@/lib/i18n/routing";
import { createPageMetadata } from "@/lib/metadata/site";

export async function generateMetadata(): Promise<Metadata> {
    const { locale } = await getServerI18n();
    return createPageMetadata({
        title: privacyHistoryCopy[locale].title,
        path: localizePath("/privacy/history", locale),
    });
}
export default async function PrivacyHistoryPage() {
    const { locale } = await getServerI18n();
    const copy = privacyHistoryCopy[locale];
    return (
        <div className="nl-privacy-history">
            <BackLink href={localizePath("/privacy", locale)}>
                {getPrivacyCopy(locale).title}
            </BackLink>
            <h1 className="nl-page-title">{copy.title}</h1>
            <p className="nl-body nl-muted">{copy.empty}</p>
        </div>
    );
}
