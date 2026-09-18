import { z } from "zod";
import { SUPPORTED_LOCALES } from "@/lib/i18n/routing";
import type { Locale } from "@/lib/i18n/routing";

const boundedText = (maximum: number) =>
    z
        .string()
        .refine(
            (value) =>
                value.trim().length > 0 && Array.from(value).length <= maximum
        );
const dateValue = z.union([z.date(), z.iso.datetime()]).pipe(z.coerce.date());
export const ANNOUNCEMENT_CATEGORIES = [
    "UPDATE",
    "MAINTENANCE",
    "DATA",
    "NOTICE",
] as const;
export type AnnouncementCategory = (typeof ANNOUNCEMENT_CATEGORIES)[number];

// 목록 분류 필터 주소 — ?category=update (소문자). 없으면 전체(null), 모르는 값이면 undefined
export function announcementCategoryFromQuery(
    value: string | undefined
): AnnouncementCategory | null | undefined {
    if (value === undefined) return null;
    return ANNOUNCEMENT_CATEGORIES.find(
        (category) => category.toLowerCase() === value
    );
}
export function announcementsQuery(
    category: AnnouncementCategory | null,
    page: number
) {
    const params = new URLSearchParams();
    if (category) params.set("category", category.toLowerCase());
    if (page > 1) params.set("page", String(page));
    const query = params.toString();
    return query ? `?${query}` : "";
}
export const publicAnnouncementSchema = z
    .object({
        id: z.number().int().positive(),
        publicSlug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
        isPublished: z.literal(true),
        publishedAt: dateValue,
        placement: z.enum(["ROUTINE", "SERVICE_CRITICAL"]),
        category: z.enum(ANNOUNCEMENT_CATEGORIES).default("NOTICE"),
        priority: z.number().int(),
        activeFrom: dateValue.nullable(),
        expiresAt: dateValue.nullable(),
        translations: z
            .array(
                z.object({
                    locale: z.enum(SUPPORTED_LOCALES),
                    title: boundedText(80),
                    content: boundedText(5000),
                    modifiedAt: dateValue.nullable(),
                })
            )
            .refine(
                (items) =>
                    items.length === 3 &&
                    SUPPORTED_LOCALES.every((locale) =>
                        items.some((item) => item.locale === locale)
                    )
            ),
    })
    .refine(
        (item) =>
            item.placement !== "SERVICE_CRITICAL" ||
            (item.activeFrom !== null &&
                item.activeFrom >= item.publishedAt &&
                (!item.expiresAt || item.expiresAt > item.activeFrom))
    );
export type PublicAnnouncementRecord = z.infer<typeof publicAnnouncementSchema>;
export const ANNOUNCEMENTS_PAGE_SIZE = 20;

export function localizeAnnouncement(
    record: PublicAnnouncementRecord,
    locale: Locale
) {
    const translation = record.translations.find(
        (item) => item.locale === locale
    )!;
    return {
        id: record.id,
        slug: record.publicSlug,
        category: record.category,
        title: translation.title,
        content: translation.content,
        publishedAt: record.publishedAt.toISOString(),
        modifiedAt:
            translation.modifiedAt &&
            translation.modifiedAt > record.publishedAt
                ? translation.modifiedAt.toISOString()
                : null,
    };
}
export type PublicAnnouncement = ReturnType<typeof localizeAnnouncement>;

export function eligibleAnnouncements(records: unknown[], now: Date) {
    return records
        .flatMap((record) => {
            const parsed = publicAnnouncementSchema.safeParse(record);
            return parsed.success && parsed.data.publishedAt <= now
                ? [parsed.data]
                : [];
        })
        .sort(
            (a, b) =>
                b.publishedAt.getTime() - a.publishedAt.getTime() || b.id - a.id
        );
}

// 활성 중대 공지 — 홈 배너 후보이자 목록 맨 위에 고정되는 항목
function activeCriticalAnnouncements(
    records: PublicAnnouncementRecord[],
    now: Date
) {
    return records
        .filter(
            (record) =>
                record.placement === "SERVICE_CRITICAL" &&
                record.activeFrom &&
                record.activeFrom <= now &&
                (!record.expiresAt || now < record.expiresAt)
        )
        .sort(
            (a, b) =>
                b.priority - a.priority ||
                b.publishedAt.getTime() - a.publishedAt.getTime() ||
                b.id - a.id
        );
}

export function selectHomeAnnouncements(
    records: PublicAnnouncementRecord[],
    now: Date
) {
    const active = activeCriticalAnnouncements(records, now);
    const activeIds = new Set(active.map((record) => record.id));
    return {
        list: [
            ...active.map((record) => ({ record, pinned: true })),
            ...records
                .filter((record) => !activeIds.has(record.id))
                .map((record) => ({ record, pinned: false })),
        ].slice(0, 3),
        critical: active[0] ?? null,
    };
}

// 전체 공지 한 페이지 (2026-09-18 B1) — 고른 분류 안에서, 활성 중대 공지는 1페이지 맨 위에 고정하고
// 날짜 목록에서는 빼서 두 번 보이지 않게 한다. 쪽수는 고정을 뺀 목록으로 센다.
export function selectArchivePage(
    records: PublicAnnouncementRecord[],
    now: Date,
    category: AnnouncementCategory | null,
    page: number
) {
    const matching = category
        ? records.filter((record) => record.category === category)
        : records;
    const pinned = activeCriticalAnnouncements(matching, now);
    const pinnedIds = new Set(pinned.map((record) => record.id));
    const rest = matching.filter((record) => !pinnedIds.has(record.id));
    const totalPages = Math.max(
        1,
        Math.ceil(rest.length / ANNOUNCEMENTS_PAGE_SIZE)
    );
    if (page > totalPages) return null;
    return {
        page,
        totalPages,
        pinned: page === 1 ? pinned : [],
        list: rest.slice(
            (page - 1) * ANNOUNCEMENTS_PAGE_SIZE,
            page * ANNOUNCEMENTS_PAGE_SIZE
        ),
    };
}

// 상세 끝 이전 · 다음 글 (2026-09-18) — 분류와 관계없이 게시 순서. 이전 = 더 오래된 글, 다음 = 더 새 글
export function adjacentAnnouncements(
    records: PublicAnnouncementRecord[],
    id: number
) {
    const index = records.findIndex((record) => record.id === id);
    if (index < 0) return { older: null, newer: null };
    return {
        older: records[index + 1] ?? null,
        newer: index > 0 ? records[index - 1] : null,
    };
}
