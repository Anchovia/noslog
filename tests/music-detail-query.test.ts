import { describe, expect, it } from "vitest";

import { musicDetailQueryKey } from "@/features/music/api/musicDetail";

describe("musicDetailQueryKey", () => {
    it("랭킹 탭은 페이지별 캐시를 구분한다", () => {
        expect(
            musicDetailQueryKey({
                index: "music-1",
                difficulty: "Expert",
                tab: "ranking",
                page: 3,
                locale: "ko",
            })
        ).toEqual(["music-detail", "music-1", "Expert", "ranking", 3, "ko"]);
    });

    it("페이지를 사용하지 않는 탭은 첫 페이지 키로 정규화한다", () => {
        expect(
            musicDetailQueryKey({
                index: "music-1",
                difficulty: "Expert",
                tab: "detail",
                page: 9,
                locale: "en",
            })
        ).toEqual(["music-detail", "music-1", "Expert", "detail", 1, "en"]);
    });
});
