"use client";

import { useRouter } from "next/navigation";

import { deleteAnnouncement } from "@/app/admin/announcements/actions";
import AdminDeleteDialog from "@/components/admin/admin-delete-dialog";
import ActionButton from "@/components/ui/action-button";
import { createAnnouncementDeleteFormData } from "@/features/announcements/schemas/announcement-schema";
import useActionToast from "@/lib/hooks/use-action-toast";

// 삭제는 되돌릴 수 없으므로 제목을 입력해 확인한 뒤 목록으로 돌아감
export default function AnnouncementDeleteButton({
    id,
    title,
}: {
    id: number;
    title: string;
}) {
    const router = useRouter();
    const { isPending, run } = useActionToast();

    function handleDelete() {
        run(() => deleteAnnouncement(createAnnouncementDeleteFormData(id)), {
            errorMessage: "공지사항을 삭제하지 못했습니다.",
            onSuccess: () => {
                router.replace("/admin/announcements");
                router.refresh();
            },
        });
    }

    return (
        <AdminDeleteDialog
            title="공지 삭제"
            description={`「${title}」 공지와 번역 · 투표가 모두 지워집니다. 되돌릴 수 없습니다.`}
            confirmText={title}
            actionLabel="공지 삭제"
            pending={isPending}
            onConfirm={handleDelete}
            trigger={
                <ActionButton type="button" variant="secondary">
                    삭제
                </ActionButton>
            }
        />
    );
}
