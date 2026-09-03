import { describe, expect, it } from "vitest";

import {
    createMusicCatalogReviewFormData,
    musicCatalogReviewInputFromFormData,
    musicCatalogReviewSchema,
    normalizeMusicCatalogStatus,
} from "@/features/music/schemas/musicCatalogAdminSchema";

describe("관리자 악곡 카탈로그 스키마", () => {
    it("지원하는 목록 상태만 유지한다", () => {
        expect(normalizeMusicCatalogStatus("applied")).toBe("applied");
        expect(normalizeMusicCatalogStatus("unknown")).toBe("pending");
        expect(normalizeMusicCatalogStatus(undefined)).toBe("pending");
    });

    it("검토 FormData를 양의 정수 ID와 결정으로 변환한다", () => {
        const formData = createMusicCatalogReviewFormData(7, "approve");

        expect(
            musicCatalogReviewSchema.parse(
                musicCatalogReviewInputFromFormData(formData)
            )
        ).toEqual({
            candidateId: 7,
            decision: "approve",
        });
    });

    it.each([
        ["0", "approve"],
        ["-1", "reject"],
        ["1.5", "approve"],
        ["7", "pending"],
    ])("잘못된 검토 요청 %s/%s를 거부한다", (candidateId, decision) => {
        expect(
            musicCatalogReviewSchema.safeParse({
                candidateId,
                decision,
            }).success
        ).toBe(false);
    });
});
