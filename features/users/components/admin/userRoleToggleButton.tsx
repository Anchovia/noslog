"use client";

import { ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

import { updateUserRole } from "@/app/admin/users/actions";
import { createUserRoleUpdateFormData } from "@/features/users/schemas/userAdminSchema";

interface UserRoleToggleButtonProps {
    isAdmin: boolean;
    userId: number;
    userLabel: string;
}

export default function UserRoleToggleButton({
    isAdmin,
    userId,
    userLabel,
}: UserRoleToggleButtonProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const role = isAdmin ? "user" : "admin";
    const actionLabel = isAdmin ? "권한 해제" : "관리자 지정";

    function handleRoleUpdate() {
        const message = isAdmin
            ? `${userLabel}님의 관리자 권한을 해제하시겠습니까?`
            : `${userLabel}님에게 관리자 권한을 부여하시겠습니까?`;
        if (!window.confirm(message)) return;

        startTransition(async () => {
            try {
                const result = await updateUserRole(
                    createUserRoleUpdateFormData(userId, role)
                );
                if (!result.success) {
                    toast.error(result.message);
                    return;
                }

                toast.success(result.message);
                router.refresh();
            } catch {
                toast.error("사용자 권한을 변경하지 못했습니다.");
            }
        });
    }

    return (
        <button
            type="button"
            disabled={isPending}
            onClick={handleRoleUpdate}
            className="border-border flex h-9 w-full cursor-pointer items-center justify-center gap-1 rounded-md border text-xs font-bold disabled:cursor-not-allowed disabled:opacity-50"
        >
            <ShieldCheck className="size-3.5" aria-hidden />
            {isPending ? "처리 중" : actionLabel}
        </button>
    );
}
