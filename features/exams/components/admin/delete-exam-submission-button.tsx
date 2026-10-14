"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

import { deleteExamSubmission } from "@/app/admin/submissions/actions";
import Button from "@/components/ui/button";
import { createExamSubmissionDeleteFormData } from "@/features/exams/schemas/exam-submission-admin-schema";

interface DeleteExamSubmissionButtonProps {
    isApproved: boolean;
    submissionId: number;
}

export default function DeleteExamSubmissionButton({
    isApproved,
    submissionId,
}: DeleteExamSubmissionButtonProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    function handleDelete() {
        startTransition(async () => {
            try {
                const result = await deleteExamSubmission(
                    createExamSubmissionDeleteFormData(submissionId)
                );
                if (!result.success) {
                    toast.error(result.message);
                    return;
                }

                toast.success(result.message);
                router.refresh();
            } catch {
                toast.error("검정 인증을 삭제하지 못했습니다.");
            }
        });
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
