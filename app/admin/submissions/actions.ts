"use server";

import {
    deleteExamSubmission as deleteExamSubmissionService,
    reviewExamSubmission as reviewExamSubmissionService,
} from "@/features/exams/server/exam-submission-admin-service";

export async function reviewExamSubmission(formData: FormData) {
    return reviewExamSubmissionService(formData);
}

export async function deleteExamSubmission(formData: FormData) {
    return deleteExamSubmissionService(formData);
}
