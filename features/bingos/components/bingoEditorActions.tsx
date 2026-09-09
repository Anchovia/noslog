"use client";

import { Save, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

import { deleteBingo } from "@/app/admin/bingos/actions";
import { createBingoDeleteFormData } from "@/features/bingos/schemas/bingoEditorSchema";

export function SaveBingoButton({ isSubmitting }: { isSubmitting: boolean }) {
    return (
        <button
            type="submit"
            disabled={isSubmitting}
            className="bg-text-primary text-bg sticky bottom-3 z-10 flex h-11 cursor-pointer items-center justify-center gap-2 rounded-md text-sm font-bold shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
        >
            <Save className="size-4" aria-hidden />
            {isSubmitting ? "저장 중" : "빙고 저장"}
        </button>
    );
}

export function DeleteBingoButton({ bingoId }: { bingoId: number }) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    function handleDelete() {
        startTransition(async () => {
            try {
                const result = await deleteBingo(
                    createBingoDeleteFormData(bingoId)
                );
                if (!result.success) {
                    toast.error(result.message);
                    return;
                }

                toast.success(result.message);
                router.replace("/admin/bingos");
                router.refresh();
            } catch {
                toast.error("빙고를 삭제하지 못했습니다.");
            }
        });
    }

    return (
        <button
            type="button"
            disabled={isPending}
            onClick={handleDelete}
            className="border-danger/50 text-danger flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-md border text-sm font-bold disabled:cursor-not-allowed disabled:opacity-50"
        >
            <Trash2 className="size-4" aria-hidden />
            {isPending ? "삭제 중" : "진행 기록이 없을 때 삭제"}
        </button>
    );
}
