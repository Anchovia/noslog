import BackLink from "@/components/ui/back-link";
import PageContainer, { PageHeading } from "@/components/layout/page-container";
import AnnouncementEditor, {
    emptyAnnouncementEditorData,
} from "@/features/announcements/components/announcement-editor";
import { SITE_URL } from "@/lib/metadata/site";

export default function NewAnnouncementPage() {
    return (
        <PageContainer width="reading">
            <BackLink href="/admin/announcements">공지사항</BackLink>
            <PageHeading title="새 공지" />
            <AnnouncementEditor
                announcement={emptyAnnouncementEditorData}
                siteUrl={SITE_URL}
            />
        </PageContainer>
    );
}
