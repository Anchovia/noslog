"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { deleteAnnouncement } from "@/app/admin/announcements/actions";
import { createAnnouncementDeleteFormData } from "@/features/announcements/schemas/announcementSchema";
import ActionButton from "@/components/ui/actionButton";
import ModalDialog from "@/components/ui/modalDialog";

// 삭제는 되돌릴 수 없으므로 확인 다이얼로그를 거친 뒤 목록으로 돌아감
export default function AnnouncementDeleteButton({
    id,
    title,
}: {
    id: number;
    title: string;
}) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
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
                setOpen(false);
                router.replace("/admin/announcements");
                router.refresh();
            } catch {
                toast.error("공지사항을 삭제하지 못했습니다.");
            }
        });
    }

    return (
        <ModalDialog
            open={open}
            onOpenChange={(next) => {
                if (!isPending) setOpen(next);
            }}
            title="공지 삭제"
            description={`「${title}」 공지와 번역을 모두 삭제합니다. 되돌릴 수 없습니다.`}
            trigger={
                <ActionButton type="button" variant="danger">
                    삭제
                </ActionButton>
            }
            footer={
                <>
                    <ActionButton
                        type="button"
                        variant="secondary"
                        disabled={isPending}
                        onClick={() => setOpen(false)}
                    >
                        취소
                    </ActionButton>
                    <ActionButton
                        type="button"
                        variant="danger"
                        destructiveFilled
                        busy={isPending}
                        busyLabel="삭제 중"
                        onClick={handleDelete}
                    >
                        삭제
                    </ActionButton>
                </>
            }
        />
    );
}
