import db from "@/lib/db";

async function makeBasicGrade(user: any) {
    // 베이직 그레이드 상위 50개 곡의 그레이드 합산
    const userBasicGradeData = await db.playData.findMany({
        where: {
            user_id: user.id,
        },
        select: {
            grade_basic: true,
        },
        orderBy: [{ grade_basic: "desc" }],
        take: 50,
    });
    console.info("(1)베이직 그레이드 상위 50개 곡 불러오기 완료");

    // 그레이드 합산
    const userBasicGrade = userBasicGradeData.reduce(
        (acc, cur) => acc + cur.grade_basic,
        0
    );
    console.info("(2)베이직 그레이드 합산 완료");

    return userBasicGrade;
}

async function makeRicitalGrade(user: any) {
    // 리사이틀 그레이드 상위 50개 곡의 그레이드 합산
    const userRecitalGradeData = await db.playData.findMany({
        where: {
            user_id: user.id,
        },
        select: {
            grade_recital: true,
        },
        orderBy: [{ grade_recital: "desc" }],
        take: 50,
    });
    console.info("(3)리사이틀 그레이드 상위 50개 곡 불러오기 완료");

    // 그레이드 합산
    const userRecitalGrade = userRecitalGradeData.reduce(
        (acc, cur) => acc + cur.grade_recital,
        0
    );
    console.info("(4)리사이틀 그레이드 합산 완료");

    return userRecitalGrade;
}

export async function updateGrade(user: any) {
    const startTime = Date.now(); // 시작 시간

    const basicGrade = await makeBasicGrade(user);
    const recitalGrade = await makeRicitalGrade(user);

    // 그레이드 업데이트
    await db.user.update({
        where: { id: user.id },
        data: {
            grade_basic: basicGrade,
            grade_recital: recitalGrade,
        },
    });

    const duration = Date.now() - startTime;
    console.info(`===[유저 그레이드 데이터 업데이트 완료(${duration}ms)]===`);
}
