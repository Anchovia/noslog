import Link from "next/link";
import BackLink from "@/components/ui/backLink";
import { foundationButtonClass } from "@/components/ui/Button";
import PageContainer from "@/components/layout/pageContainer";
import { getServerI18n } from "@/lib/i18n/server";
import { localizePath } from "@/lib/i18n/routing";
import { SITE_URL } from "@/lib/metadata/site";
import type {
    PublicAnnouncement,
    PublicAnnouncementSummary,
} from "@/features/announcements/schemas/publicAnnouncementSchema";
import AnnouncementBody from "./announcementBody";
import AnnouncementCategoryTag from "./announcementCategoryTag";
import { announcementDate } from "./announcementRow";

export default async function AnnouncementDetail({
    announcement,
}: {
    announcement: PublicAnnouncement & {
        older: PublicAnnouncementSummary | null;
        newer: PublicAnnouncementSummary | null;
    };
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
                {/* 끝 — 이전(더 오래된) · 다음(더 새) 글 두 칸 + 목록으로. 없는 쪽은 빈 칸 (2026-09-18 결정 3). 공지가 하나뿐이면 목록으로만 */}
                <nav
                    className="nl-announcements__pager"
                    aria-label={t("announcements.pager")}
                >
                    {announcement.older || announcement.newer ? (
                        <div className="nl-announcements__adjacent">
                            {(["older", "newer"] as const).map((side) => {
                                const item = announcement[side];
                                return item ? (
                                    <Link
                                        key={side}
                                        prefetch={false}
                                        href={localizePath(
                                            `/announcements/${item.slug}`,
                                            locale
                                        )}
                                        className="nl-announcements__adjacent-link"
                                        data-side={side}
                                    >
                                        <span className="nl-metadata nl-muted">
                                            {t(`announcements.${side}`)}
                                        </span>
                                        <span className="nl-body-secondary">
                                            {item.title}
                                        </span>
                                    </Link>
                                ) : (
                                    <span key={side} aria-hidden />
                                );
                            })}
                        </div>
                    ) : null}
                    <Link
                        href={localizePath("/announcements", locale)}
                        className={foundationButtonClass({
                            variant: "secondary",
                            size: "sm",
                        })}
                    >
                        {t("announcements.backToList")}
                    </Link>
                </nav>
            </article>
        </PageContainer>
    );
}
