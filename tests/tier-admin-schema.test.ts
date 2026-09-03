import { describe, expect, it } from "vitest";

import {
    createTierListFormData,
    tierBandCreateSchema,
    tierBoardLayoutSchema,
    tierListFormSchema,
    tierListSaveInputFromFormData,
} from "@/features/tiers/schemas/tierAdminSchema";

describe("관리자 서열표 스키마", () => {
    it("서열표 기본값을 정리하고 타입을 제한한다", () => {
        const result = tierListFormSchema.parse({
            slug: " Basic Lv12+ ",
            title: "  Basic Lv12+ 서열표  ",
            mode: "basic",
            goal: "s",
            description: "  설명  ",
            status: "draft",
        });

        expect(result).toEqual({
            slug: "basic-lv12-",
            title: "Basic Lv12+ 서열표",
            mode: "basic",
            goal: "s",
            description: "설명",
            status: "draft",
        });
    });

    it("필수 이름과 유효한 식별자가 없으면 거부한다", () => {
        const result = tierListFormSchema.safeParse({
            slug: "---",
            title: " ",
            mode: "unknown",
            goal: "unknown",
            description: "",
            status: "unknown",
        });

        expect(result.success).toBe(false);
        if (result.success) return;
        expect(result.error.flatten().fieldErrors).toMatchObject({
            slug: ["식별자에는 영문 소문자나 숫자가 필요합니다."],
            title: ["서열표 이름을 입력해주세요."],
        });
    });

    it("서열 상수 범위와 소수점 한 자리를 검증한다", () => {
        expect(
            tierBandCreateSchema.safeParse({ tierListId: "5", value: "12.3" })
                .success
        ).toBe(true);
        expect(
            tierBandCreateSchema.safeParse({ tierListId: "5", value: "12.34" })
                .success
        ).toBe(false);
        expect(
            tierBandCreateSchema.safeParse({ tierListId: "5", value: "15" })
                .success
        ).toBe(false);
    });

    it("폼 값과 FormData 변환을 같은 스키마로 다시 검증한다", () => {
        const values = tierListFormSchema.parse({
            slug: "basic-s",
            title: "Basic S",
            mode: "basic",
            goal: "s",
            description: "설명",
            status: "published",
        });
        const formData = createTierListFormData(values, 12);

        expect(tierListSaveInputFromFormData(formData)).toEqual({
            id: "12",
            ...values,
        });
    });

    it("일괄 배치의 식별자와 위치를 양의 정수로 제한한다", () => {
        expect(
            tierBoardLayoutSchema.safeParse({
                tierListId: 5,
                placements: [{ id: 1, tierBandId: 2, position: 1 }],
            }).success
        ).toBe(true);
        expect(
            tierBoardLayoutSchema.safeParse({
                tierListId: 5,
                placements: [{ id: 1, tierBandId: 2, position: 0 }],
            }).success
        ).toBe(false);
    });
});
