import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

interface NosdataMusic {
    index: string;
    title: string;
    artist: string | null;
    titleKana: string;
    description: string | null;
    categoryShort: string;
    levels: { difficulty: string; level: number; constant?: number }[];
}

const musics = JSON.parse(
    fs.readFileSync(
        path.join(process.cwd(), "prisma/data/nosdata-musics.json"),
        "utf8"
    )
) as NosdataMusic[];

describe("Nosdata ζ 악곡 가져오기 데이터", () => {
    it("정식 악곡 578곡과 고유 ID를 포함한다", () => {
        expect(musics).toHaveLength(578);
        expect(new Set(musics.map((music) => music.index)).size).toBe(578);
        expect(
            musics.every((music) => /^[a-f0-9]{32}$/.test(music.index))
        ).toBe(true);
    });

    it("모든 악곡의 기본 정보와 카테고리가 유효하다", () => {
        const categories = new Set([
            "BM",
            "Org",
            "Cl/Jz",
            "Var",
            "anime",
            "pops",
        ]);

        for (const music of musics) {
            expect(music.title.trim().length, music.index).toBeGreaterThan(0);
            expect(music.titleKana.trim().length, music.title).toBeGreaterThan(
                0
            );
            expect(categories.has(music.categoryShort), music.title).toBe(true);
        }
    });

    it("각 악곡의 난이도와 레벨이 유효하다", () => {
        const difficulties = new Set(["Normal", "Hard", "Expert", "Real"]);

        for (const music of musics) {
            expect(music.levels.length, music.title).toBeGreaterThanOrEqual(3);
            expect(
                new Set(music.levels.map((chart) => chart.difficulty)).size
            ).toBe(music.levels.length);
            for (const chart of music.levels) {
                expect(difficulties.has(chart.difficulty), music.title).toBe(
                    true
                );
                expect(Number.isInteger(chart.level), music.title).toBe(true);
                expect(chart.level, music.title).toBeGreaterThanOrEqual(1);
                expect(chart.level, music.title).toBeLessThanOrEqual(12);
            }
        }
    });

    it("검정 보완 과정에서 추가된 Real 채보의 공식 상수를 포함한다", () => {
        const expectedConstants = new Map([
            ["管弦楽組曲第2番より「バディヌリー」", 12.5],
            ["野ばら", 12.5],
            ["エチュード Op.25-5", 13],
            ["クープランの墓よりプレリュード", 13],
            ["ハンガリー狂詩曲第2番", 13],
            ["レクイエムより「怒りの日」", 13],
            ["東洋風幻想曲イスラメイ", 13.5],
        ]);

        for (const [title, constant] of expectedConstants) {
            const realChart = musics
                .find((music) => music.title === title)
                ?.levels.find((chart) => chart.difficulty === "Real");
            expect(realChart?.constant, title).toBe(constant);
        }
    });
});
