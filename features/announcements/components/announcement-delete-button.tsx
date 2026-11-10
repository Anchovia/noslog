"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { deleteAnnouncement } from "@/app/admin/announcements/actions";
import ActionButton from "@/components/ui/action-button";
import ModalDialog from "@/components/ui/modal-dialog";
import { createAnnouncementDeleteFormData } from "@/features/announcements/schemas/announcement-schema";
import useActionToast from "@/lib/hooks/use-action-toast";

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
    const { isPending, run } = useActionToast();

    function handleDelete() {
        run(() => deleteAnnouncement(createAnnouncementDeleteFormData(id)), {
            errorMessage: "공지사항을 삭제하지 못했습니다.",
            onSuccess: () => {
                setOpen(false);
                router.replace("/admin/announcements");
                router.refresh();
            },
        });
    }

    return (
        <ModalDialog
            variant="confirm"
            open={open}
            onOpenChange={(next) => {
                if (!isPending) setOpen(next);
            }}
            title="공지 삭제"
            description={`「${title}」 공지와 번역을 모두 삭제합니다. 되돌릴 수 없습니다.`}
            trigger={
                <ActionButton type="button" variant="secondary">
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
