import type { Metadata } from "next";
import { notFound } from "next/navigation";

import BackLink from "@/components/ui/back-link";
import {
    privacyHistoryCopy,
    privacyVersionPeriod,
} from "@/features/privacy/content/privacy-content";
import TermsPage from "@/features/terms/components/terms-page";
import {
    getTermsVersion,
    getTermsVersionCopy,
} from "@/features/terms/content/terms-content";
import { localizePath } from "@/lib/i18n/routing";
import { getServerI18n } from "@/lib/i18n/server";
import { createPageMetadata } from "@/lib/metadata/site";

type Props = { params: Promise<{ version: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const [{ version: id }, { locale }] = await Promise.all([
        params,
        getServerI18n(),
    ]);
    const version = getTermsVersion(id);
    if (!version) return {};
    return createPageMetadata({
        title: `${getTermsVersionCopy(version, locale).title} · ${privacyVersionPeriod(version, locale)}`,
        path: localizePath(`/terms/history/${version.id}`, locale),
    });
}

export default async function TermsVersionPage({ params }: Props) {
    const [{ version: id }, { locale }] = await Promise.all([
        params,
        getServerI18n(),
    ]);
    const version = getTermsVersion(id);
    if (!version) notFound();
    const history = privacyHistoryCopy[locale];
    return (
        <TermsPage
            locale={locale}
            copy={getTermsVersionCopy(version, locale)}
            period={history.period(privacyVersionPeriod(version, locale))}
            back={
                <BackLink href={localizePath("/terms/history", locale)}>
                    {history.title}
                </BackLink>
            }
        />
    );
}
