import db from "../db";

export async function updateDummy() {
    const bingoSession = await db.bingo.findFirst();

    if (!bingoSession) {
        await db.bingo.createMany({
            data: bingo,
        });
        await db.bingoCell.createMany({
            data: bingoCell,
        });
    }
}

export const bingo = [
    {
        id: 1,
        nos: 3000,
        line: 5,
        music_idx: "1bc57abed4d73664f8cb68e0a1665ec0",
    },
];

export const bingoCell = [
    {
        id: 1,
        position: 1,
        bingo_id: 1,
        challenge: "Timepiece phase II 연주",
        music_idx: "66050f93dcb91eed6727373ce318737c",
    },
    {
        id: 2,
        position: 2,
        bingo_id: 1,
        challenge: "Basic · Recital · 30Grd↑",
    },
    {
        id: 3,
        position: 3,
        bingo_id: 1,
        challenge: "BM악곡 플레이",
        category_short: "BM",
    },
    {
        id: 4,
        position: 4,
        bingo_id: 1,
        challenge: "Cl/Jz · Expert↑ · Miss5회↓, 3회",
        category_short: "Cl/Jz",
    },
    {
        id: 5,
        position: 5,
        bingo_id: 1,
        challenge: "Recital 30Grd↑, 5회",
    },
    {
        id: 6,
        position: 6,
        bingo_id: 1,
        challenge: "글리산도 · ◆Just · 누적200회↑",
    },
    {
        id: 7,
        position: 7,
        bingo_id: 1,
        challenge: "The Least 100sec 연주",
        music_idx: "6d6226a6d42346bd9dc3c6fd3ac5255b",
    },
    {
        id: 8,
        position: 8,
        bingo_id: 1,
        challenge: "Var · 350콤보↑, 5회",
        category_short: "var",
    },
    {
        id: 9,
        position: 9,
        bingo_id: 1,
        challenge: "A+↑, 7회",
    },
    {
        id: 10,
        position: 10,
        bingo_id: 1,
        challenge: "Hard↑ · Just↑, 누적1500회↑",
    },
    {
        id: 11,
        position: 11,
        bingo_id: 1,
        music_idx: "9b4cb026d4885c19e4c4ef65b24bcd77",
        challenge: "robotip phactory 플레이",
    },
    {
        id: 12,
        position: 12,
        bingo_id: 1,
        category_short: "anime · Expert · Near+Miss=25↓, 3회",
        challenge: "anime",
    },
    {
        id: 13,
        position: 13,
        bingo_id: 1,
        category_short: "anime · Expert · Near+Miss=25↓, 3회",
        challenge: "anime",
    },
    {
        id: 14,
        position: 14,
        bingo_id: 1,
        category_short: "anime · Expert · Near+Miss=25↓, 3회",
        challenge: "anime",
    },
    {
        id: 15,
        position: 15,
        bingo_id: 1,
        category_short: "anime · Expert · Near+Miss=25↓, 3회",
        challenge: "anime",
    },
    {
        id: 16,
        position: 16,
        bingo_id: 1,
        category_short: "anime · Expert · Near+Miss=25↓, 3회",
        challenge: "anime",
    },
    {
        id: 17,
        position: 17,
        bingo_id: 1,
        category_short: "anime · Expert · Near+Miss=25↓, 3회",
        challenge: "anime",
    },
    {
        id: 18,
        position: 18,
        bingo_id: 1,
        category_short: "anime · Expert · Near+Miss=25↓, 3회",
        challenge: "anime",
    },
    {
        id: 19,
        position: 19,
        bingo_id: 1,
        category_short: "anime · Expert · Near+Miss=25↓, 3회",
        challenge: "anime",
    },
    {
        id: 20,
        position: 20,
        bingo_id: 1,
        category_short: "anime · Expert · Near+Miss=25↓, 3회",
        challenge: "anime",
    },
    {
        id: 21,
        position: 21,
        bingo_id: 1,
        category_short: "anime · Expert · Near+Miss=25↓, 3회",
        challenge: "anime",
    },
    {
        id: 22,
        position: 22,
        bingo_id: 1,
        category_short: "anime · Expert · Near+Miss=25↓, 3회",
        challenge: "anime",
    },
    {
        id: 23,
        position: 23,
        bingo_id: 1,
        category_short: "anime · Expert · Near+Miss=25↓, 3회",
        challenge: "anime",
    },
    {
        id: 24,
        position: 24,
        bingo_id: 1,
        category_short: "anime · Expert · Near+Miss=25↓, 3회",
        challenge: "anime",
    },
    {
        id: 25,
        position: 25,
        bingo_id: 1,
        category_short: "anime · Expert · Near+Miss=25↓, 3회",
        challenge: "anime",
    },
];
