import "server-only";
import { unstable_cache } from "next/cache";
import db from "@/lib/db";
import { CACHE_TAGS } from "@/lib/cacheTags";
import { PUBLIC_DATA_REVALIDATE_SECONDS } from "@/lib/cachePolicy";
import {
    adjacentAnnouncements,
    eligibleAnnouncements,
    localizeAnnouncement,
    selectArchivePage,
    selectHomeAnnouncements,
} from "@/features/announcements/schemas/publicAnnouncementSchema";
import type { AnnouncementCategory } from "@/features/announcements/schemas/publicAnnouncementSchema";
import type { Locale } from "@/lib/i18n/routing";

const queryCandidates = unstable_cache(
    async () =>
        db.announcement.findMany({
            where: { isPublished: true, publicSlug: { not: null } },
            select: {
                id: true,
                publicSlug: true,
                isPublished: true,
                publishedAt: true,
                placement: true,
                category: true,
                priority: true,
                activeFrom: true,
                expiresAt: true,
                translations: {
                    select: {
                        locale: true,
                        title: true,
                        content: true,
                        modifiedAt: true,
                    },
                },
            },
        }),
    ["public-announcements-v3"],
    {
        tags: [CACHE_TAGS.announcements],
        revalidate: PUBLIC_DATA_REVALIDATE_SECONDS,
    }
);

export async function getPublicAnnouncements() {
    // Scheduling is evaluated on each read, not frozen inside the cached query.
    return eligibleAnnouncements(await queryCandidates(), new Date());
}
export async function getAnnouncementArchive(
    locale: Locale,
    category: AnnouncementCategory | null,
    page: number
) {
    const selected = selectArchivePage(
        await getPublicAnnouncements(),
        new Date(),
        category,
        page
    );
    if (!selected) return null;
    return {
        category,
        page: selected.page,
        totalPages: selected.totalPages,
        pinned: selected.pinned.map((item) =>
            localizeAnnouncement(item, locale)
        ),
        announcements: selected.list.map((item) =>
            localizeAnnouncement(item, locale)
        ),
    };
}
export async function getAnnouncement(locale: Locale, slug: string) {
    const records = await getPublicAnnouncements();
    const record = records.find((item) => item.publicSlug === slug);
    if (!record) return null;
    const { older, newer } = adjacentAnnouncements(records, record.id);
    return {
        ...localizeAnnouncement(record, locale),
        older: older ? localizeAnnouncement(older, locale) : null,
        newer: newer ? localizeAnnouncement(newer, locale) : null,
    };
}
export async function getHomeAnnouncements(locale: Locale) {
    const selected = selectHomeAnnouncements(
        await getPublicAnnouncements(),
        new Date()
    );
    return {
        list: selected.list.map(({ record, pinned }) => ({
            announcement: localizeAnnouncement(record, locale),
            pinned,
        })),
        critical: selected.critical
            ? localizeAnnouncement(selected.critical, locale)
            : null,
    };
}
