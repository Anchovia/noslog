import { describe, expect, it } from "vitest";

import {
    createExamProofFileSchema,
    createExamProofSubmissionFormData,
    createExamProofSubmissionSchema,
    createExamProofUploadRequestSchema,
    examProofSubmissionInputFromFormData,
    MAX_EXAM_PROOF_IMAGE_SIZE,
} from "@/features/exams/schemas/examProofSchema";
import { createTranslator, getMessages } from "@/lib/i18n/messages";
import type { Locale } from "@/lib/i18n/routing";

function translatorFor(locale: Locale) {
    return createTranslator(getMessages(locale));
}

describe("검정 증빙 스키마", () => {
    it.each([
        ["ko", "JPG, PNG, WebP 이미지만 업로드할 수 있습니다."],
        ["ja", "JPG、PNG、WebP画像のみアップロードできます。"],
        ["en", "Only JPG, PNG, and WebP images can be uploaded."],
    ] as const)("%s 이미지 형식 오류를 현지화한다", (locale, message) => {
        const result = createExamProofFileSchema(
            translatorFor(locale)
        ).safeParse({
            proofFile: new File(["image"], "proof.gif", {
                type: "image/gif",
            }),
        });

        expect(result.success).toBe(false);
        if (result.success) return;
        expect(result.error.flatten().fieldErrors.proofFile).toEqual([message]);
    });

    it("4MB 크기 경계는 허용하고 초과 이미지는 거부한다", () => {
        const schema = createExamProofFileSchema(translatorFor("ko"));
        const atLimit = new File(
            [new Uint8Array(MAX_EXAM_PROOF_IMAGE_SIZE)],
            "proof.jpg",
            { type: "image/jpeg" }
        );
        const overLimit = new File(
            [new Uint8Array(MAX_EXAM_PROOF_IMAGE_SIZE + 1)],
            "proof.jpg",
            { type: "image/jpeg" }
        );

        expect(schema.safeParse({ proofFile: atLimit }).success).toBe(true);

        const result = schema.safeParse({ proofFile: overLimit });
        expect(result.success).toBe(false);
        if (result.success) return;
        expect(result.error.flatten().fieldErrors.proofFile).toEqual([
            "이미지는 4MB 이하로 선택해주세요.",
        ]);
    });

    it("빈 파일 선택을 거부한다", () => {
        const result = createExamProofFileSchema(translatorFor("en")).safeParse(
            { proofFile: null }
        );

        expect(result.success).toBe(false);
        if (result.success) return;
        expect(result.error.flatten().fieldErrors.proofFile).toEqual([
            "Only JPG, PNG, and WebP images can be uploaded.",
        ]);
    });

    it("업로드 요청의 검정 ID를 숫자로 정규화한다", () => {
        expect(
            createExamProofUploadRequestSchema(translatorFor("ko")).parse({
                examId: "30",
                contentType: "image/webp",
            })
        ).toEqual({ examId: 30, contentType: "image/webp" });
    });

    it("제출 값을 검증하고 FormData 변환을 한곳에서 왕복한다", () => {
        const schema = createExamProofSubmissionSchema(translatorFor("ko"));
        const parsed = schema.parse({
            examId: "30",
            proofImageUrl:
                "https://store.private.blob.vercel-storage.com/exam-proofs/2/30/proof.jpg",
        });
        const formData = createExamProofSubmissionFormData(parsed, "ja");

        expect(examProofSubmissionInputFromFormData(formData)).toEqual({
            examId: "30",
            proofImageUrl: parsed.proofImageUrl,
        });
        expect(formData.get("locale")).toBe("ja");
        expect(
            schema.parse(examProofSubmissionInputFromFormData(formData))
        ).toEqual(parsed);
    });

    it("0 이하 검정 ID와 URL이 아닌 증빙 주소를 거부한다", () => {
        const result = createExamProofSubmissionSchema(
            translatorFor("en")
        ).safeParse({
            examId: 0,
            proofImageUrl: "not-a-url",
        });

        expect(result.success).toBe(false);
        if (result.success) return;
        expect(result.error.flatten().fieldErrors).toEqual({
            examId: ["This exam is invalid."],
            proofImageUrl: ["This image URL is not allowed."],
        });
    });
});
