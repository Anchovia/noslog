"use client";

import { ExternalLink } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import {
    AdminReadRow,
    AdminReadRows,
    adminRowOpenProps,
} from "@/components/admin/admin-card";
import AdminDrawer from "@/components/admin/admin-drawer";
import ActionMenu from "@/components/ui/action-menu";
import type { AdminExamSubmission } from "@/features/exams/types/exam-submission-admin";

import DeleteExamSubmissionButton from "./delete-exam-submission-button";
import ExamSubmissionReviewForm from "./exam-submission-review-form";

// 증빙 · 심사(승인 · 반려) · 삭제는 「자세히 보기」 서랍에서
export default function ExamSubmissionRow({
    submission,
}: {
    submission: AdminExamSubmission;
}) {
    const [open, setOpen] = useState(false);
    const proofImagePath = `/api/admin/private-images/exam/${submission.id}`;
    const submittedAt = new Date(submission.submittedAt).toLocaleDateString(
        "ko-KR"
    );

    return (
        <tr {...adminRowOpenProps(() => setOpen(true))}>
            <td>{submission.userName}</td>
            <td>{submission.examTitle}</td>
            <td>{submittedAt}</td>
            {submission.status === "pending" ? null : (
                <td>{submission.reviewerNote}</td>
            )}
            <td className="nl-admin-table__menu">
                <ActionMenu
                    label="인증 메뉴"
                    items={[
                        { label: "자세히 보기", onSelect: () => setOpen(true) },
                    ]}
                />
                <AdminDrawer open={open} onOpenChange={setOpen} title="인증">
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
                                sizes="512px"
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
                    <AdminReadRows>
                        <AdminReadRow label="유저">
                            {submission.userName}
                        </AdminReadRow>
                        <AdminReadRow label="검정">
                            {submission.examTitle}
                        </AdminReadRow>
                        <AdminReadRow label="제출한 날">
                            {submittedAt}
                        </AdminReadRow>
                        {submission.status !== "pending" &&
                        submission.reviewerNote ? (
                            <AdminReadRow label="심사 메모">
                                {submission.reviewerNote}
                            </AdminReadRow>
                        ) : null}
                    </AdminReadRows>
                    {submission.status === "pending" ? (
                        <ExamSubmissionReviewForm
                            submissionId={submission.id}
                            reviewerNote={submission.reviewerNote ?? ""}
                        />
                    ) : null}
                    <DeleteExamSubmissionButton
                        submissionId={submission.id}
                        isApproved={submission.status === "approved"}
                        userName={submission.userName}
                    />
                </AdminDrawer>
            </td>
        </tr>
    );
}
