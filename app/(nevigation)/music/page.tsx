import MusicResults from "@/components/music/musicResults";
import MusicSearch from "@/components/music/musicSearch";
import { createPageMetadata } from "@/lib/metadata/site";
import { getMusicPage } from "./data";
import type { MusicSearchParams } from "./query";
import getSession from "@/lib/session";

export const metadata = createPageMetadata({
    title: "악곡 검색",
    description:
        "노스텔지어 악곡을 제목과 아티스트로 검색하고 난이도, 레벨, 카테고리와 플레이 기록으로 필터링합니다.",
    path: "/music",
});

export default async function Music(props: {
    searchParams: Promise<MusicSearchParams>;
}) {
    const searchParams = await props.searchParams;
    const session = await getSession();
    const initialPage = await getMusicPage(
        searchParams,
        null,
        session.id ?? null
    );
    const searchKey = JSON.stringify(searchParams);

    return (
        <div className="mx-auto flex h-full min-h-screen max-w-(--breakpoint-sm) flex-col gap-4 px-4 py-4">
            <header className="flex items-center justify-between">
                <h1 className="text-title">악곡 검색</h1>
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
