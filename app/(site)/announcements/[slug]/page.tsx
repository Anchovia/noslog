import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";

import AnnouncementDetail from "@/features/announcements/components/announcement-detail";
import { getAnnouncement } from "@/features/announcements/server/public-announcement-service";
import { localizePath } from "@/lib/i18n/routing";
import { getServerI18n } from "@/lib/i18n/server";
import { markdownExcerpt } from "@/lib/metadata/excerpt";
import { createPageMetadata, SITE_NAME, SITE_URL } from "@/lib/metadata/site";

const read = cache(getAnnouncement);
type Params = Promise<{ slug: string }>;
export async function generateMetadata({
    params,
}: {
    params: Params;
}): Promise<Metadata> {
    const [{ locale }, { slug }] = await Promise.all([getServerI18n(), params]);
    const item = await read(locale, slug);
    if (!item) notFound();
    const base = createPageMetadata({
        title: item.title,
        description: markdownExcerpt(item.content) ?? item.title,
        path: localizePath(`/announcements/${item.slug}`, locale),
    });
    return {
        ...base,
        openGraph: {
            ...base.openGraph,
            type: "article",
            publishedTime: item.publishedAt,
            ...(item.modifiedAt ? { modifiedTime: item.modifiedAt } : {}),
            authors: [SITE_NAME],
        },
    };
}
export default async function AnnouncementPage({ params }: { params: Params }) {
    const [{ locale }, { slug }] = await Promise.all([getServerI18n(), params]);
    const item = await read(locale, slug);
    if (!item) notFound();
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: item.title,
        inLanguage: locale,
        datePublished: item.publishedAt,
        ...(item.modifiedAt ? { dateModified: item.modifiedAt } : {}),
        url: `${SITE_URL}${localizePath(`/announcements/${item.slug}`, locale)}`,
        author: { "@type": "Organization", name: SITE_NAME },
        publisher: { "@type": "Organization", name: SITE_NAME },
    };
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(structuredData).replaceAll(
                        "<",
                        "\\u003c"
                    ),
                }}
            />
            <AnnouncementDetail announcement={item} />
        </>
    );
}
