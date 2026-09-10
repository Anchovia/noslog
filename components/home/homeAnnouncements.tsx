import Link from "next/link";
import { getServerI18n } from "@/lib/i18n/server";
import { getLocalizedHref } from "@/lib/i18n/routing";
import AnnouncementRow from "@/features/announcements/components/announcementRow";
import type { PublicAnnouncement } from "@/features/announcements/schemas/publicAnnouncementSchema";

interface HomeAnnouncementsProps {
    items: { announcement: PublicAnnouncement; pinned: boolean }[];
}

export default async function HomeAnnouncements({
    items,
}: HomeAnnouncementsProps) {
    if (!items.length) return null;
    const { locale, t } = await getServerI18n();
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
                </Link>
            </div>
            <ul>
                {items.map(({ announcement, pinned }) => (
                    <li key={announcement.id}>
                        <AnnouncementRow
                            announcement={announcement}
                            locale={locale}
                            categoryLabel={t(
                                `announcements.category.${announcement.category}`
                            )}
                            pinned={pinned}
                        />
                    </li>
                ))}
            </ul>
        </section>
    );
}
