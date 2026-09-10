import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import PageContainer, { PageHeading } from "@/components/layout/pageContainer";
import AnnouncementEditor, {
    type AnnouncementEditorData,
} from "@/features/announcements/components/announcementEditor";
import {
    ANNOUNCEMENT_LOCALES,
    announcementIdSchema,
    toDateTimeLocalValue,
} from "@/features/announcements/schemas/announcementSchema";
import db from "@/lib/db";

const dateFormat = new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "medium",
    timeStyle: "short",
});

export default async function EditAnnouncementPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const parsed = announcementIdSchema.safeParse((await params).id);
    if (!parsed.success) notFound();
    const announcement = await db.announcement.findUnique({
        where: { id: parsed.data },
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
    if (!announcement) notFound();

    // 다국어 모델 이전에 만든 공지는 legacy 제목·본문을 한국어 초안으로 끌어옴
    const translations = Object.fromEntries(
        ANNOUNCEMENT_LOCALES.map((locale) => {
            const row = announcement.translations.find(
                (item) => item.locale === locale
            );
            return [
                locale,
                row
                    ? { title: row.title, content: row.content }
                    : locale === "ko"
                      ? {
                            title: announcement.title,
                            content: announcement.content,
                        }
                      : { title: "", content: "" },
            ];
        })
    ) as AnnouncementEditorData["translations"];

    const data: AnnouncementEditorData = {
        id: announcement.id,
        publicSlug: announcement.publicSlug ?? "",
        placement: announcement.placement,
        category: announcement.category,
        priority: announcement.priority,
        activeFrom: toDateTimeLocalValue(announcement.activeFrom),
        expiresAt: toDateTimeLocalValue(announcement.expiresAt),
        isPublished: announcement.isPublished,
        translations,
    };
    const modifiedAt = announcement.translations
        .map((item) => item.modifiedAt)
        .filter((value): value is Date => value !== null)
        .sort((a, b) => b.getTime() - a.getTime())[0];

    return (
        <PageContainer width="reading">
            <Link
                href="/admin/announcements"
                className="nl-announcements__back nl-control"
            >
                <ChevronLeft aria-hidden />
                공지사항
            </Link>
            <PageHeading
                title={translations.ko.title || "제목 없음"}
                description={[
                    announcement.publishedAt
                        ? `공개 ${dateFormat.format(announcement.publishedAt)}`
                        : `작성 ${dateFormat.format(announcement.createdAt)}`,
                    modifiedAt ? `수정 ${dateFormat.format(modifiedAt)}` : null,
                ]
                    .filter(Boolean)
                    .join(" · ")}
            />
            <AnnouncementEditor announcement={data} />
        </PageContainer>
    );
}
