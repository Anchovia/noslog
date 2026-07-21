import RankingBrowser from "@/components/rankings/rankingBrowser";
import { createPageMetadata } from "@/lib/metadata/site";
import { getUser } from "@/lib/user";
import {
    getCachedUserRankingPage,
    getCurrentUserRankingRow,
    normalizeRankingMode,
    normalizeRankingRegion,
} from "@/lib/rankings";
import { redirect } from "next/navigation";

export const metadata = createPageMetadata({
    title: "유저 랭킹",
    description:
        "노스텔지어 Basic·Recital 그레이드 기준 전체, 한국, 일본 유저 랭킹을 확인합니다.",
    path: "/rankings",
});

interface RankingsPageProps {
    searchParams: Promise<{
        mode?: string;
        region?: string;
        page?: string;
    }>;
}

const PAGE_SIZE = 7;
export default async function Rankings({ searchParams }: RankingsPageProps) {
    const params = await searchParams;
    const mode = normalizeRankingMode(params.mode);
    const region = normalizeRankingRegion(params.region);
    const requestedPage = Number.parseInt(params.page || "1", 10);
    const page = Number.isFinite(requestedPage)
        ? Math.max(1, requestedPage)
        : 1;
    const [{ totalCount, rows }, user] = await Promise.all([
        getCachedUserRankingPage(mode, region, page, PAGE_SIZE),
        getUser(),
    ]);

    const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
    if (page > totalPages) {
        redirect(`/rankings?mode=${mode}&region=${region}&page=${totalPages}`);
    }

    const currentUser = await getCurrentUserRankingRow(user, mode, region);

    return (
        <div className="flex flex-col gap-4 px-4 py-5">
            <h1 className="text-title">유저 랭킹</h1>

            <RankingBrowser
                initialMode={mode}
                initialRegion={region}
                initialData={{ page, totalCount, rows, currentUser }}
            />
        </div>
    );
}
