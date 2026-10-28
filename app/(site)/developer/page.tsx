import PageContainer from "@/components/layout/page-container";
import AnnouncementBody from "@/features/announcements/components/announcement-body";
import { getDeveloperDocs } from "@/features/partner/content/developer-docs";
import { localizePath } from "@/lib/i18n/routing";
import { getServerI18n } from "@/lib/i18n/server";
import { createPageMetadata, SITE_URL } from "@/lib/metadata/site";

export async function generateMetadata() {
    const { locale } = await getServerI18n();
    const docs = getDeveloperDocs(locale);
    return createPageMetadata({
        title: docs.title,
        description: docs.description,
        path: localizePath("/developer", locale),
    });
}

/** 파트너 연동 문서(2026-10-20) — 공지와 같은 본문 부품으로 그린다. 셀프 등록 · 키 발급 화면은 두지 않는다 */
export default async function DeveloperPage() {
    const { locale, t } = await getServerI18n();
    const docs = getDeveloperDocs(locale);
    return (
        <PageContainer width="reading" className="nl-announcements">
            <article className="nl-announcements__detail">
                <header className="nl-announcements__heading">
                    <p className="nl-metadata nl-muted">{docs.description}</p>
                    <h1 className="nl-page-title">{docs.title}</h1>
                </header>
                <AnnouncementBody
                    content={docs.body}
                    locale={locale}
                    siteUrl={SITE_URL}
                    externalLabel={t("shell.externalLink")}
                />
            </article>
        </PageContainer>
    );
}
