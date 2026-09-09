"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

import { deleteTierList } from "@/app/admin/tiers/actions";
import { createTierIdFormData } from "@/features/tiers/schemas/tierAdminSchema";

export default function TierListDeleteButton({
    tierListId,
}: {
    tierListId: number;
}) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    function handleDelete() {
        startTransition(async () => {
            try {
                const result = await deleteTierList(
                    createTierIdFormData(tierListId)
                );
                if (!result.success) {
                    toast.error(result.message);
                    return;
                }

                toast.success(result.message);
                router.replace("/admin/tiers");
                router.refresh();
            } catch {
                toast.error("서열표를 삭제하지 못했습니다.");
            }
        });
    }

    return (
        <button
            type="button"
            disabled={isPending}
            onClick={handleDelete}
            className="border-danger/60 text-danger hover:bg-danger/10 h-10 w-full cursor-pointer rounded-md border text-sm font-bold disabled:cursor-not-allowed disabled:opacity-50"
        >
            {isPending ? "삭제 중..." : "보관 서열표 삭제"}
        </button>
    );
}
