"use client";

import { Save, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { deleteBingo } from "@/app/admin/bingos/actions";
import AdminDeleteDialog from "@/components/admin/admin-delete-dialog";
import Button, { foundationButtonClass } from "@/components/ui/button";
import { createBingoDeleteFormData } from "@/features/bingos/schemas/bingo-editor-schema";
import { cn } from "@/lib/cn";
import useActionToast from "@/lib/hooks/use-action-toast";

export function SaveBingoButton({ isSubmitting }: { isSubmitting: boolean }) {
    return (
        <button
            type="submit"
            disabled={isSubmitting}
            className={cn(
                foundationButtonClass(),
                "sticky bottom-nl-12 z-nl-sticky"
            )}
        >
            <Save className="nl-icon-small" aria-hidden />
            {isSubmitting ? "저장 중" : "빙고 저장"}
        </button>
    );
}

export function DeleteBingoButton({
    bingoId,
    title,
}: {
    bingoId: number;
    title: string;
}) {
    const router = useRouter();
    const { isPending, run } = useActionToast();

    function handleDelete() {
        run(() => deleteBingo(createBingoDeleteFormData(bingoId)), {
            errorMessage: "빙고를 삭제하지 못했습니다.",
            onSuccess: () => {
                router.replace("/admin/bingos");
                router.refresh();
            },
        });
    }

    return (
        <AdminDeleteDialog
            title="빙고 삭제"
            description={`「${title}」 빙고와 칸 · 칸 진행이 모두 지워집니다. 되돌릴 수 없습니다.`}
            confirmText={title}
            actionLabel="빙고 삭제"
            pending={isPending}
            onConfirm={handleDelete}
            trigger={
                <Button variant="danger" className="w-full">
                    <Trash2 className="nl-icon-small" aria-hidden />
                    진행 기록이 없을 때 삭제
                </Button>
            }
        />
    );
}
