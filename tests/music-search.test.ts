import { describe, expect, it } from "vitest";

import {
    buildMusicSearchParams,
    getInitialMusicDifficultyRanges,
    getInitialMusicDifficultyState,
    parseMusicCategories,
} from "@/components/music/search/musicSearchUtils";

describe("악곡 검색 UI 쿼리 변환", () => {
    it("유효한 카테고리만 초기 선택값으로 사용한다", () => {
        expect(parseMusicCategories("bm,ORG,unknown,cl/jz")).toEqual([
            "BM",
            "Org",
            "Cl/Jz",
        ]);
    });

    it("명시된 난이도가 없으면 Expert만 기본 선택한다", () => {
        expect(getInitialMusicDifficultyState({})).toEqual({
            normal: false,
            hard: false,
            expert: true,
            real: false,
        });
        expect(getInitialMusicDifficultyRanges({}).expert).toEqual([8, 12]);
    });

    it("단일 레벨 범위와 기존 정렬·보기 설정을 URL에 보존한다", () => {
        const params = buildMusicSearchParams({
            categories: ["BM"],
            difficulties: {
                normal: true,
                hard: false,
                expert: false,
                real: true,
            },
            ranges: {
                normal: [5, 5],
                hard: [1, 12],
                expert: [8, 12],
                real: [3, 3],
            },
            searchValue: "Life",
            currentParams: {
                sort: "level",
                order: "desc",
                view: "grid",
            },
            recordFilters: ["s", "unplayed"],
        });

        expect(params.get("q")).toBe("Life");
        expect(params.get("categories")).toBe("BM");
        expect(params.get("normalMin")).toBe("5");
        expect(params.get("normalMax")).toBe("5");
        expect(params.get("hard")).toBe("false");
        expect(params.has("hardMin")).toBe(false);
        expect(params.get("realMin")).toBe("3");
        expect(params.get("realMax")).toBe("3");
        expect(params.get("sort")).toBe("level");
        expect(params.get("order")).toBe("desc");
        expect(params.get("view")).toBe("grid");
        expect(params.get("records")).toBe("s,unplayed");
    });
});
