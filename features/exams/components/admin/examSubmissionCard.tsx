import { ExternalLink } from "lucide-react";
import Image from "next/image";

import type { AdminExamSubmission } from "@/features/exams/types/examSubmissionAdmin";

import DeleteExamSubmissionButton from "./deleteExamSubmissionButton";
import ExamSubmissionReviewForm from "./examSubmissionReviewForm";

export default function ExamSubmissionCard({
    submission,
}: {
    submission: AdminExamSubmission;
}) {
    const proofImagePath = `/api/admin/private-images/exam/${submission.id}`;

    return (
        <article className="bg-surface rounded-card overflow-hidden">
            {submission.hasProofImage ? (
                <a
                    href={proofImagePath}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-surface-muted relative block aspect-video"
                >
                    <Image
                        src={proofImagePath}
                        alt="검정 합격 증빙"
                        fill
                        unoptimized
                        sizes="358px"
                        className="object-contain"
                    />
                    <span className="bg-bg/80 absolute top-2 right-2 flex size-8 items-center justify-center rounded-md">
                        <ExternalLink className="size-4" />
                    </span>
                </a>
            ) : (
                <div className="bg-surface-muted text-caption flex aspect-video items-center justify-center px-6 text-center">
                    보관 기간이 지나 증빙 이미지가 삭제되었습니다.
                </div>
            )}
            <div className="flex flex-col gap-3 p-3">
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <p className="text-body truncate font-bold">
                            {submission.userName}
                        </p>
                        <p className="text-caption truncate">
                            {submission.examTitle}
                        </p>
                    </div>
                    <time className="text-caption shrink-0 tabular-nums">
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
                    <p className="text-caption bg-bg rounded-md px-3 py-2">
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
