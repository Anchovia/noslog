"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

import { deleteEvaluation } from "@/app/admin/community/actions";
import { createChartEvaluationAdminDeleteFormData } from "@/features/music/schemas/chartEvaluationAdminSchema";

export default function DeleteChartEvaluationButton({
    evaluationId,
}: {
    evaluationId: number;
}) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    function handleDelete() {
        startTransition(async () => {
            try {
                const result = await deleteEvaluation(
                    createChartEvaluationAdminDeleteFormData(evaluationId)
                );
                if (!result.success) {
                    toast.error(result.message);
                    return;
                }

                toast.success(result.message);
                router.refresh();
            } catch {
                toast.error("평가를 삭제하지 못했습니다.");
            }
        });
    }

    return (
        <button
            type="button"
            disabled={isPending}
            onClick={handleDelete}
            className="border-danger/40 text-danger flex h-9 w-full cursor-pointer items-center justify-center gap-1 rounded-md border text-xs font-bold disabled:cursor-not-allowed disabled:opacity-50"
        >
            <Trash2 className="size-3.5" aria-hidden />
            {isPending ? "삭제 중" : "평가 전체 삭제"}
        </button>
    );
}
