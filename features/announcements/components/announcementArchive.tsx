import { Fragment } from "react";
import PageContainer, { PageHeading } from "@/components/layout/pageContainer";
import { getServerI18n } from "@/lib/i18n/server";
import type { PublicAnnouncement } from "@/features/announcements/schemas/publicAnnouncementSchema";
import AnnouncementRow from "./announcementRow";
import AnnouncementPagination from "./announcementPagination";

export default async function AnnouncementArchive({
    announcements,
    page,
    totalPages,
}: {
    announcements: PublicAnnouncement[];
    page: number;
    totalPages: number;
}) {
    const { locale, t } = await getServerI18n();
    const month = new Intl.DateTimeFormat(locale, {
        year: "numeric",
        month: "long",
        timeZone: "Asia/Seoul",
    });
    return (
        <PageContainer width="reading" className="nl-announcements">
            <PageHeading title={t("home.announcements")} />
            {announcements.length ? (
                <ul className="nl-announcements__list">
                    {announcements.map((announcement, index) => {
                        const label = month.format(
                            new Date(announcement.publishedAt)
                        );
                        const startsMonth =
                            index === 0 ||
                            month.format(
                                new Date(announcements[index - 1].publishedAt)
                            ) !== label;
                        return (
                            <Fragment key={announcement.id}>
                                <li>
                                    {startsMonth ? (
                                        <h2 className="nl-section-title nl-announcements__month">
                                            {label}
                                        </h2>
                                    ) : null}
                                    <AnnouncementRow
                                        announcement={announcement}
                                        locale={locale}
                                        categoryLabel={t(
                                            `announcements.category.${announcement.category}`
                                        )}
                                    />
                                </li>
                            </Fragment>
                        );
                    })}
                </ul>
            ) : (
                <p className="nl-body nl-muted">{t("announcements.empty")}</p>
            )}
            <AnnouncementPagination page={page} totalPages={totalPages} />
        </PageContainer>
    );
}
