import "server-only";
import { unstable_cache } from "next/cache";
import db from "@/lib/db";
import { CACHE_TAGS } from "@/lib/cacheTags";
import { PUBLIC_DATA_REVALIDATE_SECONDS } from "@/lib/cachePolicy";
import {
    adjacentAnnouncements,
    eligibleAnnouncements,
    eligibleAnnouncementSummaries,
    localizeAnnouncementSummary,
    localizeAnnouncement,
    selectArchivePage,
    selectHomeAnnouncements,
} from "@/features/announcements/schemas/publicAnnouncementSchema";
import type { AnnouncementCategory } from "@/features/announcements/schemas/publicAnnouncementSchema";
import type { Locale } from "@/lib/i18n/routing";

// String.trim()과 같은 공백 집합. 본문을 전송하지 않고 기존 빈 본문 판정을 유지한다.
const CONTENT_WHITESPACE =
    "\u0009\u000a\u000b\u000c\u000d\u0020\u00a0\u1680\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u2028\u2029\u202f\u205f\u3000\ufeff";
const cacheOptions = {
    tags: [CACHE_TAGS.announcements],
    revalidate: PUBLIC_DATA_REVALIDATE_SECONDS,
};
const queryCandidates = unstable_cache(
    () => db.$queryRaw<unknown[]>`
        SELECT a.id, a.public_slug AS "publicSlug", a.is_published AS "isPublished",
            a.published_at AS "publishedAt", a.placement, a.category, a.priority,
            a.active_from AS "activeFrom", a.expires_at AS "expiresAt",
            COALESCE((
                SELECT jsonb_agg(jsonb_build_object(
                    'locale', t.locale, 'title', t.title,
                    'modifiedAt', to_char(t.modified_at, 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'),
                    'contentLength', char_length(t.content),
                    'hasContent', length(btrim(t.content, ${CONTENT_WHITESPACE})) > 0
                )) FROM "AnnouncementTranslation" t WHERE t.announcement_id = a.id
            ), '[]'::jsonb) AS translations
        FROM "Announcement" a
        WHERE a.is_published = true AND a.public_slug IS NOT NULL
    `,
    ["public-announcement-summaries-v1"],
    cacheOptions
);
const queryDetail = unstable_cache(
    (id: number) =>
        db.announcement.findUnique({
            where: { id },
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
    ["public-announcement-detail-v1"],
    cacheOptions
);

export async function getPublicAnnouncements() {
    // Scheduling is evaluated on each read, not frozen inside the cached query.
    return eligibleAnnouncementSummaries(await queryCandidates(), new Date());
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
            localizeAnnouncementSummary(item, locale)
        ),
        announcements: selected.list.map((item) =>
            localizeAnnouncementSummary(item, locale)
        ),
    };
}
export async function getAnnouncement(locale: Locale, slug: string) {
    const records = await getPublicAnnouncements();
    const record = records.find((item) => item.publicSlug === slug);
    if (!record) return null;
    const [detail] = eligibleAnnouncements(
        [await queryDetail(record.id)],
        new Date()
    );
    if (!detail || detail.publicSlug !== slug) return null;
    const { older, newer } = adjacentAnnouncements(records, record.id);
    return {
        ...localizeAnnouncement(detail, locale),
        older: older ? localizeAnnouncementSummary(older, locale) : null,
        newer: newer ? localizeAnnouncementSummary(newer, locale) : null,
    };
}
export async function getHomeAnnouncements(locale: Locale) {
    const selected = selectHomeAnnouncements(
        await getPublicAnnouncements(),
        new Date()
    );
    return {
        list: selected.list.map(({ record, pinned }) => ({
            announcement: localizeAnnouncementSummary(record, locale),
            pinned,
        })),
        critical: selected.critical
            ? localizeAnnouncementSummary(selected.critical, locale)
            : null,
    };
}
