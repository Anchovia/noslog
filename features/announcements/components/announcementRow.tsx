import Link from "next/link";
import { localizePath } from "@/lib/i18n/routing";
import type { Locale } from "@/lib/i18n/routing";
import type { PublicAnnouncement } from "@/features/announcements/schemas/publicAnnouncementSchema";
import AnnouncementCategoryTag from "./announcementCategoryTag";

export function announcementDate(date: string, locale: Locale) {
    return new Intl.DateTimeFormat(locale, {
        year: "numeric",
        month: locale === "en" ? "short" : locale === "ja" ? "long" : "numeric",
        day: "numeric",
        timeZone: "Asia/Seoul",
    }).format(new Date(date));
}
export default function AnnouncementRow({
    announcement,
    locale,
    categoryLabel,
}: {
    announcement: PublicAnnouncement;
    locale: Locale;
    categoryLabel: string;
}) {
    return (
        <div className="nl-announcement-row">
            <p className="nl-announcement-row__title nl-body">
                <AnnouncementCategoryTag
                    category={announcement.category}
                    label={categoryLabel}
                />
                <Link
                    prefetch={false}
                    href={localizePath(
                        `/announcements/${announcement.slug}`,
                        locale
                    )}
                >
                    {announcement.title}
                </Link>
            </p>
            <time
                className="nl-metadata nl-muted"
                dateTime={announcement.publishedAt}
            >
                {announcementDate(announcement.publishedAt, locale)}
            </time>
        </div>
    );
}
