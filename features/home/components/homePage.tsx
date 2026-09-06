import Link from "next/link";

import HomeAnnouncements from "@/components/home/homeAnnouncements";
import OfficialXTimeline from "@/components/home/officialXTimeline";
import { productDestinations } from "@/components/layout/destinations";
import PageContainer from "@/components/layout/pageContainer";
import HomeSearch from "@/features/home/components/homeSearch";
import { getPublishedAnnouncements } from "@/lib/announcements";
import { getServerI18n } from "@/lib/i18n/server";
import { getLocalizedHref } from "@/lib/i18n/routing";
import { SITE_NAME, SITE_URL } from "@/lib/metadata/site";

const destinationOrder = [
    "/music",
    "/music?scope=chart",
    "/tiers",
    "/rankings",
    "/bingo",
    "/exams",
    "/gamecenter",
    "/bookmarklet",
];

export default async function HomePage() {
    const [announcements, { locale, t }] = await Promise.all([
        getPublishedAnnouncements(),
        getServerI18n(),
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
            <nav aria-label={t("home.destinations")}>
                <ul className="nl-home-destinations">
                    {destinationOrder.map((destination) => {
                        const item = productDestinations.find(
                            (entry) => entry.href === destination
                        )!;
                        const Icon = item.icon;
                        const label = destination.includes("scope=chart")
                            ? t("home.tileCharts")
                            : destination === "/bookmarklet"
                              ? t("home.tileSync")
                              : t(item.labelKey);
                        return (
                            <li key={destination}>
                                <Link
                                    href={getLocalizedHref(destination, locale)}
                                    className="nl-home-tile nl-control"
                                >
                                    <Icon className="nl-icon" aria-hidden />
                                    <span>{label}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>
            <div className="nl-home-updates">
                <HomeAnnouncements announcements={announcements} />
                <OfficialXTimeline />
            </div>
        </PageContainer>
    );
}
