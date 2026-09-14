import type { AnnouncementCategory } from "@/features/announcements/schemas/publicAnnouncementSchema";

// 분류 태그 = 공용 태그(nl-tag). 위치는 제목 위 분류·날짜 줄(nl-announcement-meta)
export default function AnnouncementCategoryTag({
    category,
    label,
}: {
    category: AnnouncementCategory;
    label: string;
}) {
    return (
        <span className="nl-tag nl-metadata" data-category={category}>
            {label}
        </span>
    );
}
