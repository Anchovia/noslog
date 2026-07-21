import MusicDetailBrowser from "@/components/music/musicDetailBrowser";
import { createPageMetadata } from "@/lib/metadata/site";
import getSession from "@/lib/session";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getCachedMusicDetail } from "./data";
import {
    loadMusicDetail,
    normalizeMusicDetailTab,
    normalizeMusicDifficulty,
} from "./loadMusicDetail";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ index: string; difficulty: string }>;
}): Promise<Metadata> {
    const { index, difficulty } = await params;
    const selectedDifficulty = normalizeMusicDifficulty(difficulty);

    if (!selectedDifficulty) {
        return createPageMetadata({
            title: "악곡을 찾을 수 없습니다",
            path: "/music",
            noIndex: true,
        });
    }

    const { music, chart } = await getCachedMusicDetail(
        index,
        selectedDifficulty
    );
    if (!music || !chart) {
        return createPageMetadata({
            title: "악곡을 찾을 수 없습니다",
            path: "/music",
            noIndex: true,
        });
    }

    const artist = music.artist ? ` · ${music.artist}` : "";
    return createPageMetadata({
        title: `${music.title} ${selectedDifficulty}`,
        description: `${music.title}${artist}의 노스텔지어 ${selectedDifficulty} Lv ${chart.level} 채보 정보, 랭킹, 서열과 커뮤니티 평가를 확인합니다.`,
        path: `/music/${encodeURIComponent(index)}/${selectedDifficulty.toLowerCase()}`,
    });
}

export default async function MusicDetailPage(props: {
    params: Promise<{ index: string; difficulty: string }>;
    searchParams: Promise<{ tab?: string; page?: string }>;
}) {
    const [{ index, difficulty }, searchParams, session] = await Promise.all([
        props.params,
        props.searchParams,
        getSession(),
    ]);
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
            `/music/${index}/${selectedDifficulty.toLowerCase()}${query.size ? `?${query}` : ""}`
        );
    }

    const data = await loadMusicDetail(
        index,
        selectedDifficulty,
        activeTab,
        rankingPage,
        session.id
    );
    if (!data) notFound();

    return <MusicDetailBrowser initialData={data} />;
}
