import PageContainer from "@/components/layout/page-container";
import { getHomeAnnouncements } from "@/features/announcements/server/public-announcement-service";
import { getHomeLiveEvents } from "@/features/events/server/event-service";
import HomeAnnouncements from "@/features/home/components/home-announcements";
import HomeDestinations from "@/features/home/components/home-destinations";
import HomeEvents from "@/features/home/components/home-events";
import HomeSearch from "@/features/home/components/home-search";
import OfficialXPost from "@/features/home/components/official-x-post";
import { getOfficialXLatestPost } from "@/features/home/server/official-x-post-service";
import { getLocalizedHref } from "@/lib/i18n/routing";
import { getServerI18n } from "@/lib/i18n/server";
import { SITE_NAME, SITE_URL } from "@/lib/metadata/site";
import { getUser } from "@/lib/user";

export default async function HomePage() {
    const { locale, t } = await getServerI18n();
    // 셸이 이미 같은 요청에서 세션을 읽는다(getSessionUser 는 요청 단위 cache) — 조회가 늘지 않는다
    const [announcements, liveEvents, officialPost, user] = await Promise.all([
        getHomeAnnouncements(locale),
        getHomeLiveEvents(),
        getOfficialXLatestPost(),
        getUser(),
    ]);
    const homeHref = getLocalizedHref("/", locale);
    const musicHref = getLocalizedHref("/music", locale);
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: SITE_NAME,
        // 검색 결과의 사이트 이름 후보(Google 사이트 이름 — 2026-10-01 메타데이터 점검 S)
        alternateName: "노스로그",
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
                <HomeEvents events={liveEvents} />
                <OfficialXPost post={officialPost} />
            </div>
        </PageContainer>
    );
}
