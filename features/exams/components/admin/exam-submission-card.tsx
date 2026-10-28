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
        <article className="overflow-hidden rounded-nl-control bg-nl-surface">
            {submission.hasProofImage ? (
                <a
                    href={proofImagePath}
                    target="_blank"
                    rel="noreferrer"
                    className="relative block aspect-video bg-nl-control"
                >
                    <Image
                        src={proofImagePath}
                        alt="검정 합격 증빙"
                        fill
                        unoptimized
                        sizes="358px"
                        className="object-contain"
                    />
                    <span className="absolute top-nl-8 right-nl-8 flex size-nl-32 items-center justify-center rounded-nl-control bg-nl-surface">
                        <ExternalLink className="nl-icon-small" />
                    </span>
                </a>
            ) : (
                <div className="nl-metadata flex aspect-video items-center justify-center bg-nl-control px-nl-24 text-center text-nl-subdued">
                    보관 기간이 지나 증빙 이미지가 삭제되었습니다.
                </div>
            )}
            <div className="flex flex-col gap-nl-12 p-nl-12">
                <div className="flex items-start justify-between gap-nl-12">
                    <div className="min-w-0">
                        <p className="nl-emphasis-label truncate text-nl-content">
                            {submission.userName}
                        </p>
                        <p className="nl-metadata truncate text-nl-subdued">
                            {submission.examTitle}
                        </p>
                    </div>
                    <time className="nl-metadata shrink-0 text-nl-subdued">
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
                    <p className="nl-metadata rounded-nl-control bg-nl-canvas px-nl-12 py-nl-8 text-nl-subdued">
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
