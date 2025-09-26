import MusicList from "@/components/music/musicList";
import MusicSearch from "@/components/music/musicSearch";
import db from "@/lib/db";
import { revalidatePath } from "next/cache";

// todo: 무한 스크롤 기능 제작 필요
// todo2: 필터 기능 제작 필요(카테고리, 난이도, 랭크, 악곡 길이 등등)
// todo3: 악곡 검색 기능 제작 필요(제목, 아티스트 등등)

async function getInitialMusics(qurry: string | undefined) {
    if (qurry) {
        const initialMusics = await db.music.findMany({
            where: {
                OR: [
                    { title: { contains: qurry } },
                    { artist: { contains: qurry } },
                ],
            },
            select: {
                index: true,
                title: true,
                artist: true,
                category_short: true,
                background: true,
                sheet_len: true,
                difficulty_levels: true,
            },
            take: 20,
        });
        revalidatePath("/music");
        return initialMusics;
    } else {
        const initialMusics = await db.music.findMany({
            select: {
                index: true,
                title: true,
                artist: true,
                category_short: true,
                background: true,
                sheet_len: true,
                difficulty_levels: true,
            },
            take: 20,
        });
        revalidatePath("/music");
        return initialMusics;
    }
}

export default async function Music({
    searchParams,
}: {
    searchParams: { qurry?: string };
}) {
    const initialMusics = await getInitialMusics(searchParams.qurry);

    return (
        <main className="max-w-screen-sm mx-auto h-full flex flex-col gap-4 min-h-screen">
            <MusicSearch />
            <MusicList
                initialMusics={initialMusics}
                qurry={searchParams.qurry}
            />
        </main>
    );
}
