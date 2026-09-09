import type { AnnouncementCategory } from "@/features/announcements/schemas/publicAnnouncementSchema";

// 제목 앞 인라인 분류 태그. 색 없이 1px border/default 아웃라인, 글자 metadata·subdued (Z1 ㊱ c1)
export default function AnnouncementCategoryTag({
    category,
    label,
}: {
    category: AnnouncementCategory;
    label: string;
}) {
    return (
        <span
            className="nl-announcement-category nl-metadata nl-muted"
            data-category={category}
        >
            {label}
        </span>
    );
}
