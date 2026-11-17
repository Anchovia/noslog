"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { deleteExamSubmission } from "@/app/admin/submissions/actions";
import AdminDeleteDialog from "@/components/admin/admin-delete-dialog";
import Button from "@/components/ui/button";
import { createExamSubmissionDeleteFormData } from "@/features/exams/schemas/exam-submission-admin-schema";
import useActionToast from "@/lib/hooks/use-action-toast";

interface DeleteExamSubmissionButtonProps {
    isApproved: boolean;
    submissionId: number;
    userName: string;
}

export default function DeleteExamSubmissionButton({
    isApproved,
    submissionId,
    userName,
}: DeleteExamSubmissionButtonProps) {
    const router = useRouter();
    const { isPending, run } = useActionToast();

    function handleDelete() {
        run(
            () =>
                deleteExamSubmission(
                    createExamSubmissionDeleteFormData(submissionId)
                ),
            {
                errorMessage: "검정 인증을 삭제하지 못했습니다.",
                onSuccess: () => {
                    router.refresh();
                },
            }
        );
    }

    const label = isApproved ? "합격 이력 및 제출 삭제" : "제출 기록 삭제";
    return (
        <AdminDeleteDialog
            title={label}
            description={
                isApproved
                    ? `${userName} 님의 제출과 합격 이력이 함께 지워집니다. 되돌릴 수 없습니다.`
                    : `${userName} 님의 제출이 지워집니다. 되돌릴 수 없습니다.`
            }
            confirmText={userName}
            actionLabel={label}
            pending={isPending}
            onConfirm={handleDelete}
            trigger={
                <Button variant="danger" className="w-full">
                    <Trash2 className="nl-icon-small" aria-hidden />
                    {label}
                </Button>
            }
        />
    );
}
