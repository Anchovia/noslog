import { ChevronRight } from "lucide-react";
import Link from "next/link";

import AnnouncementRow from "@/features/announcements/components/announcement-row";
import type { PublicAnnouncementSummary } from "@/features/announcements/schemas/public-announcement-schema";
import { getLocalizedHref } from "@/lib/i18n/routing";
import { getServerI18n } from "@/lib/i18n/server";

interface HomeAnnouncementsProps {
    items: { announcement: PublicAnnouncementSummary; pinned: boolean }[];
}

export default async function HomeAnnouncements({
    items,
}: HomeAnnouncementsProps) {
    if (!items.length) return null;
    const { locale, t } = await getServerI18n();
    return (
        <section className="nl-home-update nl-home-announcements">
            <div className="nl-heading-row">
                <h2 className="nl-section-title">{t("home.announcements")}</h2>
                <Link
                    href={getLocalizedHref("/announcements", locale)}
                    className="nl-heading-link nl-control"
                >
                    {t("home.allAnnouncements")}
                    {/* 공용 제목 링크(nl-heading-link) — 꺾쇠 16 · 간격 4 · 광학 −4 */}
                    <ChevronRight aria-hidden />
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
                            pinnedLabel={
                                pinned ? t("announcements.pinned") : undefined
                            }
                        />
                    </li>
                ))}
            </ul>
        </section>
    );
}
