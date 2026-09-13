import HomeAnnouncements from "@/components/home/homeAnnouncements";
import OfficialXPost from "@/components/home/officialXPost";
import PageContainer from "@/components/layout/pageContainer";
import HomeSearch from "@/features/home/components/homeSearch";
import HomeDestinations from "@/features/home/components/homeDestinations";
import CriticalAnnouncement from "@/features/announcements/components/criticalAnnouncement";
import { getHomeAnnouncements } from "@/features/announcements/server/publicAnnouncementService";
import { getOfficialXLatestPost } from "@/features/home/server/officialXPostService";
import { getServerI18n } from "@/lib/i18n/server";
import { getLocalizedHref } from "@/lib/i18n/routing";
import { SITE_NAME, SITE_URL } from "@/lib/metadata/site";
import { getUser } from "@/lib/user";

export default async function HomePage() {
    const { locale, t } = await getServerI18n();
    // 셸이 이미 같은 요청에서 세션을 읽는다(getSessionUser 는 요청 단위 cache) — 조회가 늘지 않는다
    const [announcements, officialPost, user] = await Promise.all([
        getHomeAnnouncements(locale),
        getOfficialXLatestPost(),
        getUser(),
    ]);
    const homeHref = getLocalizedHref("/", locale);
    const musicHref = getLocalizedHref("/music", locale);
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: SITE_NAME,
        url: `${SITE_URL}${homeHref}`,
        description: t("home.tagline"),
        inLanguage: locale,
        potentialAction: {
            "@type": "SearchAction",
            target: `${SITE_URL}${musicHref}?q={search_term_string}`,
            "query-input": "required name=search_term_string",
        },
    };
    return (
        <PageContainer className="nl-home">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(structuredData).replaceAll(
                        "<",
                        "\\u003c"
                    ),
                }}
            />
            <CriticalAnnouncement announcement={announcements.critical} />
            <section className="nl-home-hero">
                <div className="nl-home-identity">
                    <span
                        className="nl-home-mark nl-section-title"
                        aria-hidden
                        lang="en"
                    >
                        N
                    </span>
                    <div className="nl-home-identity__copy">
                        <h1 className="nl-page-title" lang="en">
                            NosLog
                        </h1>
                        <p className="nl-body-secondary nl-muted">
                            {t("home.tagline")}
                        </p>
                    </div>
                </div>
                <HomeSearch />
            </section>
            <HomeDestinations isAuthenticated={Boolean(user)} />
            <div className="nl-home-updates">
                <HomeAnnouncements items={announcements.list} />
                <OfficialXPost post={officialPost} />
            </div>
        </PageContainer>
    );
}
