"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

import { approveMusicTranslation } from "@/app/admin/music/actions";
import {
    createMusicTranslationApproveFormData,
    type MusicTranslationLocale,
} from "@/features/music/schemas/musicTranslationAdminSchema";

interface MusicTranslationApproveButtonProps {
    locale: MusicTranslationLocale;
    musicIndex: string;
}

export default function MusicTranslationApproveButton({
    locale,
    musicIndex,
}: MusicTranslationApproveButtonProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    function approve() {
        startTransition(async () => {
            try {
                const result = await approveMusicTranslation(
                    createMusicTranslationApproveFormData(musicIndex, locale)
                );
                if (!result.success) {
                    toast.error(result.message);
                    return;
                }

                toast.success(result.message);
                router.refresh();
            } catch {
                toast.error("악곡 번역을 승인하지 못했습니다.");
            }
        });
    }

    return (
        <button
            type="button"
            disabled={isPending}
            onClick={approve}
            className="border-border hover:bg-surface-muted h-9 shrink-0 cursor-pointer rounded-md border px-2.5 text-xs font-bold disabled:cursor-not-allowed disabled:opacity-50"
        >
            {isPending ? "승인 중" : "승인"}
        </button>
    );
}
