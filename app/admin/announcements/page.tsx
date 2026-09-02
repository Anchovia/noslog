import AnnouncementDeleteButton from "@/features/announcements/components/announcementDeleteButton";
import AnnouncementForm from "@/features/announcements/components/announcementForm";
import db from "@/lib/db";

export default async function AdminAnnouncementsPage() {
    const announcements = await db.announcement.findMany({
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        take: 100,
    });

    return (
        <div className="flex flex-col gap-4 px-4 py-5">
            <section>
                <h1 className="text-title">공지사항 관리</h1>
                <p className="text-caption mt-1">
                    홈에 노출할 서비스 공지를 관리합니다.
                </p>
            </section>

            <AnnouncementForm mode="create" />

            <section className="flex flex-col gap-3">
                {announcements.map((announcement) => (
                    <article
                        key={announcement.id}
                        className="bg-surface rounded-card p-3"
                    >
                        <AnnouncementForm
                            mode="update"
                            announcement={{
                                id: announcement.id,
                                title: announcement.title,
                                content: announcement.content,
                                isPublished: announcement.isPublished,
                            }}
                        />
                        <AnnouncementDeleteButton id={announcement.id} />
                    </article>
                ))}
                {announcements.length === 0 ? (
                    <p className="bg-surface text-body-muted rounded-card py-12 text-center">
                        등록된 공지사항이 없습니다.
                    </p>
                ) : null}
            </section>
        </div>
    );
}
