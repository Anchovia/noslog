"use client";

import { useRouter } from "next/navigation";

import { deleteTierList } from "@/app/admin/tiers/actions";
import AdminDeleteDialog from "@/components/admin/admin-delete-dialog";
import Button from "@/components/ui/button";
import { createTierIdFormData } from "@/features/tiers/schemas/tier-admin-schema";
import useActionToast from "@/lib/hooks/use-action-toast";

export default function TierListDeleteButton({
    tierListId,
    title,
}: {
    tierListId: number;
    title: string;
}) {
    const router = useRouter();
    const { isPending, run } = useActionToast();

    function handleDelete() {
        run(() => deleteTierList(createTierIdFormData(tierListId)), {
            errorMessage: "서열표를 삭제하지 못했습니다.",
            onSuccess: () => {
                router.replace("/admin/tiers");
                router.refresh();
            },
        });
    }

    return (
        <AdminDeleteDialog
            title="보관 서열표 삭제"
            description={`「${title}」 와 그 안의 구간 · 항목이 모두 지워집니다. 되돌릴 수 없습니다.`}
            confirmText={title}
            actionLabel="보관 서열표 삭제"
            pending={isPending}
            onConfirm={handleDelete}
            trigger={
                <Button variant="danger" className="w-full">
                    보관 서열표 삭제
                </Button>
            }
        />
    );
}
