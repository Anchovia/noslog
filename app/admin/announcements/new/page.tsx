import { ChevronLeft } from "lucide-react";
import Link from "next/link";

import PageContainer, { PageHeading } from "@/components/layout/pageContainer";
import AnnouncementEditor, {
    emptyAnnouncementEditorData,
} from "@/features/announcements/components/announcementEditor";

export default function NewAnnouncementPage() {
    return (
        <PageContainer width="reading">
            <Link
                href="/admin/announcements"
                className="nl-announcements__back nl-control"
            >
                <ChevronLeft aria-hidden />
                공지사항
            </Link>
            <PageHeading title="새 공지" />
            <AnnouncementEditor announcement={emptyAnnouncementEditorData} />
        </PageContainer>
    );
}
