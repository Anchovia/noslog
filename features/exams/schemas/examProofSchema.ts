import { z } from "zod";

import type { createTranslator } from "@/lib/i18n/messages";
import type { Locale } from "@/lib/i18n/routing";

type Translator = ReturnType<typeof createTranslator>;

export const EXAM_PROOF_CONTENT_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
] as const;
export const MAX_EXAM_PROOF_IMAGE_SIZE = 4 * 1024 * 1024;

function examIdSchema(t: Translator) {
    return z.coerce
        .number({ error: t("exams.error.invalid") })
        .int(t("exams.error.invalid"))
        .positive(t("exams.error.invalid"));
}

export function createExamProofFileSchema(t: Translator) {
    const proofFileSchema = z
        .file({ error: t("exams.proof.invalidImage") })
        .mime([...EXAM_PROOF_CONTENT_TYPES], t("exams.proof.invalidImage"))
        .max(MAX_EXAM_PROOF_IMAGE_SIZE, t("exams.proof.imageTooLarge"));

    return z.object({
        proofFile: z.preprocess((value) => value ?? undefined, proofFileSchema),
    });
}

export function createExamProofUploadRequestSchema(t: Translator) {
    return z.object({
        examId: examIdSchema(t),
        contentType: z.enum(EXAM_PROOF_CONTENT_TYPES, {
            error: t("exams.proof.invalidImage"),
        }),
    });
}

export function createExamProofSubmissionSchema(t: Translator) {
    return z.object({
        examId: examIdSchema(t),
        proofImageUrl: z.url({ error: t("exams.error.invalidUrl") }),
    });
}

export type ExamProofFileSchema = ReturnType<typeof createExamProofFileSchema>;
export type ExamProofFileFormValues = z.input<ExamProofFileSchema>;
export type ExamProofFileValues = z.output<ExamProofFileSchema>;

export type ExamProofSubmissionSchema = ReturnType<
    typeof createExamProofSubmissionSchema
>;
export type ExamProofSubmissionFormValues = z.input<ExamProofSubmissionSchema>;
export type ExamProofSubmissionValues = z.output<ExamProofSubmissionSchema>;

export function examProofSubmissionInputFromFormData(formData: FormData) {
    return {
        examId: formData.get("examId"),
        proofImageUrl: String(formData.get("proofImageUrl") ?? ""),
    };
}

export function createExamProofSubmissionFormData(
    values: ExamProofSubmissionValues,
    locale: Locale
) {
    const formData = new FormData();
    formData.set("examId", String(values.examId));
    formData.set("proofImageUrl", values.proofImageUrl);
    formData.set("locale", locale);

    return formData;
}
