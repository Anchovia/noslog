import db from "@/lib/db";
import { formatToGrade } from "@/lib/utils";

function getKoreanDate() {
    return new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Seoul",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).format(new Date());
}

export async function updateGrade(user_id: number) {
    const startTime = Date.now(); // 시작 시간

    const basicBestData = await db.playData.findMany({
        where: {
            user_id,
        },
        select: {
            grade_basic: true,
            besttime: true,
            difficulty: true,
            score: true,
            max_combo: true,
            level: true,
            rank: true,
            music_idx: true,
            chart_id: true,
            user_id: true,
            fc_type: true,
        },
        orderBy: [{ grade_basic: "desc" }],
        take: 50,
    });
    console.info("(1)베이직 그레이드 상위 50개 곡 불러오기 완료");

    // 베이직 그레이드 합산
    const basicGrade = basicBestData.reduce(
        (acc, cur) => acc + cur.grade_basic,
        0
    );
    console.info("(2)베이직 그레이드 합산 완료");

    // 리사이틀 그레이드 상위 50개 곡의 그레이드 합산
    const recitalBestData = await db.playData.findMany({
        where: {
            user_id,
        },
        select: {
            grade_recital: true,
            besttime: true,
            difficulty: true,
            score: true,
            max_combo: true,
            level: true,
            rank: true,
            music_idx: true,
            chart_id: true,
            user_id: true,
            fc_type: true,
        },
        orderBy: [{ grade_recital: "desc" }],
        take: 50,
    });
    console.info("(3)리사이틀 그레이드 상위 50개 곡 불러오기 완료");

    // 리사이틀 그레이드 합산
    const recitalGrade = recitalBestData.reduce(
        (acc, cur) => acc + cur.grade_recital,
        0
    );
    console.info("(4)리사이틀 그레이드 합산 완료");

    // 트랜잭션으로 모든 DB 작업을 원자적으로 처리
    await db.$transaction(async (tx) => {
        const today = getKoreanDate();

        // 그레이드 업데이트
        await tx.user.update({
            where: { id: user_id },
            data: {
                grade_basic: basicGrade,
                grade_recital: recitalGrade,
            },
        });
        console.info("(5)유저 그레이드 업데이트 완료");

        // 유저 베스트 그레이드 생성 및 같은 날짜 데이터인 경우 높은값으로 처리
        const gradeHistory = await tx.userBestGrade.findMany({
            where: { user_id },
            select: { id: true, besttime: true },
            orderBy: [{ besttime: "asc" }, { id: "asc" }],
        });
        const todayHistory = gradeHistory.filter(
            (history) => history.besttime.split(" ")[0] === today
        );
        const latestTodayHistory = todayHistory.at(-1);

        if (latestTodayHistory) {
            await tx.userBestGrade.update({
                where: { id: latestTodayHistory.id },
                data: {
                    besttime: today,
                    grade_basic: Number(formatToGrade(basicGrade)),
                    grade_recital: Number(formatToGrade(recitalGrade)),
                },
            });

            const duplicateIds = todayHistory
                .filter((history) => history.id !== latestTodayHistory.id)
                .map((history) => history.id);
            if (duplicateIds.length > 0) {
                await tx.userBestGrade.deleteMany({
                    where: { id: { in: duplicateIds } },
                });
            }
        } else {
            await tx.userBestGrade.create({
                data: {
                    user_id,
                    besttime: today,
                    grade_basic: Number(formatToGrade(basicGrade)),
                    grade_recital: Number(formatToGrade(recitalGrade)),
                },
            });
        }

        const historyAfterUpdate = await tx.userBestGrade.findMany({
            where: { user_id },
            select: { id: true },
            orderBy: [{ besttime: "asc" }, { id: "asc" }],
        });
        const expiredHistory = historyAfterUpdate.slice(
            0,
            Math.max(0, historyAfterUpdate.length - 30)
        );
        if (expiredHistory.length > 0) {
            await tx.userBestGrade.deleteMany({
                where: { id: { in: expiredHistory.map(({ id }) => id) } },
            });
        }

        // 기존 베스트 플레이 데이터 삭제 (중복 방지)
        await tx.basicBestPlay.deleteMany({
            where: { user_id: user_id },
        });
        await tx.recitalBestPlay.deleteMany({
            where: { user_id: user_id },
        });
        console.info("(6)기존 베스트 플레이 데이터 삭제 완료");

        // 새로운 베스트 플레이 데이터 생성
        await tx.basicBestPlay.createMany({
            data: basicBestData,
        });
        await tx.recitalBestPlay.createMany({
            data: recitalBestData,
        });
        console.info("(7)새로운 베스트 플레이 데이터 생성 완료");
    });

    const duration = Date.now() - startTime;
    console.info(
        `===[유저 그레이드 및 베스트 플레이 데이터 업데이트 완료(${duration}ms)]===`
    );
}
