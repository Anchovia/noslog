import type { ExamSubmissionStatus } from "@/features/exams/schemas/exam-submission-admin-schema";

export interface AdminExamSubmission {
    examTitle: string;
    hasProofImage: boolean;
    id: number;
    reviewerNote: string | null;
    status: ExamSubmissionStatus;
    submittedAt: string;
    userName: string;
}
