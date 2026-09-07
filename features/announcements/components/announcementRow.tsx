import Link from "next/link";
import { localizePath } from "@/lib/i18n/routing";
import type { Locale } from "@/lib/i18n/routing";
import type { PublicAnnouncement } from "@/features/announcements/schemas/publicAnnouncementSchema";

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
}: {
    announcement: PublicAnnouncement;
    locale: Locale;
}) {
    return (
        <div className="nl-announcement-row">
            <Link
                prefetch={false}
                className="nl-body"
                href={localizePath(
                    `/announcements/${announcement.slug}`,
                    locale
                )}
            >
                {announcement.title}
            </Link>
            <time
                className="nl-metadata nl-muted"
                dateTime={announcement.publishedAt}
            >
                {announcementDate(announcement.publishedAt, locale)}
            </time>
        </div>
    );
}
