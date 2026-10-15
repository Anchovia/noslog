"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

import { deleteTierList } from "@/app/admin/tiers/actions";
import Button from "@/components/ui/button";
import { createTierIdFormData } from "@/features/tiers/schemas/tier-admin-schema";

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
        <Button
            variant="danger"
            className="w-full"
            disabled={isPending}
            onClick={handleDelete}
        >
            {isPending ? "삭제 중..." : "보관 서열표 삭제"}
        </Button>
    );
}
