"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

import { deleteEvaluation } from "@/app/admin/community/actions";
import Button from "@/components/ui/button";
import { createChartEvaluationAdminDeleteFormData } from "@/features/music/schemas/chart-evaluation-admin-schema";

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
        <Button
            variant="danger"
            size="sm"
            className="w-full"
            disabled={isPending}
            onClick={handleDelete}
        >
            <Trash2 className="nl-icon-small" aria-hidden />
            {isPending ? "삭제 중" : "평가 전체 삭제"}
        </Button>
    );
}
