import MusicDetail, {
    type DetailTab,
    type RankingMode,
} from "@/components/music/musicDetail";
import db from "@/lib/db";
import { notFound } from "next/navigation";
import { getRecentChartPlays, getUserPlayData } from "./action";

const difficulties = ["Normal", "Hard", "Expert", "Real"] as const;
const tabs: DetailTab[] = ["record", "detail", "ranking", "tier"];

export default async function MusicDetailPage(props: {
    params: Promise<{ index: string; difficulty: string }>;
    searchParams: Promise<{ tab?: string; mode?: string }>;
}) {
    const [{ index, difficulty }, searchParams] = await Promise.all([
        props.params,
        props.searchParams,
    ]);

    if (!difficulties.includes(difficulty as (typeof difficulties)[number])) {
        notFound();
    }

    const selectedDifficulty = difficulty as (typeof difficulties)[number];
    const activeTab: DetailTab = tabs.includes(searchParams.tab as DetailTab)
        ? (searchParams.tab as DetailTab)
        : "record";
    const rankingMode: RankingMode =
        searchParams.mode === "recital" ? "recital" : "basic";

    const [
        music,
        userPlayData,
        recentChartPlays,
        basicRankings,
        recitalRankings,
    ] = await Promise.all([
        db.music.findUnique({
            where: { index },
            select: {
                index: true,
                background: true,
                title: true,
                artist: true,
                category_short: true,
                normal: true,
                hard: true,
                expert: true,
                real: true,
            },
        }),
        getUserPlayData({ index, difficulty: selectedDifficulty }),
        getRecentChartPlays({
            index,
            difficulty: selectedDifficulty,
        }),
        db.playData.findMany({
            where: { music_idx: index, difficulty: selectedDifficulty },
            select: {
                rank: true,
                score: true,
                max_combo: true,
                grade_basic: true,
                besttime: true,
                user_id: true,
                user: { select: { username: true, id: true } },
            },
            distinct: ["user_id"],
            take: 50,
            orderBy: { grade_basic: "desc" },
        }),
        db.playData.findMany({
            where: { music_idx: index, difficulty: selectedDifficulty },
            select: {
                rank: true,
                score: true,
                max_combo: true,
                grade_recital: true,
                besttime: true,
                user_id: true,
                user: { select: { username: true, id: true } },
            },
            distinct: ["user_id"],
            take: 50,
            orderBy: { grade_recital: "desc" },
        }),
    ]);

    if (!music) {
        notFound();
    }

    return (
        <MusicDetail
            music={music}
            difficulty={selectedDifficulty}
            activeTab={activeTab}
            rankingMode={rankingMode}
            userPlayData={userPlayData}
            recentChartPlays={recentChartPlays}
            basicRankings={basicRankings}
            recitalRankings={recitalRankings}
        />
    );
}
