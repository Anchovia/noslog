import "server-only";
import { unstable_cache } from "next/cache";
import db from "@/lib/db";
import { CACHE_TAGS } from "@/lib/cacheTags";
import { PUBLIC_DATA_REVALIDATE_SECONDS } from "@/lib/cachePolicy";
import {
    eligibleAnnouncements,
    localizeAnnouncement,
    selectHomeAnnouncements,
    ANNOUNCEMENTS_PAGE_SIZE,
} from "@/features/announcements/schemas/publicAnnouncementSchema";
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
    ["public-announcements-v2"],
    {
        tags: [CACHE_TAGS.announcements],
        revalidate: PUBLIC_DATA_REVALIDATE_SECONDS,
    }
);

export async function getPublicAnnouncements() {
    // Scheduling is evaluated on each read, not frozen inside the cached query.
    return eligibleAnnouncements(await queryCandidates(), new Date());
}
export async function getAnnouncementArchive(locale: Locale, page: number) {
    const records = await getPublicAnnouncements();
    const totalPages = Math.max(
        1,
        Math.ceil(records.length / ANNOUNCEMENTS_PAGE_SIZE)
    );
    if (page > totalPages) return null;
    return {
        page,
        totalPages,
        announcements: records
            .slice(
                (page - 1) * ANNOUNCEMENTS_PAGE_SIZE,
                page * ANNOUNCEMENTS_PAGE_SIZE
            )
            .map((item) => localizeAnnouncement(item, locale)),
    };
}
export async function getAnnouncement(locale: Locale, slug: string) {
    const record = (await getPublicAnnouncements()).find(
        (item) => item.publicSlug === slug
    );
    return record ? localizeAnnouncement(record, locale) : null;
}
export async function getHomeAnnouncements(locale: Locale) {
    const selected = selectHomeAnnouncements(
        await getPublicAnnouncements(),
        new Date()
    );
    return {
        routine: selected.routine.map((item) =>
            localizeAnnouncement(item, locale)
        ),
        critical: selected.critical
            ? localizeAnnouncement(selected.critical, locale)
            : null,
    };
}
