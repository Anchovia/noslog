import MusicResults from "@/components/music/musicResults";
import MusicSearch from "@/components/music/musicSearch";
import { getMusicPage } from "./data";
import type { MusicSearchParams } from "./query";
import getSession from "@/lib/session";

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
            />
        </div>
    );
}
