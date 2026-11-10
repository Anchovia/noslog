import { describe, expect, it } from "vitest";

import { musicSearchSchema } from "@/features/music/schemas/music-search-schema";

describe("악곡 검색 폼 스키마", () => {
    it("문자열 검색어를 폼 입력으로 허용한다", () => {
        expect(musicSearchSchema.parse({ search: "Life" })).toEqual({
            search: "Life",
        });
    });

    it("문자열이 아닌 검색어를 거부한다", () => {
        expect(musicSearchSchema.safeParse({ search: null }).success).toBe(
            false
        );
    });
});
