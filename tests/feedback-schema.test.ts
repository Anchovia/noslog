import { describe, expect, it } from "vitest";

import {
    createFeedbackReportFormData,
    createFeedbackReportSchema,
    feedbackReportInputFromFormData,
} from "@/features/feedback/schemas/feedbackReportSchema";
import { createTranslator, getMessages } from "@/lib/i18n/messages";
import type { Locale } from "@/lib/i18n/routing";

function schemaFor(locale: Locale) {
    return createFeedbackReportSchema(createTranslator(getMessages(locale)));
}

describe("피드백 제보 스키마", () => {
    it.each([
        ["ko", "제보 내용은 10~1000자로 입력해주세요."],
        ["ja", "報告内容は10〜1000文字で入力してください。"],
        ["en", "Enter between 10 and 1,000 characters."],
    ] as const)("%s 오류 문구를 해당 언어로 반환한다", (locale, message) => {
        const result = schemaFor(locale).safeParse({
            content: "short",
            imageUrl: "",
        });

        expect(result.success).toBe(false);
        if (result.success) return;
        expect(result.error.flatten().fieldErrors.content).toEqual([message]);
    });

    it("내용을 다듬고 빈 첨부 주소를 null로 정규화한다", () => {
        expect(
            schemaFor("ko").parse({
                content: "  충분한 길이의 제보 내용  ",
                imageUrl: "",
            })
        ).toEqual({
            content: "충분한 길이의 제보 내용",
            imageUrl: null,
        });
    });

    it.each([10, 1000])("%i자 경계값을 허용한다", (length) => {
        expect(
            schemaFor("en").safeParse({
                content: "a".repeat(length),
                imageUrl: "",
            }).success
        ).toBe(true);
    });

    it.each([9, 1001])("%i자 경계 밖 입력을 거부한다", (length) => {
        expect(
            schemaFor("en").safeParse({
                content: "a".repeat(length),
                imageUrl: "",
            }).success
        ).toBe(false);
    });

    it("유효하지 않은 첨부 주소를 거부한다", () => {
        const result = schemaFor("en").safeParse({
            content: "valid feedback content",
            imageUrl: "not-a-url",
        });

        expect(result.success).toBe(false);
        if (result.success) return;
        expect(result.error.flatten().fieldErrors.imageUrl).toEqual([
            "This attachment is not allowed.",
        ]);
    });

    it("폼 값과 FormData 변환을 한곳에서 왕복한다", () => {
        const parsed = schemaFor("ko").parse({
            content: "  충분한 길이의 제보 내용  ",
            imageUrl:
                "https://store.private.blob.vercel-storage.com/feedback/2/report.png",
        });
        const formData = createFeedbackReportFormData(parsed, "ja");

        expect(feedbackReportInputFromFormData(formData)).toEqual({
            content: parsed.content,
            imageUrl: parsed.imageUrl,
        });
        expect(formData.get("locale")).toBe("ja");
    });
});
