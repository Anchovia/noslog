import BackLink from "@/components/ui/backLink";
import PageContainer from "@/components/layout/pageContainer";
import { getServerI18n } from "@/lib/i18n/server";
import { localizePath } from "@/lib/i18n/routing";
import { SITE_URL } from "@/lib/metadata/site";
import type { PublicAnnouncement } from "@/features/announcements/schemas/publicAnnouncementSchema";
import AnnouncementBody from "./announcementBody";
import AnnouncementCategoryTag from "./announcementCategoryTag";
import { announcementDate } from "./announcementRow";

export default async function AnnouncementDetail({
    announcement,
}: {
    announcement: PublicAnnouncement;
}) {
    const { locale, t } = await getServerI18n();
    return (
        <PageContainer width="reading" className="nl-announcements">
            <article className="nl-announcements__detail">
                <BackLink href={localizePath("/announcements", locale)}>
                    {t("home.announcements")}
                </BackLink>
                <div className="nl-announcements__title">
                    <AnnouncementCategoryTag
                        category={announcement.category}
                        label={t(
                            `announcements.category.${announcement.category}`
                        )}
                    />
                    <h1 className="nl-page-title">{announcement.title}</h1>
                </div>
                <div className="nl-announcements__dates nl-metadata nl-muted">
                    <p>
                        {t("announcements.published")}{" "}
                        <time dateTime={announcement.publishedAt}>
                            {announcementDate(announcement.publishedAt, locale)}
                        </time>
                    </p>
                    {announcement.modifiedAt ? (
                        <p>
                            {t("announcements.updated")}{" "}
                            <time dateTime={announcement.modifiedAt}>
                                {announcementDate(
                                    announcement.modifiedAt,
                                    locale
                                )}
                            </time>
                        </p>
                    ) : null}
                </div>
                <AnnouncementBody
                    content={announcement.content}
                    locale={locale}
                    siteUrl={SITE_URL}
                    externalLabel={t("shell.externalLink")}
                />
            </article>
        </PageContainer>
    );
}
