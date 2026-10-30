import { announcementImage } from "@/features/announcements/components/announcement-body";
import {
    ANNOUNCEMENT_BANNER_HEIGHT,
    ANNOUNCEMENT_BANNER_WIDTH,
} from "@/features/announcements/lib/announcement-banner-image";

/** 글 제목 아래 배너. 본문 이미지와 같은 저장소 주소만 그린다 */
export default function AnnouncementBanner({
    url,
    title,
}: {
    url: string | null | undefined;
    title: string;
}) {
    const src = url ? announcementImage(url) : null;
    if (!src) return null;
    return (
        // eslint-disable-next-line @next/next/no-img-element -- 이미 1100 폭으로 만든 그림 · 저장소 주소 그대로
        <img
            src={src}
            alt={title}
            width={ANNOUNCEMENT_BANNER_WIDTH}
            height={ANNOUNCEMENT_BANNER_HEIGHT}
            decoding="async"
            className="nl-announcement-banner"
        />
    );
}
