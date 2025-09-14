import { musicBG } from "../../constants";
import db from "../../db";

export async function updateMusic(music: any) {
    const startTime = Date.now(); // 시작 시간

    // 기존 악곡 데이터 조회
    const existingMusic = await db.music.findMany({
        where: {
            index: {
                in: music.map((data: any) => data["@index"]),
            },
        },
        select: { index: true, background: true },
    });
    // 기존 악곡 데이터 인덱스와 기존 악곡 중 배경 없는 악곡 인덱스 set 생성(O(1) 검사 위해 Set 사용)
    const existingIndexes = new Set(existingMusic.map((music) => music.index)); // 기존 악곡 인덱스 set
    const musicWithoutBG = new Set(
        existingMusic
            .filter((music) => !music.background)
            .map((music) => music.index)
    ); // 기존 악곡 중 배경 없는 악곡 인덱스 set

    const newMusicData: any[] = []; // 새로 생성할 음악 데이터 list
    const bgUpdatePromises: Promise<any>[] = []; // 배경 업데이트 프로미스 list
    console.info(`(1)기존 악곡 데이터 조회 성공(${existingMusic.length}개)`);

    for (const data of music) {
        const index = data["@index"];

        // set과 has를 사용하여 O(1) 검사
        // music이 없는 경우 신규 music list에 push
        if (!existingIndexes.has(index)) {
            console.warn(`(2)새 악곡 데이터 감지: ${data.title}`);

            // 난이도 레벨 배열 생성
            const difficulty_levels = data.sheet.map(
                (sheet: any) => sheet.level
            );

            // 신규 music data 배열에 추가
            newMusicData.push({
                index: index,
                artist: data.artist,
                category: data.category,
                category_short: data.category_short,
                description: data.description,
                title: data.title,
                title_kana: data.title_kana,
                sheet_len: data.sheet.length,
                difficulty_levels: difficulty_levels.toString(),
                background: musicBG[index] || null,
                difficulty_name:
                    data.sheet.length === 3
                        ? "Normal, Hard, Expert"
                        : "Normal, Hard, Expert, Real",
            });
        } else if (musicWithoutBG.has(index) && musicBG[index]) {
            // 업데이트가 필요한 기존 악곡의 신규 BG 데이터 처리
            console.warn(`(3)기존 악곡 신규 BG 데이터 감지: ${data.title}`);

            // BG promise 리스트에 update Promise 추가
            bgUpdatePromises.push(
                db.music.update({
                    where: { index: index },
                    data: { background: musicBG[index] },
                })
            );
        }
    }
    console.info("(4)악곡 데이터 처리 완료");

    // music 데이터 생성 및 BG 업데이트 병렬 실행
    await Promise.allSettled([
        // 새 음악 생성(createMany)
        newMusicData.length > 0
            ? db.music.createMany({ data: newMusicData })
            : Promise.resolve(),

        ...bgUpdatePromises, // BG 업데이트 (병렬)
    ]);

    // 결과 출력
    if (newMusicData.length > 0) {
        console.info(`(5)새 악곡 데이터 생성 완료 (${newMusicData.length}개)`);
    }
    if (bgUpdatePromises.length > 0) {
        console.info(
            `(6)기존 악곡 BG 업데이트 완료 (${bgUpdatePromises.length}개)`
        );
    }
    const duration = Date.now() - startTime; // 종료 시간

    console.info(
        `===[신규 악곡 데이터 생성 및 BG 업데이트 성공(${duration}ms)]===`
    );
}
