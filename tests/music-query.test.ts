import { describe, expect, it } from "vitest";

import { normalizeMusicQuery } from "@/app/(nevigation)/music/query";

describe("normalizeMusicQuery", () => {
    it("필터가 없으면 Expert 8~12와 이름 오름차순을 기본값으로 사용한다", () => {
        expect(normalizeMusicQuery({})).toEqual({
            q: "",
            categories: [],
            difficulties: [{ difficulty: "Expert", min: 8, max: 12 }],
            sort: "name",
            order: "asc",
        });
    });

    it("Normal과 Real을 동시에 선택하고 각 레벨 범위를 유지한다", () => {
        const result = normalizeMusicQuery({
            normal: "true",
            hard: "false",
            expert: "false",
            real: "true",
            normalMin: "5",
            normalMax: "5",
            realMin: "3",
            realMax: "3",
        });

        expect(result.difficulties).toEqual([
            { difficulty: "Normal", min: 5, max: 5 },
            { difficulty: "Real", min: 3, max: 3 },
        ]);
    });

    it("검색어와 카테고리를 정리하고 레벨 정렬 기본값을 내림차순으로 둔다", () => {
        const result = normalizeMusicQuery({
            q: "  Life  ",
            categories: "BM,Org,,",
            sort: "level",
        });

        expect(result.q).toBe("Life");
        expect(result.categories).toEqual(["BM", "Org"]);
        expect(result.order).toBe("desc");
    });

    it("잘못된 숫자는 난이도별 기본 범위로 복구한다", () => {
        const result = normalizeMusicQuery({
            real: "true",
            realMin: "invalid",
            realMax: "invalid",
        });

        expect(result.difficulties).toEqual([
            { difficulty: "Real", min: 1, max: 3 },
        ]);
    });
});
