import type { ExamSubmissionStatus } from "@/features/exams/schemas/examSubmissionAdminSchema";

export interface AdminExamSubmission {
    examTitle: string;
    hasProofImage: boolean;
    id: number;
    reviewerNote: string | null;
    status: ExamSubmissionStatus;
    submittedAt: string;
    userName: string;
}
