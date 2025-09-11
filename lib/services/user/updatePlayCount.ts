import db from "@/lib/db";

export async function updatePlayCount(name: string, play_count: number) {
    const startTime = Date.now(); // 시작 시간

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

    const duration = Date.now() - startTime; // 종료 시간
    console.info(`--[유저 플레이 카운트 업데이트 완료(${duration}ms)]--`);

    return user;
}
