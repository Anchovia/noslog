"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

import { deleteExamSubmission } from "@/app/admin/submissions/actions";
import { createExamSubmissionDeleteFormData } from "@/features/exams/schemas/examSubmissionAdminSchema";

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
        <button
            type="button"
            disabled={isPending}
            onClick={handleDelete}
            className="border-danger/40 text-danger flex h-10 w-full cursor-pointer items-center justify-center gap-1 rounded-md border text-sm font-bold disabled:cursor-not-allowed disabled:opacity-50"
        >
            <Trash2 className="size-4" />
            {isApproved ? "합격 이력 및 제출 삭제" : "제출 기록 삭제"}
        </button>
    );
}
