"use client";

import { ShieldCheck } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";

import { updateUserRole } from "@/app/admin/users/actions";
import { foundationButtonClass } from "@/components/ui/button";
import { createUserRoleUpdateFormData } from "@/features/users/schemas/user-admin-schema";
import { cn } from "@/lib/cn";

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

                // 액션의 revalidatePath 가 같은 응답에 목록을 다시 그려 보낸다 — router.refresh 를 또 부르면 목록 조회가 두 번(2026-10-15 HOME-19)
                toast.success(result.message);
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
            className={cn(
                foundationButtonClass({ variant: "secondary", size: "sm" }),
                "w-full"
            )}
        >
            <ShieldCheck className="nl-icon-small" aria-hidden />
            {isPending ? "처리 중" : actionLabel}
        </button>
    );
}
