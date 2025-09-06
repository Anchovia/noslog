import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

interface PlayData {
    title: string;
    artist: string;
    difficulty: string;
    level: number;
    score: number;
    max_combo: number;
    rank: string;
    play_time: string;
}

// POST 요청 처리
export async function POST(request: NextRequest) {
    // CORS 헤더
    const headers = new Headers();
    headers.set("Access-Control-Allow-Origin", "https://p.eagate.573.jp");
    headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    headers.set("Access-Control-Allow-Headers", "Content-Type");

    // 요청 body 읽기
    const { playerData, recentData } = await request.json();
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

    // db에 유저 없는 경우 유저 생성
    const user = await db.user.findUnique({
        where: { name },
        select: { id: true },
    });
    if (!user) {
        // 유저가 없는 경우 유저 및 플레이 횟수 생성
        const user = await db.user.create({
            data: {
                name,
                play_count,
            },
        });

        // 최근 플레이 히스토리 생성
        history.map(async (data: PlayData) => {
            await db.playHistory.create({
                data: {
                    user_id: user.id,
                    title: data.title,
                    artist: data.artist,
                    difficulty: data.difficulty,
                    level: data.level,
                    score: data.score,
                    max_combo: data.max_combo,
                    rank: data.rank,
                    play_time: data.play_time,
                },
            });
        });
    } else {
        // 유저가 있는 경우 플레이 횟수 업데이트
        await db.user.update({
            where: { id: user.id },
            data: {
                name,
                play_count,
            },
        });

        // 최근 플레이 히스토리 업데이트
        const result = await db.playHistory.deleteMany({
            where: {
                user_id: user.id,
            },
        });
        if (result) {
            history.map(async (data: PlayData) => {
                db.playHistory.deleteMany({
                    where: {
                        user_id: user.id,
                    },
                });
                await db.playHistory.create({
                    data: {
                        user_id: user.id,
                        title: data.title,
                        artist: data.artist,
                        difficulty: data.difficulty,
                        level: data.level,
                        score: data.score,
                        max_combo: data.max_combo,
                        rank: data.rank,
                        play_time: data.play_time,
                    },
                });
            });
        }
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
