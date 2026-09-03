"use client";

import { Check, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

import { reviewMusicCatalogCandidate } from "@/app/admin/catalog/actions";
import {
    createMusicCatalogReviewFormData,
    type MusicCatalogDecision,
} from "@/features/music/schemas/musicCatalogAdminSchema";

export default function MusicCatalogReviewActions({
    candidateId,
}: {
    candidateId: number;
}) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    function review(decision: MusicCatalogDecision) {
        startTransition(async () => {
            try {
                const result = await reviewMusicCatalogCandidate(
                    createMusicCatalogReviewFormData(candidateId, decision)
                );
                if (!result.success) {
                    toast.error(result.message);
                    return;
                }

                toast.success(result.message);
                router.refresh();
            } catch {
                toast.error("악곡 업데이트를 처리하지 못했습니다.");
            }
        });
    }

    return (
        <div className="grid grid-cols-2 gap-2">
            <button
                type="button"
                disabled={isPending}
                onClick={() => review("reject")}
                className="border-border text-text-secondary hover:bg-surface-muted flex h-10 cursor-pointer items-center justify-center gap-2 rounded-md border text-sm font-bold disabled:cursor-not-allowed disabled:opacity-50"
            >
                <X className="size-4" aria-hidden />
                {isPending ? "처리 중" : "반려"}
            </button>
            <button
                type="button"
                disabled={isPending}
                onClick={() => review("approve")}
                className="bg-text-primary text-bg flex h-10 cursor-pointer items-center justify-center gap-2 rounded-md text-sm font-bold disabled:cursor-not-allowed disabled:opacity-50"
            >
                <Check className="size-4" aria-hidden />
                {isPending ? "처리 중" : "반영"}
            </button>
        </div>
    );
}
