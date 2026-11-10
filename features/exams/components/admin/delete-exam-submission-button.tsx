"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { deleteExamSubmission } from "@/app/admin/submissions/actions";
import Button from "@/components/ui/button";
import { createExamSubmissionDeleteFormData } from "@/features/exams/schemas/exam-submission-admin-schema";
import useActionToast from "@/lib/hooks/use-action-toast";

interface DeleteExamSubmissionButtonProps {
    isApproved: boolean;
    submissionId: number;
}

export default function DeleteExamSubmissionButton({
    isApproved,
    submissionId,
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

    return (
        <Button
            variant="danger"
            className="w-full"
            disabled={isPending}
            onClick={handleDelete}
        >
            <Trash2 className="nl-icon-small" aria-hidden />
            {isApproved ? "합격 이력 및 제출 삭제" : "제출 기록 삭제"}
        </Button>
    );
}
