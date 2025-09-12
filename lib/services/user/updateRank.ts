import db from "@/lib/db";

export async function updateRank() {
    const startTime = Date.now(); // 시작 시간

    // 유저 그레이드 데이터 불러오기(그레이드 기록 내림차순 정렬)
    const userGradeData = await db.user.findMany({
        select: {
            id: true,
            country: true,
            grade_basic: true,
            grade_recital: true,
        },
        orderBy: [{ grade_basic: "desc" }, { grade_recital: "desc" }],
    });
    console.info(
        `(1)전체 유저 데이터 불러오기 완료(${userGradeData.length}명)`
    );

    // 유저 랭킹 업데이트
    await db.$transaction(
        userGradeData.map((user, index) =>
            db.user.update({
                where: { id: user.id },
                data: {
                    rank_basic: index + 1,
                    rank_recital: index + 1,
                },
            })
        )
    );

    const duration = Date.now() - startTime;
    console.info(`==[랭킹 업데이트 성공(${duration}ms)]==`);
}
