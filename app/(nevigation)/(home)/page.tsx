import FeedbackDialog from "@/components/feedback/feedbackDialog";
import HomeAnnouncements from "@/components/home/homeAnnouncements";
import OfficialXTimeline from "@/components/home/officialXTimeline";
import { getPublishedAnnouncements } from "@/lib/announcements";
import { createPageMetadata, SITE_NAME, SITE_URL } from "@/lib/metadata/site";
import { getServerI18n } from "@/lib/i18n/server";
import { getLocalizedHref, localizePath } from "@/lib/i18n/routing";
import { getUser } from "@/lib/user";
import {
    BadgeCheck,
    ChevronRight,
    DatabaseZap,
    Grid3X3,
    ListOrdered,
    MapPin,
    Music2,
    Search,
    Trophy,
} from "lucide-react";
import Link from "next/link";

export async function generateMetadata() {
    const { locale } = await getServerI18n();
    return createPageMetadata({ path: localizePath("/", locale) });
}

export default async function Home() {
    const [user, announcements, { locale, t }] = await Promise.all([
        getUser(),
        getPublishedAnnouncements(),
        getServerI18n(),
    ]);
    const homePath = getLocalizedHref("/", locale);
    const musicPath = getLocalizedHref("/music", locale);
    const websiteJsonLd = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: SITE_NAME,
        url: `${SITE_URL}${homePath}`,
        description: t("home.tagline"),
        inLanguage:
            locale === "ko" ? "ko-KR" : locale === "ja" ? "ja-JP" : "en",
        potentialAction: {
            "@type": "SearchAction",
            target: `${SITE_URL}${musicPath}?q={search_term_string}`,
            "query-input": "required name=search_term_string",
        },
    };

    return (
        <div className="flex flex-col gap-4 px-4 py-4">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(websiteJsonLd).replaceAll(
                        "<",
                        "\\u003c"
                    ),
                }}
            />
            <HomeAnnouncements announcements={announcements} />
            {/* 히어로 + 검색 */}
            <section className="flex flex-col items-center gap-8 pt-4 text-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="border-text-primary text-text-primary flex size-11 items-center justify-center rounded-full border-2 text-lg font-bold">
                        N
                    </div>
                    <div>
                        <h1 className="text-title">NosLog</h1>
                        <p className="text-caption mt-2">{t("home.tagline")}</p>
                    </div>
                </div>

                <form action={musicPath} className="w-full">
                    <div className="border-border bg-surface focus-within:border-focus focus-within:ring-focus/20 flex h-11 w-full items-center gap-2 rounded-full border px-4 transition focus-within:ring-2">
                        <Search
                            className="text-text-disabled size-5 shrink-0"
                            aria-hidden="true"
                        />
                        <input
                            name="q"
                            placeholder={t("home.searchPlaceholder")}
                            className="text-input placeholder:text-text-disabled h-full min-w-0 flex-1 bg-transparent outline-none"
                        />
                    </div>
                </form>
            </section>
            {/* 퀵 메뉴 */}
            <section className="grid grid-cols-3 gap-2">
                <Link
                    href={musicPath}
                    className="bg-surface hover:bg-surface-muted focus-visible:ring-focus/40 rounded-card group flex h-20 flex-col items-center justify-center gap-2 transition-colors focus-visible:ring-2 focus-visible:outline-none"
                >
                    <Music2
                        className="text-text-secondary group-hover:text-text-primary size-6 transition-colors"
                        aria-hidden="true"
                    />
                    <span className="text-label">{t("home.music")}</span>
                </Link>
                <Link
                    href={getLocalizedHref("/rankings", locale)}
                    className="bg-surface hover:bg-surface-muted focus-visible:ring-focus/40 rounded-card group flex h-20 flex-col items-center justify-center gap-2 transition-colors focus-visible:ring-2 focus-visible:outline-none"
                >
                    <Trophy
                        className="text-text-secondary group-hover:text-text-primary size-6 transition-colors"
                        aria-hidden="true"
                    />
                    <span className="text-label">{t("home.rankings")}</span>
                </Link>
                <Link
                    href={getLocalizedHref("/bingo", locale)}
                    className="bg-surface hover:bg-surface-muted focus-visible:ring-focus/40 rounded-card group flex h-20 flex-col items-center justify-center gap-2 transition-colors focus-visible:ring-2 focus-visible:outline-none"
                >
                    <Grid3X3
                        className="text-text-secondary group-hover:text-text-primary size-6 transition-colors"
                        aria-hidden="true"
                    />
                    <span className="text-label">{t("home.bingo")}</span>
                </Link>
                <Link
                    href={getLocalizedHref("/tiers", locale)}
                    className="bg-surface hover:bg-surface-muted focus-visible:ring-focus/40 rounded-card group flex h-20 flex-col items-center justify-center gap-2 transition-colors focus-visible:ring-2 focus-visible:outline-none"
                >
                    <ListOrdered
                        className="text-text-secondary group-hover:text-text-primary size-6 transition-colors"
                        aria-hidden="true"
                    />
                    <span className="text-label">{t("home.tiers")}</span>
                </Link>
                <Link
                    href={getLocalizedHref("/exams", locale)}
                    className="bg-surface hover:bg-surface-muted focus-visible:ring-focus/40 rounded-card group flex h-20 flex-col items-center justify-center gap-2 transition-colors focus-visible:ring-2 focus-visible:outline-none"
                >
                    <BadgeCheck
                        className="text-text-secondary group-hover:text-text-primary size-6 transition-colors"
                        aria-hidden="true"
                    />
                    <span className="text-label">{t("home.exams")}</span>
                </Link>
                <Link
                    href={getLocalizedHref("/gamecenter", locale)}
                    className="bg-surface hover:bg-surface-muted focus-visible:ring-focus/40 rounded-card group flex h-20 flex-col items-center justify-center gap-2 transition-colors focus-visible:ring-2 focus-visible:outline-none"
                >
                    <MapPin
                        className="text-text-secondary group-hover:text-text-primary size-6 transition-colors"
                        aria-hidden="true"
                    />
                    <span className="text-label">{t("home.arcades")}</span>
                </Link>
            </section>
            {/* 데이터 연동 가이드 */}
            <Link
                href={getLocalizedHref("/bookmarklet", locale)}
                className="bg-surface hover:bg-surface-muted focus-visible:ring-focus/40 rounded-card group flex h-10 items-center justify-between px-4 transition-colors focus-visible:ring-2 focus-visible:outline-none"
            >
                <div className="flex items-center gap-2">
                    <DatabaseZap
                        className="text-text-secondary group-hover:text-text-primary size-4 transition-colors"
                        aria-hidden="true"
                    />
                    <span className="text-body-muted">
                        {t("home.dataSyncGuide")}
                    </span>
                </div>
                <ChevronRight
                    className="text-text-disabled group-hover:text-text-primary size-4 transition-colors"
                    aria-hidden="true"
                />
            </Link>
            <FeedbackDialog isAuthenticated={Boolean(user)} />
            {/* NOSTALGIA 공식 소식 */}
            <OfficialXTimeline />
        </div>
    );
}
