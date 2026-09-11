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
                {/* 목록 행과 같은 문법 — 분류·날짜 한 줄이 제목 위 */}
                <header className="nl-announcements__heading">
                    <div className="nl-announcement-meta nl-metadata nl-muted">
                        <AnnouncementCategoryTag
                            category={announcement.category}
                            label={t(
                                `announcements.category.${announcement.category}`
                            )}
                        />
                        <p>
                            {t("announcements.published")}{" "}
                            <time dateTime={announcement.publishedAt}>
                                {announcementDate(
                                    announcement.publishedAt,
                                    locale
                                )}
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
                    <h1 className="nl-page-title">{announcement.title}</h1>
                </header>
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
