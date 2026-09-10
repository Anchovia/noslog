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
    suggestAnnouncementSlug,
    toDateTimeLocalValue,
} from "@/features/announcements/schemas/announcementSchema";

const translation = { title: "서비스 공지", content: "공지 내용입니다." };
const validInput = {
    publicSlug: "service-notice",
    placement: "ROUTINE",
    priority: "0",
    activeFrom: "",
    expiresAt: "",
    isPublished: true,
    translations: { ko: translation, ja: translation, en: translation },
};

describe("관리자 공지사항 스키마", () => {
    it("제목·내용·주소를 다듬고 일정을 Date | null 로 정규화한다", () => {
        expect(
            announcementFormSchema.parse({
                ...validInput,
                publicSlug: "  Service-Notice  ",
                translations: {
                    ko: { title: "  서비스 공지  ", content: "  내용  " },
                    ja: translation,
                    en: translation,
                },
            })
        ).toEqual({
            publicSlug: "service-notice",
            placement: "ROUTINE",
            category: "NOTICE",
            priority: 0,
            activeFrom: null,
            expiresAt: null,
            isPublished: true,
            translations: {
                ko: { title: "서비스 공지", content: "내용" },
                ja: translation,
                en: translation,
            },
        });
    });

    it.each([
        [1, 1],
        [ANNOUNCEMENT_TITLE_MAX_LENGTH, ANNOUNCEMENT_CONTENT_MAX_LENGTH],
    ])(
        "제목 %i자와 내용 %i자 경계를 허용한다",
        (titleLength, contentLength) => {
            const item = {
                title: "제".repeat(titleLength),
                content: "내".repeat(contentLength),
            };
            expect(
                announcementFormSchema.safeParse({
                    ...validInput,
                    translations: { ko: item, ja: item, en: item },
                }).success
            ).toBe(true);
        }
    );

    it("빈 번역과 최대 길이를 넘긴 번역을 로케일 경로로 거부한다", () => {
        const blankResult = announcementFormSchema.safeParse({
            ...validInput,
            translations: {
                ko: { title: " ", content: " " },
                ja: translation,
                en: translation,
            },
        });
        const longResult = announcementFormSchema.safeParse({
            ...validInput,
            translations: {
                ko: translation,
                ja: translation,
                en: {
                    title: "제".repeat(ANNOUNCEMENT_TITLE_MAX_LENGTH + 1),
                    content: "내".repeat(ANNOUNCEMENT_CONTENT_MAX_LENGTH + 1),
                },
            },
        });

        expect(blankResult.success).toBe(false);
        if (!blankResult.success) {
            expect(
                blankResult.error.issues.map((issue) => [
                    issue.path.join("."),
                    issue.message,
                ])
            ).toEqual([
                ["translations.ko.title", "공지 제목을 입력해주세요."],
                ["translations.ko.content", "공지 내용을 입력해주세요."],
            ]);
        }
        expect(longResult.success).toBe(false);
        if (!longResult.success) {
            expect(
                longResult.error.issues.map((issue) => [
                    issue.path.join("."),
                    issue.message,
                ])
            ).toEqual([
                [
                    "translations.en.title",
                    "공지 제목은 80자 이하로 입력해주세요.",
                ],
                [
                    "translations.en.content",
                    "공지 내용은 5000자 이하로 입력해주세요.",
                ],
            ]);
        }
    });

    it.each(["", "notice_1", "-notice", "notice-", "한글", "no  tice"])(
        "공개 주소 %j 를 거부한다",
        (publicSlug) => {
            const result = announcementFormSchema.safeParse({
                ...validInput,
                publicSlug,
            });
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0]?.path).toEqual(["publicSlug"]);
            }
        }
    );

    it("중대 공지는 노출 시작이 필요하고 종료는 시작보다 뒤여야 한다", () => {
        const missingStart = announcementFormSchema.safeParse({
            ...validInput,
            placement: "SERVICE_CRITICAL",
        });
        expect(missingStart.success).toBe(false);
        if (!missingStart.success) {
            expect(missingStart.error.issues).toEqual([
                expect.objectContaining({
                    path: ["activeFrom"],
                    message: "중대 공지는 노출 시작 시각이 필요합니다.",
                }),
            ]);
        }

        const reversed = announcementFormSchema.safeParse({
            ...validInput,
            placement: "SERVICE_CRITICAL",
            activeFrom: "2026-09-10T10:00",
            expiresAt: "2026-09-10T09:00",
        });
        expect(reversed.success).toBe(false);
        if (!reversed.success) {
            expect(reversed.error.issues).toEqual([
                expect.objectContaining({
                    path: ["expiresAt"],
                    message: "노출 종료는 노출 시작보다 뒤여야 합니다.",
                }),
            ]);
        }

        const scheduled = announcementFormSchema.parse({
            ...validInput,
            placement: "SERVICE_CRITICAL",
            priority: "5",
            activeFrom: "2026-09-10T10:00",
            expiresAt: "2026-09-11T10:00",
        });
        expect(scheduled.priority).toBe(5);
        expect(scheduled.activeFrom).toEqual(new Date("2026-09-10T10:00"));
        expect(scheduled.expiresAt).toEqual(new Date("2026-09-11T10:00"));
    });

    it("HTML 체크박스와 명시적 boolean 문자열을 모두 해석한다", () => {
        const formData = createAnnouncementFormData(
            announcementFormSchema.parse(validInput)
        );
        formData.set("isPublished", "on");
        expect(announcementFormInputFromFormData(formData).isPublished).toBe(
            true
        );
        formData.set("isPublished", "false");
        expect(announcementFormInputFromFormData(formData).isPublished).toBe(
            false
        );
    });

    it("분류를 지정하면 그대로 두고 비우면 NOTICE, 집합 밖 값은 거부한다", () => {
        expect(
            announcementFormSchema.parse({ ...validInput, category: "DATA" })
                .category
        ).toBe("DATA");
        expect(
            announcementFormSchema.parse({ ...validInput, category: " " })
                .category
        ).toBe("NOTICE");
        const invalid = announcementFormSchema.safeParse({
            ...validInput,
            category: "URGENT",
        });
        expect(invalid.success).toBe(false);
        if (!invalid.success)
            expect(invalid.error.issues[0]?.path).toEqual(["category"]);
    });

    it("생성·수정·삭제 FormData 변환을 한곳에서 검증한다", () => {
        const values = announcementFormSchema.parse({
            ...validInput,
            placement: "SERVICE_CRITICAL",
            activeFrom: "2026-09-10T10:00",
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

    it("제목에서 공개 주소 초안을 만들고 datetime-local 값을 되돌린다", () => {
        expect(
            suggestAnnouncementSlug("The NosLog website is in testing!")
        ).toBe("the-noslog-website-is-in-testing");
        expect(suggestAnnouncementSlug("홈페이지 테스트")).toBe("");
        expect(toDateTimeLocalValue(new Date(2026, 8, 10, 9, 5))).toBe(
            "2026-09-10T09:05"
        );
        expect(toDateTimeLocalValue(null)).toBe("");
    });
});
