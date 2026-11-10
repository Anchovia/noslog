"use client";

import { useRouter } from "next/navigation";

import { approveMusicTranslation } from "@/app/admin/music/actions";
import { foundationButtonClass } from "@/components/ui/button";
import {
    createMusicTranslationApproveFormData,
    type MusicTranslationLocale,
} from "@/features/music/schemas/music-translation-admin-schema";
import { cn } from "@/lib/cn";
import useActionToast from "@/lib/hooks/use-action-toast";

interface MusicTranslationApproveButtonProps {
    locale: MusicTranslationLocale;
    musicIndex: string;
    /** 승인 뒤 — 목록이 클라이언트에서 불러온 쪽을 다시 받게(2026-09-25 무한 스크롤) */
    onApproved?: () => void;
}

export default function MusicTranslationApproveButton({
    locale,
    musicIndex,
    onApproved,
}: MusicTranslationApproveButtonProps) {
    const router = useRouter();
    const { isPending, run } = useActionToast();

    function approve() {
        run(
            () =>
                approveMusicTranslation(
                    createMusicTranslationApproveFormData(musicIndex, locale)
                ),
            {
                errorMessage: "악곡 번역을 승인하지 못했습니다.",
                onSuccess: () => {
                    onApproved?.();
                    router.refresh();
                },
            }
        );
    }

    return (
        <button
            type="button"
            disabled={isPending}
            onClick={approve}
            className={cn(
                foundationButtonClass({ variant: "secondary", size: "sm" }),
                "shrink-0"
            )}
        >
            {isPending ? "승인 중" : "승인"}
        </button>
    );
}
