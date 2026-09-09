"use server";

import {
    requestExamProofUpload as requestExamProofUploadService,
    submitExamProof as submitExamProofService,
    discardExamProofUpload as discardExamProofUploadService,
} from "@/features/exams/server/examProofService";
import type { Locale } from "@/lib/i18n/routing";

export async function requestExamProofUpload(
    examId: number,
    contentType: string,
    requestedLocale?: Locale
) {
    return requestExamProofUploadService(examId, contentType, requestedLocale);
}

export async function submitExamProof(formData: FormData) {
    return submitExamProofService(formData);
}

export async function discardExamProofUpload(
    examId: number,
    proofImageUrl: string
) {
    return discardExamProofUploadService(examId, proofImageUrl);
}
