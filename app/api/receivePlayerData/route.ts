import db from "@/lib/db";
import { updateDummy } from "@/lib/dummy/bingo";
import { updateMusic } from "@/lib/services/music/updateMusic";
import { updateGrade } from "@/lib/services/user/updateGrade";
import { updatePlayCount } from "@/lib/services/user/updatePlayCount";
import { updatePlayData } from "@/lib/services/user/updatePlayData";
import { updateRank } from "@/lib/services/user/updateRank";
import { updateRecentPlay } from "@/lib/services/user/updateRecentPlay";
import { NextRequest, NextResponse } from "next/server";

// POST 요청 처리
export async function POST(request: NextRequest) {
    // CORS 헤더 설정
    const headers = new Headers();
    headers.set("Access-Control-Allow-Origin", "https://p.eagate.573.jp");
    headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    headers.set("Access-Control-Allow-Headers", "Content-Type");

    // 요청 받은 Body 데이터 파싱
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
    if (
        playerData.status === 0 &&
        recentData.status === 0 &&
        totalData.status === 0
    ) {
        console.info("===[BEMANI 데이터 수신 완료]===");
    } else {
        return new NextResponse(
            JSON.stringify({ message: "[BEMANI 데이터 수신 실패]" }),
            {
                status: 400,
                headers,
            }
        );
    }

    // db 업데이트
    await updateMusic(music); // music 데이터 업데이트
    const user = await updatePlayCount(name, play_count); // 유저 플레이 카운트 업데이트[user 객체(id 포함) 반환]
    const sync = await db.dataSync.create({
        data: {
            user_id: user.id,
            received_plays: history.length,
        },
    });

    try {
        const insertedPlays = await updateRecentPlay(user.id, history, sync.id);
        const changedRecords = await updatePlayData(user.id, music, sync.id);
        await updateGrade(user.id); // 유저 그레이드 및 베스트 플레이 데이터 업데이트
        await updateRank(); // 랭킹 업데이트
        await updateDummy(); // 더미데이터 업데이트

        await db.dataSync.update({
            where: { id: sync.id },
            data: {
                status: "completed",
                inserted_plays: insertedPlays,
                changed_records: changedRecords,
                completed_at: new Date(),
            },
        });
    } catch (error) {
        await db.dataSync.update({
            where: { id: sync.id },
            data: {
                status: "failed",
                error_message:
                    error instanceof Error ? error.message : "Unknown error",
                completed_at: new Date(),
            },
        });
        throw error;
    }

    // 성공
    return new NextResponse(
        JSON.stringify({ message: "BEMANI 데이터 처리 성공" }),
        {
            status: 200,
            headers,
        }
    );
}

// Preflight 요청 처리
export async function OPTIONS() {
    // CORS Preflight 요청 처리
    const headers = new Headers();
    headers.set("Access-Control-Allow-Origin", "https://p.eagate.573.jp");
    headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    headers.set("Access-Control-Allow-Headers", "Content-Type");

    return new NextResponse(null, { status: 200, headers });
}
