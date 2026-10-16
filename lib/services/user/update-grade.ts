import db from "@/lib/db";
import { writePlayerStats } from "@/lib/services/user/player-stats";

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
            where: { user_id, grade_recital: { not: null } },
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
    const recitalGrade = recitalBestData.length
        ? recitalBestData.reduce(
              (acc, cur) => acc + (cur.grade_recital ?? 0),
              0
          )
        : null;
    console.info("(4)리사이틀 그레이드 합산 완료");

    // 트랜잭션으로 모든 DB 작업을 원자적으로 처리
    await db.$transaction(async (tx) => {
        const today = getKoreanDate();
        const day = new Date(`${today}T00:00:00Z`);

        // 그레이드는 player_stats 에만 쓴다(2026-10-16 DB 재설계 P5-1 — User 옛 열 쓰기 중단)
        await writePlayerStats(tx, user_id, {
            gradeBasic: basicGrade,
            gradeRecital: recitalGrade,
        });
        console.info("(5)유저 그레이드 업데이트 완료");

        // 사람당 하루(서울 날짜) 한 줄 — 같은 날 다시 동기화하면 그 줄을 지금 값으로(유일 키 user_id · day)
        await tx.userBestGrade.upsert({
            where: { user_id_day: { user_id, day } },
            create: {
                user_id,
                day,
                grade_basic: basicGrade,
                grade_recital: recitalGrade,
            },
            update: {
                grade_basic: basicGrade,
                grade_recital: recitalGrade,
            },
        });

        // P6 supports 90-day, yearly and full history. Older observations remain intact.
    });

    const duration = Date.now() - startTime;
    console.info(
        `===[유저 그레이드 및 베스트 플레이 데이터 업데이트 완료(${duration}ms)]===`
    );
    return { grade_basic: basicGrade, grade_recital: recitalGrade };
}

/**
 * 바뀐 기록이 없는 동기화 — Grd 를 다시 세지 않고 오늘 「하루 한 줄」 만 지금 값으로 남긴다(2026-10-16 P4).
 * 오늘 줄이 이미 있으면 그대로 둔다(유일 키 UserBestGrade_user_id_day_key). 지금 값은 player_stats 에서(P5-1)
 */
export async function keepTodayGrade(user_id: number) {
    const today = getKoreanDate();
    await db.$executeRaw`
        INSERT INTO "UserBestGrade" ("user_id", "day", "grade_basic", "grade_recital", "updated_at")
        SELECT "user_id", ${today}::date, COALESCE("grade_basic", 0), "grade_recital", CURRENT_TIMESTAMP
        FROM "player_stats" WHERE "user_id" = ${user_id}
        ON CONFLICT ("user_id", "day") DO NOTHING`;
}
