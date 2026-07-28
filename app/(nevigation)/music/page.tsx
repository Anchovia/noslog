import MusicResults from "@/components/music/musicResults";
import MusicSearch from "@/components/music/musicSearch";
import { createPageMetadata } from "@/lib/metadata/site";
import { getMusicPage } from "./data";
import type { MusicSearchParams } from "./query";
import getSession from "@/lib/session";
import { getServerI18n } from "@/lib/i18n/server";
import { getMusicTitleDisplayPreference } from "@/lib/i18n/musicTitle";
import { localizePath } from "@/lib/i18n/routing";

export async function generateMetadata() {
    const { locale, t } = await getServerI18n();
    return createPageMetadata({
        title: t("music.title"),
        description: t("music.metaDescription"),
        path: localizePath("/music", locale),
    });
}

export default async function Music(props: {
    searchParams: Promise<MusicSearchParams>;
}) {
    const [searchParams, session, { locale, t }] = await Promise.all([
        props.searchParams,
        getSession(),
        getServerI18n(),
    ]);
    const showLocalizedTitle = await getMusicTitleDisplayPreference(session.id);
    const initialPage = await getMusicPage(
        searchParams,
        null,
        session.id ?? null,
        locale,
        showLocalizedTitle
    );
    const searchKey = JSON.stringify(searchParams);

    return (
        <div className="mx-auto flex h-full min-h-screen max-w-(--breakpoint-sm) flex-col gap-4 px-4 py-4">
            <header className="flex items-center justify-between">
                <h1 className="text-title">{t("music.title")}</h1>
            </header>
            <MusicSearch
                searchParams={searchParams}
                isLoggedIn={Boolean(session.id)}
            />
            <MusicResults
                key={`results-${searchKey}`}
                initialPage={initialPage}
                searchParams={searchParams}
                isLoggedIn={Boolean(session.id)}
            />
        </div>
    );
}
