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
export const publicAnnouncementSchema = z
    .object({
        id: z.number().int().positive(),
        publicSlug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
        isPublished: z.literal(true),
        publishedAt: dateValue,
        placement: z.enum(["ROUTINE", "SERVICE_CRITICAL"]),
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

export function selectHomeAnnouncements(
    records: PublicAnnouncementRecord[],
    now: Date
) {
    return {
        routine: records
            .filter((record) => record.placement === "ROUTINE")
            .slice(0, 3),
        critical:
            records
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
                )[0] ?? null,
    };
}
