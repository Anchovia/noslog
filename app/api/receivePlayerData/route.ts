import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

// POST 요청 처리
export async function POST(request: NextRequest) {
    // CORS 헤더
    const headers = new Headers();
    headers.set("Access-Control-Allow-Origin", "https://p.eagate.573.jp");
    headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    headers.set("Access-Control-Allow-Headers", "Content-Type");

    // 요청 body 읽기
    const { playerData, recentData, totalData } = await request.json();
    const {
        data: {
            player: { name, play_count },
        },
    } = playerData;
    const {
        data: {
            player: {
                history_list: { history },
            },
        },
    } = recentData;
    const {
        data: { music },
    } = totalData;

    // totalData 중 music 생성 로직
    await music.map(async (data: any) => {
        // 빈 데이터 null로 변경
        if (data.artist === "") {
            data.artist = null;
        }
        if (data.description === "") {
            data.description = null;
        }

        // idx가 있는지 검증
        const idx = await db.music.findUnique({
            where: { index: data["@index"] },
            select: { index: true },
        });
        if (!idx) {
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
                },
            });
        }
    });

    // 유저 데이터에 플레이 횟수 업데이트
    const user = await db.user.update({
        where: {
            username: name,
        },
        data: {
            play_count: play_count,
        },
        select: {
            id: true,
        },
    });

    // 최근 플레이 히스토리 업데이트
    const recentPlayDeleteResult = await db.recentPlay.deleteMany({
        where: {
            user_id: user.id,
        },
    });
    if (recentPlayDeleteResult) {
        history.map(async (data: any) => {
            await db.recentPlay.create({
                data: {
                    difficulty: data.difficulty,
                    level: data.level,
                    score: data.score,
                    max_combo: data.max_combo,
                    rank: data.rank,
                    play_time: data.play_time,
                    user_id: user.id,
                    music_idx: data.music,
                },
            });
        });
    }

    // PlayData 생성 로직 전 전체 playData 삭제
    // 전체 playData 삭제
    const playdataDeleteResult = await db.playData.deleteMany({
        where: {
            user_id: user.id,
        },
    });
    // 삭제 성공시 플레이 데이터 생성 시작
    if (playdataDeleteResult) {
        await music.map(async (data: any) => {
            await data.sheet.map(async (sheet: any) => {
                await db.playData.create({
                    data: {
                        user_id: user.id,
                        music_idx: data["@index"],
                        level: sheet.level,
                        difficulty: sheet.difficulty,
                        score: sheet.score,
                        rank: sheet.rank,
                        fc_type: sheet.fc_type,
                        play_count: sheet.play_count,
                        fullcombo_count: sheet.fullcombo_count,
                        pianistic_count: sheet.pianistic_count,
                        max_combo: sheet.max_combo,
                        grade_basic: sheet.grade_basic,
                        grade_recital: sheet.grade_recital,
                        besttime: sheet.besttime,
                    },
                });
            });
        });
    }

    // 성공
    return new NextResponse(JSON.stringify({ message: "데이터 수신 완료" }), {
        status: 200,
        headers,
    });
}

// Preflight 요청 처리
export async function OPTIONS() {
    const headers = new Headers();
    headers.set("Access-Control-Allow-Origin", "https://p.eagate.573.jp");
    headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    headers.set("Access-Control-Allow-Headers", "Content-Type");

    return new NextResponse(null, { status: 200, headers });
}
