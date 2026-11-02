"use client";

import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

import { setOpinionReportTargetHidden } from "@/app/admin/feedback/actions";
import { foundationButtonClass } from "@/components/ui/button";
import { createOpinionReportHiddenUpdateFormData } from "@/features/feedback/schemas/opinion-report-admin-schema";
import { cn } from "@/lib/cn";

export default function OpinionReportHideButton({
    reportId,
    hidden,
}: {
    reportId: number;
    hidden: boolean;
}) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    function handleToggle() {
        startTransition(async () => {
            try {
                const result = await setOpinionReportTargetHidden(
                    createOpinionReportHiddenUpdateFormData(reportId, !hidden)
                );
                if (!result.success) {
                    toast.error(result.message);
                    return;
                }
                toast.success(result.message);
                router.refresh();
            } catch {
                toast.error("글 상태를 변경하지 못했습니다.");
            }
        });
    }

    return (
        <button
            type="button"
            disabled={isPending}
            onClick={handleToggle}
            className={cn(
                foundationButtonClass({ variant: "secondary" }),
                "w-full"
            )}
        >
            {hidden ? (
                <Eye className="nl-icon-small" aria-hidden />
            ) : (
                <EyeOff className="nl-icon-small" aria-hidden />
            )}
            {isPending ? "처리 중" : hidden ? "다시 보이기" : "글 가리기"}
        </button>
    );
}
