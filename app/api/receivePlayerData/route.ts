import { musicBG } from "@/lib/constants";
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
                    sheet_len: data.sheet.length,
                },
            });

            if (musicBG[resultMusic.index]) {
                // music bg 추가 작업
                await db.music.update({
                    where: { index: resultMusic.index + "" },
                    data: {
                        background: musicBG[resultMusic.index + ""],
                    },
                });
            }
        } else {
            if (musicBG[idx.index]) {
                // music bg 추가 작업
                await db.music.update({
                    where: { index: idx.index },
                    data: {
                        background: musicBG[idx.index],
                    },
                });
            }
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
        // 클리어 랭크 리스트
        const rankList = ["P", "S", "A2", "A", "B2"];
        // 클리어 랭크 저장 변수 선언
        let score = {
            P: 0,
            S: 0,
            A2: 0,
            A: 0,
            B2: 0,
        };

        // 플레이어 데이터 생성 시작
        await music.map(async (data: any) => {
            await data.sheet.map(async (sheet: any) => {
                // 클리어 랭크 변수에 값 추가
                rankList.map((rank) => {
                    if (sheet.rank === rank) {
                        score[rank as keyof typeof score] += 1;
                    }
                });
                // playData 생성
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

        // 유저 테이블에 클리어 랭크 저장
        await db.user.update({
            where: { id: user.id },
            data: {
                score_p: score.P,
                score_s: score.S,
                score_a2: score.A2,
                score_a: score.A,
                score_b2: score.B2,
            },
        });

        // 그레이드 업데이트
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
        // 그레이드 합산
        const userBasicGrade = userBasicGradeData.reduce(
            (acc, cur) => acc + cur.grade_basic,
            0
        );
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
        // 그레이드 합산
        const userRecitalGrade = userRecitalGradeData.reduce(
            (acc, cur) => acc + cur.grade_recital,
            0
        );
        // 그레이드 업데이트
        await db.user.update({
            where: { id: user.id },
            data: {
                grade_basic: userBasicGrade,
                grade_recital: userRecitalGrade,
            },
        });

        // 랭킹 업데이트
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
        // 리사이틀 그레이드 기준 전체 유저 데이터 불러오기
        const recitalAllUser = await db.user.findMany({
            select: {
                id: true,
                grade_recital: true,
            },
            orderBy: [{ grade_recital: "desc" }],
        });
        // 각 유저의 id와 방금 업데이트한 user.id가 같을 경우 해당 랭킹을 업데이트, 다를 경우 rank + 1
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
