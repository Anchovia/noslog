import type { Metadata } from "next";
import PrivacyPage from "@/features/privacy/components/privacyPage";
import { getPrivacyCopy } from "@/features/privacy/content/privacyContent";
import { getServerI18n } from "@/lib/i18n/server";
import { localizePath } from "@/lib/i18n/routing";
import { createPageMetadata } from "@/lib/metadata/site";
import getSession from "@/lib/session";

export async function generateMetadata(): Promise<Metadata> {
    const { locale } = await getServerI18n();
    const copy = getPrivacyCopy(locale);
    return createPageMetadata({
        title: copy.title,
        description: copy.summary[0].text,
        path: localizePath("/privacy", locale),
    });
}

export default async function PrivacyPolicyPage() {
    const [{ locale }, session] = await Promise.all([
        getServerI18n(),
        getSession(),
    ]);
    return <PrivacyPage locale={locale} isAuthenticated={!!session.id} />;
}
