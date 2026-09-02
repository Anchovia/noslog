import { describe, expect, it } from "vitest";

import {
    ANNOUNCEMENT_CONTENT_MAX_LENGTH,
    ANNOUNCEMENT_TITLE_MAX_LENGTH,
    announcementDeleteInputFromFormData,
    announcementDeleteSchema,
    announcementFormInputFromFormData,
    announcementFormSchema,
    announcementUpdateInputFromFormData,
    announcementUpdateSchema,
    createAnnouncementDeleteFormData,
    createAnnouncementFormData,
} from "@/features/announcements/schemas/announcementSchema";

describe("관리자 공지사항 스키마", () => {
    it("제목과 내용을 다듬고 공개 상태를 정규화한다", () => {
        expect(
            announcementFormSchema.parse({
                title: "  서비스 공지  ",
                content: "  공지 내용입니다.  ",
                isPublished: true,
            })
        ).toEqual({
            title: "서비스 공지",
            content: "공지 내용입니다.",
            isPublished: true,
        });
    });

    it.each([
        [1, 1],
        [ANNOUNCEMENT_TITLE_MAX_LENGTH, ANNOUNCEMENT_CONTENT_MAX_LENGTH],
    ])(
        "제목 %i자와 내용 %i자 경계를 허용한다",
        (titleLength, contentLength) => {
            expect(
                announcementFormSchema.safeParse({
                    title: "제".repeat(titleLength),
                    content: "내".repeat(contentLength),
                    isPublished: false,
                }).success
            ).toBe(true);
        }
    );

    it("빈 입력과 최대 길이를 넘긴 입력을 거부한다", () => {
        const blankResult = announcementFormSchema.safeParse({
            title: " ",
            content: " ",
            isPublished: false,
        });
        const longResult = announcementFormSchema.safeParse({
            title: "제".repeat(ANNOUNCEMENT_TITLE_MAX_LENGTH + 1),
            content: "내".repeat(ANNOUNCEMENT_CONTENT_MAX_LENGTH + 1),
            isPublished: false,
        });

        expect(blankResult.success).toBe(false);
        if (!blankResult.success) {
            expect(blankResult.error.flatten().fieldErrors).toEqual({
                title: ["공지 제목을 입력해주세요."],
                content: ["공지 내용을 입력해주세요."],
            });
        }
        expect(longResult.success).toBe(false);
        if (!longResult.success) {
            expect(longResult.error.flatten().fieldErrors).toEqual({
                title: ["공지 제목은 80자 이하로 입력해주세요."],
                content: ["공지 내용은 2000자 이하로 입력해주세요."],
            });
        }
    });

    it("HTML 체크박스와 명시적 boolean 문자열을 모두 해석한다", () => {
        const checkedFormData = new FormData();
        checkedFormData.set("title", "제목");
        checkedFormData.set("content", "내용");
        checkedFormData.set("isPublished", "on");

        expect(announcementFormInputFromFormData(checkedFormData)).toEqual({
            title: "제목",
            content: "내용",
            isPublished: true,
        });

        checkedFormData.set("isPublished", "false");
        expect(
            announcementFormInputFromFormData(checkedFormData).isPublished
        ).toBe(false);
    });

    it("생성·수정·삭제 FormData 변환을 한곳에서 검증한다", () => {
        const values = announcementFormSchema.parse({
            title: "공지 제목",
            content: "공지 내용",
            isPublished: true,
        });
        const updateFormData = createAnnouncementFormData(values, 12);
        const deleteFormData = createAnnouncementDeleteFormData(12);

        expect(
            announcementUpdateSchema.parse(
                announcementUpdateInputFromFormData(updateFormData)
            )
        ).toEqual({ id: 12, ...values });
        expect(
            announcementDeleteSchema.parse(
                announcementDeleteInputFromFormData(deleteFormData)
            )
        ).toEqual({ id: 12 });
    });

    it.each(["", "0", "-1", "1.5", "invalid"])(
        "잘못된 공지 ID %s를 거부한다",
        (id) => {
            expect(announcementDeleteSchema.safeParse({ id }).success).toBe(
                false
            );
        }
    );
});
