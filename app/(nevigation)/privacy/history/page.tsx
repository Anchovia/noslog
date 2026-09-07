import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
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
            <Link
                href={localizePath("/privacy", locale)}
                className="nl-privacy-history__back nl-control"
            >
                <ChevronLeft className="nl-icon" aria-hidden />
                {getPrivacyCopy(locale).title}
            </Link>
            <h1 className="nl-page-title">{copy.title}</h1>
            <p className="nl-body nl-muted">{copy.empty}</p>
        </div>
    );
}
