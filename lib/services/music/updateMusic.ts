import { musicBG } from "../../constants";
import db from "../../db";

export async function updateMusic(music: any) {
    console.info("악곡 데이터 생성 시작...");
    // totalData 중 music 생성 로직
    await music.map(async (data: any) => {
        // 빈 데이터 null로 변경
        if (data.artist === "") {
            data.artist = null;
        }
        if (data.description === "") {
            data.description = null;
        }

        // idx와 BG가 있는지 검증
        const music = await db.music.findUnique({
            where: { index: data["@index"] },
            select: { index: true, background: true },
        });
        if (!music) {
            console.warn(`새 악곡 데이터 감지: ${data.title}`);
            console.info("새 악곡 데이터 생성 중...");
            // idx가 없을 경우 music create
            const resultMusic = await db.music.create({
                data: {
                    index: data["@index"],
                    artist: data.artist,
                    category: data.category,
                    category_short: data.category_short,
                    description: data.description,
                    title: data.title,
                    title_kana: data.title_kana,
                    sheet_len: data.sheet.length,
                },
            });

            console.info("새 악곡 BG 데이터 확인 중...");
            if (musicBG[resultMusic.index]) {
                console.warn(`새 악곡 신규 BG 데이터 감지`);
                // music bg 추가 작업
                await db.music.update({
                    where: { index: resultMusic.index + "" },
                    data: {
                        background: musicBG[resultMusic.index + ""],
                    },
                });
                console.info("새 악곡 BG 데이터 추가 완료");
            }
            console.info("새 악곡 데이터 생성 완료");
        } else {
            if (!music.background && musicBG[music.index]) {
                console.warn(`기존 악곡 신규 BG 데이터 감지: ${data.title}`);
                // music bg 추가 작업
                await db.music.update({
                    where: { index: music.index },
                    data: {
                        background: musicBG[music.index],
                    },
                });
                console.info("기존 악곡 BG 데이터 추가 완료");
            }
        }
    });
    console.info("악곡 데이터 처리 완료");
}
