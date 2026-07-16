import db from "@/lib/db";

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

    const [basicBestData, recitalBestData] = await Promise.all([
        db.playData.findMany({
            where: { user_id },
            select: { grade_basic: true },
            orderBy: [{ grade_basic: "desc" }],
            take: 50,
        }),
        db.playData.findMany({
            where: { user_id },
            select: { grade_recital: true },
            orderBy: [{ grade_recital: "desc" }],
            take: 50,
        }),
    ]);
    console.info("(1)베이직 그레이드 상위 50개 곡 불러오기 완료");

    // 베이직 그레이드 합산
    const basicGrade = basicBestData.reduce(
        (acc, cur) => acc + cur.grade_basic,
        0
    );
    console.info("(2)베이직 그레이드 합산 완료");

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
                    grade_basic: basicGrade,
                    grade_recital: recitalGrade,
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
                    grade_basic: basicGrade,
                    grade_recital: recitalGrade,
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
    });

    const duration = Date.now() - startTime;
    console.info(
        `===[유저 그레이드 및 베스트 플레이 데이터 업데이트 완료(${duration}ms)]===`
    );
}
