import { announcementDate } from "@/features/announcements/components/announcement-row";
import {
    ANNOUNCEMENT_BANNER_PALETTE,
    loadTierImageFont,
    TIER_IMAGE_FONT_FAMILY,
} from "@/features/announcements/lib/tier-change-image";
import type { Locale } from "@/lib/i18n/routing";
import {
    BRAND_MARK_CAT_PATH,
    BRAND_MARK_CIRCLE,
} from "@/lib/metadata/brand-mark";

export const ANNOUNCEMENT_BANNER_WIDTH = 1100;
export const ANNOUNCEMENT_BANNER_HEIGHT = 280;
export const ANNOUNCEMENT_BANNER_HEADING_MAX_LENGTH = 40;

const LEFT = 67;
const HEADING_SIZE = 70;
const MARK_DIAMETER = 154;
const MARK_CENTER_X = 950;
const HEADING_MAX_WIDTH =
    MARK_CENTER_X - MARK_DIAMETER / 2 - LEFT - HEADING_SIZE / 2;

/** 큰 글자가 칸을 넘으면 넘지 않을 만큼 줄인다. 글자를 자르지 않는다 */
export function fitBannerHeadingSize(width: number) {
    return width <= HEADING_MAX_WIDTH
        ? HEADING_SIZE
        : Math.floor((HEADING_SIZE * HEADING_MAX_WIDTH) / width);
}

/** 공지 목록과 같은 날짜 형식. 「YYYY-MM-DD」 는 한국 시간 그날로 읽는다 */
export function announcementBannerDate(date: string, locale: Locale) {
    return announcementDate(`${date}T00:00:00+09:00`, locale);
}

/** 제목 앞의 서비스 이름은 배너 윗줄에 이미 있어 큰 글자 기본값에서 뺀다 */
export function bannerHeadingFromTitle(title: string) {
    return title.trim().replace(/^NosLog\s+/i, "");
}

export async function createAnnouncementBannerImage({
    heading,
    date,
    locale,
}: {
    heading: string;
    date: string;
    locale: Locale;
}): Promise<File> {
    await loadTierImageFont();
    const canvas = document.createElement("canvas");
    canvas.width = ANNOUNCEMENT_BANNER_WIDTH;
    canvas.height = ANNOUNCEMENT_BANNER_HEIGHT;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("이 브라우저에서 이미지를 만들 수 없습니다.");
    const font = (size: number, weight: number) =>
        `${weight} ${size}px ${TIER_IMAGE_FONT_FAMILY}`;

    context.beginPath();
    context.roundRect(
        1,
        1,
        ANNOUNCEMENT_BANNER_WIDTH - 2,
        ANNOUNCEMENT_BANNER_HEIGHT - 2,
        14
    );
    context.fillStyle = ANNOUNCEMENT_BANNER_PALETTE.surface;
    context.fill();
    context.lineWidth = 2;
    context.strokeStyle = ANNOUNCEMENT_BANNER_PALETTE.border;
    context.stroke();

    context.font = font(28, 500);
    context.fillStyle = ANNOUNCEMENT_BANNER_PALETTE.brand;
    context.fillText("NosLog", LEFT, 84);
    context.font = font(HEADING_SIZE, 700);
    const size = fitBannerHeadingSize(context.measureText(heading).width);
    context.font = font(size, 700);
    context.fillStyle = ANNOUNCEMENT_BANNER_PALETTE.heading;
    context.fillText(heading, LEFT, 168);
    context.font = font(26, 400);
    context.fillStyle = ANNOUNCEMENT_BANNER_PALETTE.date;
    context.fillText(announcementBannerDate(date, locale), LEFT, 222);

    const scale = MARK_DIAMETER / (BRAND_MARK_CIRCLE.r * 2);
    context.save();
    context.translate(
        MARK_CENTER_X - BRAND_MARK_CIRCLE.cx * scale,
        ANNOUNCEMENT_BANNER_HEIGHT / 2 - BRAND_MARK_CIRCLE.cy * scale
    );
    context.scale(scale, scale);
    context.fillStyle = ANNOUNCEMENT_BANNER_PALETTE.mark;
    context.beginPath();
    context.arc(
        BRAND_MARK_CIRCLE.cx,
        BRAND_MARK_CIRCLE.cy,
        BRAND_MARK_CIRCLE.r,
        0,
        Math.PI * 2
    );
    context.fill();
    context.fillStyle = ANNOUNCEMENT_BANNER_PALETTE.cat;
    context.fill(new Path2D(BRAND_MARK_CAT_PATH), "evenodd");
    context.restore();

    const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, "image/png")
    );
    if (!blob) throw new Error("배너 이미지를 만들지 못했습니다.");
    return new File([blob], `announcement-banner-${locale}.png`, {
        type: "image/png",
    });
}
