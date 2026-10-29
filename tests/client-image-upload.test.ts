import { describe, expect, it } from "vitest";

import { fitImageSize } from "@/lib/uploads/client-image-upload";

describe("올리기 전 다시 그릴 크기", () => {
    it("긴 변을 2048 로 줄이고 비율을 지킨다", () => {
        expect(fitImageSize(4000, 3000)).toEqual({ width: 2048, height: 1536 });
        expect(fitImageSize(3000, 4000)).toEqual({ width: 1536, height: 2048 });
        expect(fitImageSize(4096, 4096)).toEqual({ width: 2048, height: 2048 });
        expect(fitImageSize(5000, 1234)).toEqual({ width: 2048, height: 505 });
    });

    it("상한 안의 이미지는 키우지도 줄이지도 않는다", () => {
        expect(fitImageSize(800, 600)).toEqual({ width: 800, height: 600 });
        expect(fitImageSize(2048, 100)).toEqual({ width: 2048, height: 100 });
        expect(fitImageSize(1, 1)).toEqual({ width: 1, height: 1 });
    });

    it("아주 긴 이미지도 짧은 변이 1 아래로 내려가지 않는다", () => {
        expect(fitImageSize(100000, 10)).toEqual({ width: 2048, height: 1 });
        expect(fitImageSize(10, 100000)).toEqual({ width: 1, height: 2048 });
    });
});
