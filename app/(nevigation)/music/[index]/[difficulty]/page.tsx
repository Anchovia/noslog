import MusicDetailBrowser from "@/components/music/musicDetailBrowser";
import { createPageMetadata } from "@/lib/metadata/site";
import getSession from "@/lib/session";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getCachedMusicDetail } from "@/features/music/server/musicDetailData";
import {
    loadMusicDetail,
    normalizeMusicDetailTab,
    normalizeMusicDifficulty,
} from "@/features/music/server/loadMusicDetail";
import { getServerI18n } from "@/lib/i18n/server";
import { getLocalizedHref, localizePath } from "@/lib/i18n/routing";
import { getMusicTitleDisplayPreference } from "@/lib/i18n/musicTitle";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ index: string; difficulty: string }>;
}): Promise<Metadata> {
    const [{ index, difficulty }, { locale, t }] = await Promise.all([
        params,
        getServerI18n(),
    ]);
    const selectedDifficulty = normalizeMusicDifficulty(difficulty);

    if (!selectedDifficulty) {
        return createPageMetadata({
            title: t("music.notFound"),
            path: localizePath("/music", locale),
            noIndex: true,
        });
    }

    const { music, chart } = await getCachedMusicDetail(
        index,
        selectedDifficulty
    );
    if (!music || !chart) {
        return createPageMetadata({
            title: t("music.notFound"),
            path: localizePath("/music", locale),
            noIndex: true,
        });
    }

    const artist = music.artist ? ` · ${music.artist}` : "";
    return createPageMetadata({
        title: `${music.title} ${selectedDifficulty}`,
        description: t("music.detailMetaDescription", {
            title: music.title,
            artist,
            difficulty: selectedDifficulty,
            level: chart.level,
        }),
        path: localizePath(
            `/music/${encodeURIComponent(index)}/${selectedDifficulty.toLowerCase()}`,
            locale
        ),
    });
}

export default async function MusicDetailPage(props: {
    params: Promise<{ index: string; difficulty: string }>;
    searchParams: Promise<{ tab?: string; page?: string }>;
}) {
    const [{ index, difficulty }, searchParams, session, { locale }] =
        await Promise.all([
            props.params,
            props.searchParams,
            getSession(),
            getServerI18n(),
        ]);
    const showLocalizedTitle = await getMusicTitleDisplayPreference(session.id);
    const selectedDifficulty = normalizeMusicDifficulty(difficulty);
    if (!selectedDifficulty) notFound();

    const activeTab = normalizeMusicDetailTab(searchParams.tab);
    const requestedPage = Number.parseInt(searchParams.page ?? "1", 10);
    const rankingPage =
        Number.isFinite(requestedPage) && requestedPage > 0 ? requestedPage : 1;

    if (difficulty !== difficulty.toLowerCase()) {
        const query = new URLSearchParams();
        if (activeTab !== "record") query.set("tab", activeTab);
        if (activeTab === "ranking" && rankingPage > 1) {
            query.set("page", String(rankingPage));
        }
        redirect(
            getLocalizedHref(
                `/music/${index}/${selectedDifficulty.toLowerCase()}${query.size ? `?${query}` : ""}`,
                locale
            )
        );
    }

    const data = await loadMusicDetail(
        index,
        selectedDifficulty,
        activeTab,
        rankingPage,
        session.id,
        locale,
        showLocalizedTitle
    );
    if (!data) notFound();

    return <MusicDetailBrowser initialData={data} />;
}
