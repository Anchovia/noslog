import { describe, expect, it } from "vitest";

import {
    getStoredArcadeRegion,
    inferLegacyArcadeRegion,
    isArcadeRegion,
} from "@/lib/arcadeRegions";

describe("오락실 지역", () => {
    it("관리자가 선택할 수 있는 고정 지역만 허용한다", () => {
        expect(isArcadeRegion("서울")).toBe(true);
        expect(isArcadeRegion("충남")).toBe(true);
        expect(isArcadeRegion("기타")).toBe(true);
        expect(isArcadeRegion("은평구")).toBe(false);
    });

    it("공개 화면은 주소가 아니라 저장된 지역만 사용한다", () => {
        expect(getStoredArcadeRegion("경기")).toBe("경기");
        expect(getStoredArcadeRegion("은평구")).toBe("기타");
        expect(getStoredArcadeRegion(null)).toBe("기타");
    });

    it("기존 자유 입력값은 관리자 편집 시 주소로 고정 지역을 제안한다", () => {
        expect(
            inferLegacyArcadeRegion("은평구", "서울 은평구 연서로29길 8-8")
        ).toBe("서울");
        expect(inferLegacyArcadeRegion("경기", "서울 강남구")).toBe("경기");
        // 충남은 주소에 줄임말(충남)이나 정식 이름(충청남도) 어느 쪽으로 적혀 있어도 찾는다
        expect(inferLegacyArcadeRegion("", "충남 천안시 동남구 대흥로 1")).toBe(
            "충남"
        );
        expect(
            inferLegacyArcadeRegion("천안", "충청남도 천안시 서북구 불당동")
        ).toBe("충남");
    });
});
