import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { getServerI18n } from "@/lib/i18n/server";
import { getLocalizedHref } from "@/lib/i18n/routing";

interface HomeAnnouncementsProps {
    announcements: {
        id: number;
        title: string;
        content: string;
        publishedAt: string | null;
    }[];
}

export default async function HomeAnnouncements({
    announcements,
}: HomeAnnouncementsProps) {
    if (!announcements.length) return null;
    const { locale, t } = await getServerI18n();
    const formatter = new Intl.DateTimeFormat(locale, {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    });
    return (
        <section className="nl-home-update nl-home-announcements">
            <div className="nl-home-update__heading">
                <h2 className="nl-component-title">
                    {t("home.announcements")}
                </h2>
                <Link
                    href={getLocalizedHref("/announcements", locale)}
                    className="nl-control"
                >
                    {t("home.allAnnouncements")}
                    <ChevronRight aria-hidden />
                </Link>
            </div>
            <ul>
                {announcements.slice(0, 3).map((announcement) => (
                    <li key={announcement.id}>
                        <Link
                            href={getLocalizedHref(
                                `/announcements/${announcement.id}`,
                                locale
                            )}
                            className="nl-home-announcement"
                        >
                            <span className="nl-body">
                                {announcement.title}
                            </span>
                            {announcement.publishedAt ? (
                                <time
                                    dateTime={announcement.publishedAt}
                                    className="nl-metadata nl-muted"
                                >
                                    {formatter.format(
                                        new Date(announcement.publishedAt)
                                    )}
                                </time>
                            ) : null}
                        </Link>
                    </li>
                ))}
            </ul>
        </section>
    );
}
