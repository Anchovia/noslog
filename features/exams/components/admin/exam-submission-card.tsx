import { ExternalLink } from "lucide-react";
import Image from "next/image";

import type { AdminExamSubmission } from "@/features/exams/types/exam-submission-admin";

import DeleteExamSubmissionButton from "./delete-exam-submission-button";
import ExamSubmissionReviewForm from "./exam-submission-review-form";

export default function ExamSubmissionCard({
    submission,
}: {
    submission: AdminExamSubmission;
}) {
    const proofImagePath = `/api/admin/private-images/exam/${submission.id}`;

    return (
        <article className="overflow-hidden rounded-card bg-surface">
            {submission.hasProofImage ? (
                <a
                    href={proofImagePath}
                    target="_blank"
                    rel="noreferrer"
                    className="relative block aspect-video bg-surface-muted"
                >
                    <Image
                        src={proofImagePath}
                        alt="검정 합격 증빙"
                        fill
                        unoptimized
                        sizes="358px"
                        className="object-contain"
                    />
                    <span className="absolute top-2 right-2 flex size-8 items-center justify-center rounded-md bg-bg/80">
                        <ExternalLink className="size-4" />
                    </span>
                </a>
            ) : (
                <div className="flex aspect-video items-center justify-center bg-surface-muted px-6 text-center text-caption">
                    보관 기간이 지나 증빙 이미지가 삭제되었습니다.
                </div>
            )}
            <div className="flex flex-col gap-3 p-3">
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <p className="truncate text-body font-bold">
                            {submission.userName}
                        </p>
                        <p className="truncate text-caption">
                            {submission.examTitle}
                        </p>
                    </div>
                    <time className="shrink-0 text-caption tabular-nums">
                        {new Date(submission.submittedAt).toLocaleDateString(
                            "ko-KR"
                        )}
                    </time>
                </div>
                {submission.status === "pending" ? (
                    <ExamSubmissionReviewForm
                        submissionId={submission.id}
                        reviewerNote={submission.reviewerNote ?? ""}
                    />
                ) : submission.reviewerNote ? (
                    <p className="rounded-md bg-bg px-3 py-2 text-caption">
                        심사 메모: {submission.reviewerNote}
                    </p>
                ) : null}
                <DeleteExamSubmissionButton
                    submissionId={submission.id}
                    isApproved={submission.status === "approved"}
                />
            </div>
        </article>
    );
}
