import { ChevronRight, Plus } from "lucide-react";
import Link from "next/link";

import PageContainer, { PageHeading } from "@/components/layout/pageContainer";
import { foundationButtonClass } from "@/components/ui/Button";
import {
    ANNOUNCEMENT_LOCALES,
    ANNOUNCEMENT_PLACEMENT_LABELS,
} from "@/features/announcements/schemas/announcementSchema";
import {
    eligibleAnnouncements,
    selectHomeAnnouncements,
} from "@/features/announcements/schemas/publicAnnouncementSchema";
import db from "@/lib/db";
import { cn } from "@/lib/utils";

const dateFormat = new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "medium",
    timeStyle: "short",
});

function Chip({
    tone,
    children,
}: {
    tone?: "live" | "warning" | "danger";
    children: React.ReactNode;
}) {
    return (
        <span
            className={cn(
                "nl-admin-chip nl-metadata",
                tone && `nl-admin-chip--${tone}`
            )}
        >
            {children}
        </span>
    );
}

export default async function AdminAnnouncementsPage() {
    const now = new Date();
    const announcements = await db.announcement.findMany({
        orderBy: [
            { publishedAt: "desc" },
            { createdAt: "desc" },
            { id: "desc" },
        ],
        take: 100,
        include: {
            translations: {
                select: {
                    locale: true,
                    title: true,
                    content: true,
                    modifiedAt: true,
                },
            },
        },
    });
    // 공개 화면과 같은 판정으로 "실제로 보이는가" 를 계산함
    const visible = eligibleAnnouncements(announcements, now);
    const home = selectHomeAnnouncements(visible, now);
    const visibleIds = new Set(visible.map((item) => item.id));
    const homeIds = new Set(
        [...home.routine, home.critical]
            .filter((item) => item !== null)
            .map((item) => item.id)
    );

    return (
        <PageContainer>
            <PageHeading
                title="공지사항"
                description="홈과 공지 목록에 노출할 서비스 공지를 관리합니다."
                action={
                    <Link
                        href="/admin/announcements/new"
                        className={foundationButtonClass()}
                    >
                        <Plus className="nl-icon-small" aria-hidden />새 공지
                    </Link>
                }
            />

            {announcements.length === 0 ? (
                <p className="nl-admin-empty nl-body nl-muted">
                    등록된 공지사항이 없습니다.
                </p>
            ) : (
                <ul className="nl-admin-list">
                    {announcements.map((announcement) => {
                        const ko = announcement.translations.find(
                            (item) => item.locale === "ko"
                        );
                        const missing = ANNOUNCEMENT_LOCALES.filter(
                            (locale) =>
                                !announcement.translations.some(
                                    (item) =>
                                        item.locale === locale &&
                                        item.title.trim() &&
                                        item.content.trim()
                                )
                        );
                        const isVisible = visibleIds.has(announcement.id);
                        const onHome = homeIds.has(announcement.id);
                        const blocked = announcement.isPublished && !isVisible;
                        return (
                            <li key={announcement.id}>
                                <Link
                                    href={`/admin/announcements/${announcement.id}`}
                                    className="nl-admin-row"
                                >
                                    <div className="nl-admin-row__body">
                                        <span className="nl-admin-row__title nl-entity-title">
                                            {ko?.title || announcement.title}
                                        </span>
                                        <div className="nl-admin-row__meta nl-metadata">
                                            {announcement.isPublished ? (
                                                <Chip tone="live">공개</Chip>
                                            ) : (
                                                <Chip>비공개</Chip>
                                            )}
                                            {onHome ? (
                                                <Chip tone="live">홈 노출</Chip>
                                            ) : null}
                                            {announcement.placement ===
                                            "SERVICE_CRITICAL" ? (
                                                <Chip tone="warning">
                                                    {
                                                        ANNOUNCEMENT_PLACEMENT_LABELS.SERVICE_CRITICAL
                                                    }
                                                </Chip>
                                            ) : null}
                                            {missing.length > 0 ? (
                                                <Chip tone="danger">
                                                    번역 없음 ·{" "}
                                                    {missing.join(" / ")}
                                                </Chip>
                                            ) : null}
                                            {blocked && missing.length === 0 ? (
                                                <Chip tone="danger">
                                                    {announcement.publicSlug
                                                        ? "노출 조건 미충족"
                                                        : "공개 주소 없음"}
                                                </Chip>
                                            ) : null}
                                            <span>
                                                {announcement.publishedAt
                                                    ? `공개 ${dateFormat.format(announcement.publishedAt)}`
                                                    : `작성 ${dateFormat.format(announcement.createdAt)}`}
                                            </span>
                                            {announcement.publicSlug ? (
                                                <span lang="en">
                                                    /{announcement.publicSlug}
                                                </span>
                                            ) : null}
                                        </div>
                                    </div>
                                    <ChevronRight
                                        className="nl-icon"
                                        aria-hidden
                                    />
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            )}
        </PageContainer>
    );
}
