import MusicList from "@/components/music/musicList";
import MusicSearch from "@/components/music/musicSearch";
import MusicToolbar from "@/components/music/musicToolbar";
import db from "@/lib/db";
import { buildMusicWhere, type MusicSearchParams } from "./query";

async function getInitialMusics(searchParams: MusicSearchParams) {
    return db.music.findMany({
        where: buildMusicWhere(searchParams),
        select: {
            index: true,
            title: true,
            artist: true,
            category_short: true,
            background: true,
            sheet_len: true,
            difficulty_levels: true,
            normal: true,
            hard: true,
            expert: true,
            real: true,
        },
        take: 20,
    });
}

export default async function Music(props: {
    searchParams: Promise<MusicSearchParams>;
}) {
    const searchParams = await props.searchParams;
    const initialMusics = await getInitialMusics(searchParams);
    const searchKey = JSON.stringify(searchParams);

    return (
        <main className="mx-auto flex h-full min-h-screen max-w-(--breakpoint-sm) flex-col gap-4 px-4 py-4">
            <header className="flex items-center justify-between">
                <h1 className="text-title">악곡</h1>
            </header>
            <MusicSearch
                key={`search-${searchKey}`}
                searchParams={searchParams}
            />
            <MusicToolbar />
            <MusicList
                key={`list-${searchKey}`}
                initialMusics={initialMusics}
                searchParams={searchParams}
            />
        </main>
    );
}
