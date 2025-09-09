import db from "@/lib/db";

export async function updateRank(user: any) {
    // 랭킹 업데이트
    console.info("랭킹 업데이트 시작...");
    // todo: 중복처리 해야함
    // todo2: 국가별 랭킹도 추후에?
    // user 테이블에 rank(랭킹) 업데이트(그레이드 순으로 제작)
    let basic_rank = 1;
    let recital_rank = 1;
    // 베이직 그레이드 기준 전체 유저 데이터 불러오기
    const basicAllUser = await db.user.findMany({
        select: {
            id: true,
            grade_basic: true,
        },
        orderBy: [{ grade_basic: "desc" }],
    });
    console.info("전체 유저 베이직 그레이드 데이터 불러오기 완료");

    // 리사이틀 그레이드 기준 전체 유저 데이터 불러오기
    const recitalAllUser = await db.user.findMany({
        select: {
            id: true,
            grade_recital: true,
        },
        orderBy: [{ grade_recital: "desc" }],
    });
    console.info("전체 유저 리사이틀 그레이드 데이터 불러오기 완료");

    // 각 유저의 id와 방금 업데이트한 user.id가 같을 경우 해당 랭킹을 업데이트, 다를 경우 rank + 1
    console.info("베이직 랭킹 업데이트 중...");
    basicAllUser.map(async (data) => {
        if (data.id === user.id) {
            await db.user.update({
                where: { id: user.id },
                data: {
                    rank_basic: basic_rank,
                    rank_basic_country: basic_rank,
                },
            });
        } else {
            basic_rank += 1;
        }
    });
    console.info("베이직 랭킹 업데이트 완료");

    console.info("리사이틀 랭킹 업데이트 중...");
    // 리사이틀도 수행
    recitalAllUser.map(async (data) => {
        if (data.id === user.id) {
            await db.user.update({
                where: { id: user.id },
                data: {
                    rank_recital: recital_rank,
                    rank_recital_country: recital_rank,
                },
            });
        } else {
            recital_rank += 1;
        }
    });
    console.info("리사이틀 랭킹 업데이트 완료");
}
