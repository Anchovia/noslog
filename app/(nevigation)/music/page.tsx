import MusicList from "@/components/musicList";
import db from "@/lib/db";

// todo: 무한 스크롤 기능 제작 필요
// todo2: 필터 기능 제작 필요(카테고리, 난이도, 랭크, 악곡 길이 등등)
// todo3: 악곡 검색 기능 제작 필요(제목, 아티스트 등등)

async function getInitialMusics() {
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
    return initialMusics;
}

export default async function Music() {
    const initialMusics = await getInitialMusics();

    return <MusicList initialMusics={initialMusics} />;
}
