import {
    appendTierChangeImage,
    tierChangeImageAlt,
} from "@/features/announcements/lib/tier-change-image";
import { ANNOUNCEMENT_CONTENT_MAX_LENGTH } from "@/features/announcements/schemas/announcement-schema";
import type { TierChangeImageData } from "@/features/announcements/schemas/tier-change-image-schema";
import type { Locale } from "@/lib/i18n/routing";

/** 호출 시 선택한 언어의 getter/setter를 받는다. 업로드를 기다린 뒤 최신 본문에만 덧붙인다. */
export async function attachTierChangeImage({
    file,
    data,
    locale,
    upload,
    getContent,
    setContent,
}: {
    file: File;
    data: TierChangeImageData;
    locale: Locale;
    upload: (file: File) => Promise<string>;
    getContent: () => string;
    setContent: (content: string) => void;
}) {
    return attachAnnouncementImage({
        file,
        alt: tierChangeImageAlt(data, locale),
        upload,
        getContent,
        setContent,
    });
}

/** 이미지 양식과 관계없이 첨부를 시작한 언어의 최신 본문을 보존한다. */
export async function attachAnnouncementImage({
    file,
    alt,
    upload,
    getContent,
    setContent,
}: {
    file: File;
    alt: string;
    upload: (file: File) => Promise<string>;
    getContent: () => string;
    setContent: (content: string) => void;
}) {
    const withinLimit = (content: string) => {
        if (content.length > ANNOUNCEMENT_CONTENT_MAX_LENGTH)
            throw new Error(
                "이미지 설명을 포함하면 본문 글자 수 제한을 초과합니다. 본문을 줄여주세요."
            );
        return content;
    };
    withinLimit(appendTierChangeImage(getContent(), "", alt));
    const url = await upload(file);
    const next = withinLimit(appendTierChangeImage(getContent(), url, alt));
    setContent(next);
}
