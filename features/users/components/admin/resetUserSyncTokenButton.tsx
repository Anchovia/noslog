"use client";

import { KeyRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

import { resetUserSyncToken } from "@/app/admin/users/actions";
import { createUserSyncTokenResetFormData } from "@/features/users/schemas/userAdminSchema";

interface ResetUserSyncTokenButtonProps {
    syncTokenVersion: number;
    userId: number;
}

export default function ResetUserSyncTokenButton({
    syncTokenVersion,
    userId,
}: ResetUserSyncTokenButtonProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    function handleReset() {
        startTransition(async () => {
            try {
                const result = await resetUserSyncToken(
                    createUserSyncTokenResetFormData(userId)
                );
                if (!result.success) {
                    toast.error(result.message);
                    return;
                }

                toast.success(result.message);
                router.refresh();
            } catch {
                toast.error("연동 토큰을 초기화하지 못했습니다.");
            }
        });
    }

    return (
        <button
            type="button"
            disabled={isPending}
            onClick={handleReset}
            className="border-border flex h-9 w-full cursor-pointer items-center justify-center gap-1 rounded-md border text-xs font-bold disabled:cursor-not-allowed disabled:opacity-50"
        >
            <KeyRound className="size-3.5" aria-hidden />
            {isPending ? "초기화 중" : `연동 토큰 초기화 (${syncTokenVersion})`}
        </button>
    );
}
