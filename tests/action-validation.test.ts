import { describe, expect, it } from "vitest";
import { z } from "zod";

import {
    actionFieldErrorsFromZod,
    actionValidationFailure,
} from "@/lib/actions/validation";

describe("서버 액션 검증 실패", () => {
    const schema = z.object({
        title: z.string().min(1, "제목을 입력해주세요."),
        translation: z.object({
            content: z.string().min(1, "내용을 입력해주세요."),
        }),
    });
    const result = schema.safeParse({
        title: "",
        translation: { content: "" },
    });

    if (result.success) throw new Error("검증 실패가 필요합니다.");

    it("기본적으로 첫 경로별 필드 오류를 만든다", () => {
        expect(actionFieldErrorsFromZod(result.error)).toEqual({
            title: ["제목을 입력해주세요."],
            translation: ["내용을 입력해주세요."],
        });
    });

    it("중첩 경로와 제외 필드를 지원한다", () => {
        expect(
            actionFieldErrorsFromZod(result.error, {
                fieldPath: "full",
                omitFields: ["title"],
            })
        ).toEqual({
            "translation.content": ["내용을 입력해주세요."],
        });
    });

    it("고정 메시지와 필드 오류를 함께 반환한다", () => {
        expect(
            actionValidationFailure(result.error, {
                message: "입력을 확인해주세요.",
                alwaysIncludeFieldErrors: true,
            })
        ).toEqual({
            success: false,
            message: "입력을 확인해주세요.",
            fieldErrors: {
                title: ["제목을 입력해주세요."],
                translation: ["내용을 입력해주세요."],
            },
        });
    });

    it("첫 오류와 사용자 정의 메시지 선택을 지원한다", () => {
        expect(
            actionValidationFailure(result.error, {
                message: "입력을 확인해주세요.",
                preferFirstIssue: true,
                fieldPath: false,
            })
        ).toEqual({
            success: false,
            message: "제목을 입력해주세요.",
        });

        expect(
            actionValidationFailure(result.error, {
                message: "입력을 확인해주세요.",
                messageFields: ["translation", "title"],
            })
        ).toMatchObject({ message: "내용을 입력해주세요." });

        expect(
            actionValidationFailure(result.error, {
                message: "입력을 확인해주세요.",
                resolveMessage: ({ firstIssueMessage }) =>
                    `오류: ${firstIssueMessage}`,
                fieldPath: false,
            })
        ).toMatchObject({ message: "오류: 제목을 입력해주세요." });
    });
});
