import MusicResults from "@/components/music/musicResults";
import MusicSearch from "@/components/music/musicSearch";
import { getMusicPage } from "./data";
import type { MusicSearchParams } from "./query";

export default async function Music(props: {
    searchParams: Promise<MusicSearchParams>;
}) {
    const searchParams = await props.searchParams;
    const initialMusics = await getMusicPage(searchParams, 0);
    const searchKey = JSON.stringify(searchParams);

    return (
        <main className="mx-auto flex h-full min-h-screen max-w-(--breakpoint-sm) flex-col gap-4 px-4 py-4">
            <header className="flex items-center justify-between">
                <h1 className="text-title">악곡</h1>
            </header>
            <MusicSearch searchParams={searchParams} />
            <MusicResults
                key={`results-${searchKey}`}
                initialMusics={initialMusics}
                searchParams={searchParams}
            />
        </main>
    );
}
