import { describe, expect, it } from "vitest";

import {
    BINGO_CELL_COUNT,
    bingoFormSchema,
    type BingoFormValues,
} from "@/features/bingos/schemas/bingoEditorSchema";

function createValidInput(): BingoFormValues {
    return {
        title: "테스트 빙고",
        description: "설명",
        coverMusicIndex: "cover-music",
        rewardNos: "3000",
        requiredLines: "5",
        status: "published",
        startsAt: "2026-09-01",
        endsAt: "2026-09-30",
        cells: Array.from({ length: BINGO_CELL_COUNT }, (_, offset) => ({
            position: offset + 1,
            title: `미션 ${offset + 1}`,
            missionType: "record",
            ruleType: "manual",
            ruleConfig: "",
            categoryShort: "",
            targetDifficulty: "",
            targetLevel: "",
            musicIndex: "",
        })),
    };
}

describe("빙고 편집 스키마", () => {
    it("폼 문자열을 저장 값으로 정규화한다", () => {
        const result = bingoFormSchema.parse(createValidInput());

        expect(result.rewardNos).toBe(3000);
        expect(result.requiredLines).toBe(5);
        expect(result.cells).toHaveLength(25);
        expect(result.cells[0]?.targetLevel).toBeNull();
    });

    it("기존 저장 규칙대로 보상과 필요 줄 수를 범위 안으로 제한한다", () => {
        const input = createValidInput();
        input.rewardNos = "-100";
        input.requiredLines = "99";

        const result = bingoFormSchema.parse(input);

        expect(result.rewardNos).toBe(0);
        expect(result.requiredLines).toBe(12);
    });

    it("25개 미션 중 빈 내용을 거부한다", () => {
        const input = createValidInput();
        input.cells[12]!.title = "";

        const result = bingoFormSchema.safeParse(input);

        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.issues).toContainEqual(
                expect.objectContaining({
                    path: ["cells", 12, "title"],
                    message: "미션 내용을 입력해주세요.",
                })
            );
        }
    });

    it("미션 레벨은 빈 값 또는 1~14만 허용한다", () => {
        const input = createValidInput();
        input.cells[0]!.targetLevel = "15";

        const result = bingoFormSchema.safeParse(input);

        expect(result.success).toBe(false);
    });

    it("실재하지 않는 날짜 입력을 거부한다", () => {
        const input = createValidInput();
        input.startsAt = "2026-02-31";

        const result = bingoFormSchema.safeParse(input);

        expect(result.success).toBe(false);
    });
});
