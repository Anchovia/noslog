"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

import { deleteAnnouncement } from "@/app/admin/announcements/actions";
import { createAnnouncementDeleteFormData } from "@/features/announcements/schemas/announcementSchema";

export default function AnnouncementDeleteButton({ id }: { id: number }) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    function handleDelete() {
        startTransition(async () => {
            try {
                const result = await deleteAnnouncement(
                    createAnnouncementDeleteFormData(id)
                );
                if (!result.success) {
                    toast.error(result.message);
                    return;
                }

                toast.success(result.message);
                router.refresh();
            } catch {
                toast.error("공지사항을 삭제하지 못했습니다.");
            }
        });
    }

    return (
        <div className="border-divider mt-3 border-t pt-3">
            <button
                type="button"
                disabled={isPending}
                onClick={handleDelete}
                className="border-danger/40 text-danger hover:bg-danger/10 flex h-9 w-full cursor-pointer items-center justify-center gap-1.5 rounded-md border text-sm font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-50"
            >
                <Trash2 className="size-4" aria-hidden />
                {isPending ? "삭제 중" : "삭제"}
            </button>
        </div>
    );
}
