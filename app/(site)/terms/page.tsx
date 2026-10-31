import type { Metadata } from "next";

import TermsPage from "@/features/terms/components/terms-page";
import { getTermsCopy } from "@/features/terms/content/terms-content";
import { localizePath } from "@/lib/i18n/routing";
import { getServerI18n } from "@/lib/i18n/server";
import { createPageMetadata } from "@/lib/metadata/site";

export async function generateMetadata(): Promise<Metadata> {
    const { locale, t } = await getServerI18n();
    return createPageMetadata({
        title: getTermsCopy(locale).title,
        description: t("terms.metaDescription"),
        path: localizePath("/terms", locale),
    });
}

export default async function TermsOfServicePage() {
    const { locale } = await getServerI18n();
    return <TermsPage locale={locale} copy={getTermsCopy(locale)} />;
}
