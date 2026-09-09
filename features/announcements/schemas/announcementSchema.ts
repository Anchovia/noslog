import { z } from "zod";

import { SUPPORTED_LOCALES, type Locale } from "@/lib/i18n/routing";

export const ANNOUNCEMENT_TITLE_MAX_LENGTH = 80;
export const ANNOUNCEMENT_CONTENT_MAX_LENGTH = 5000;
export const ANNOUNCEMENT_SLUG_MAX_LENGTH = 80;
export const ANNOUNCEMENT_PLACEMENTS = ["ROUTINE", "SERVICE_CRITICAL"] as const;
export const ANNOUNCEMENT_LOCALES = SUPPORTED_LOCALES;

export const ANNOUNCEMENT_LOCALE_LABELS: Record<Locale, string> = {
    ko: "한국어",
    ja: "日本語",
    en: "English",
};
export const ANNOUNCEMENT_PLACEMENT_LABELS: Record<
    (typeof ANNOUNCEMENT_PLACEMENTS)[number],
    string
> = {
    ROUTINE: "일반 공지",
    SERVICE_CRITICAL: "중대 공지",
};

const titleSchema = z
    .string()
    .trim()
    .min(1, "공지 제목을 입력해주세요.")
    .max(
        ANNOUNCEMENT_TITLE_MAX_LENGTH,
        `공지 제목은 ${ANNOUNCEMENT_TITLE_MAX_LENGTH}자 이하로 입력해주세요.`
    );
// 브라우저가 textarea 값을 CRLF 로 보내므로 LF 로 통일해 무의미한 수정 시각을 막음
const contentSchema = z
    .string()
    .transform((value) => value.replace(/\r\n?/g, "\n"))
    .pipe(
        z
            .string()
            .trim()
            .min(1, "공지 내용을 입력해주세요.")
            .max(
                ANNOUNCEMENT_CONTENT_MAX_LENGTH,
                `공지 내용은 ${ANNOUNCEMENT_CONTENT_MAX_LENGTH}자 이하로 입력해주세요.`
            )
    );
const translationSchema = z.object({
    title: titleSchema,
    content: contentSchema,
});
// datetime-local 입력값(빈 문자열 = 미지정)을 Date | null 로 정규화함
const optionalDateTimeSchema = z
    .string()
    .trim()
    .transform((value, ctx) => {
        if (value === "") return null;
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) {
            ctx.addIssue({
                code: "custom",
                message: "날짜 형식이 잘못됐습니다.",
            });
            return z.NEVER;
        }
        return date;
    });

export const announcementFormSchema = z
    .object({
        publicSlug: z
            .string()
            .trim()
            .toLowerCase()
            .min(1, "공개 주소를 입력해주세요.")
            .max(
                ANNOUNCEMENT_SLUG_MAX_LENGTH,
                `공개 주소는 ${ANNOUNCEMENT_SLUG_MAX_LENGTH}자 이하로 입력해주세요.`
            )
            .regex(
                /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
                "공개 주소는 영문 소문자·숫자와 하이픈(-)만 쓸 수 있습니다."
            ),
        placement: z.enum(ANNOUNCEMENT_PLACEMENTS, {
            error: "공지 종류를 선택해주세요.",
        }),
        priority: z.coerce
            .number({ error: "우선순위는 정수로 입력해주세요." })
            .int("우선순위는 정수로 입력해주세요.")
            .min(0, "우선순위는 0 이상이어야 합니다.")
            .max(999, "우선순위는 999 이하여야 합니다."),
        activeFrom: optionalDateTimeSchema,
        expiresAt: optionalDateTimeSchema,
        isPublished: z.boolean(),
        translations: z.object({
            ko: translationSchema,
            ja: translationSchema,
            en: translationSchema,
        }),
    })
    .superRefine((value, ctx) => {
        if (value.placement === "SERVICE_CRITICAL" && !value.activeFrom) {
            ctx.addIssue({
                code: "custom",
                path: ["activeFrom"],
                message: "중대 공지는 노출 시작 시각이 필요합니다.",
            });
        }
        if (
            value.activeFrom &&
            value.expiresAt &&
            value.expiresAt <= value.activeFrom
        ) {
            ctx.addIssue({
                code: "custom",
                path: ["expiresAt"],
                message: "노출 종료는 노출 시작보다 뒤여야 합니다.",
            });
        }
    });

export const announcementIdSchema = z.coerce
    .number({ error: "잘못된 공지사항입니다." })
    .int("잘못된 공지사항입니다.")
    .positive("잘못된 공지사항입니다.");

export const announcementUpdateSchema = announcementFormSchema.safeExtend({
    id: announcementIdSchema,
});

export const announcementDeleteSchema = z.object({
    id: announcementIdSchema,
});

export type AnnouncementFormValues = z.input<typeof announcementFormSchema>;
export type AnnouncementValues = z.output<typeof announcementFormSchema>;
export type AnnouncementUpdateValues = z.output<
    typeof announcementUpdateSchema
>;
export type AnnouncementPlacement = AnnouncementValues["placement"];

function readString(formData: FormData, key: string) {
    return String(formData.get(key) ?? "");
}

export function announcementFormInputFromFormData(formData: FormData) {
    const isPublished = formData.get("isPublished");

    return {
        publicSlug: readString(formData, "publicSlug"),
        placement: readString(formData, "placement"),
        priority: readString(formData, "priority") || "0",
        activeFrom: readString(formData, "activeFrom"),
        expiresAt: readString(formData, "expiresAt"),
        isPublished: isPublished === "true" || isPublished === "on",
        translations: Object.fromEntries(
            ANNOUNCEMENT_LOCALES.map((locale) => [
                locale,
                {
                    title: readString(formData, `title.${locale}`),
                    content: readString(formData, `content.${locale}`),
                },
            ])
        ),
    };
}

export function announcementUpdateInputFromFormData(formData: FormData) {
    return {
        ...announcementFormInputFromFormData(formData),
        id: formData.get("id"),
    };
}

export function announcementDeleteInputFromFormData(formData: FormData) {
    return { id: formData.get("id") };
}

// Date 는 FormData 로 넘길 수 없으므로 ISO 문자열로 직렬화함
export function createAnnouncementFormData(
    values: AnnouncementValues,
    id?: number
) {
    const formData = new FormData();
    formData.set("publicSlug", values.publicSlug);
    formData.set("placement", values.placement);
    formData.set("priority", String(values.priority));
    formData.set("activeFrom", values.activeFrom?.toISOString() ?? "");
    formData.set("expiresAt", values.expiresAt?.toISOString() ?? "");
    formData.set("isPublished", String(values.isPublished));
    for (const locale of ANNOUNCEMENT_LOCALES) {
        formData.set(`title.${locale}`, values.translations[locale].title);
        formData.set(`content.${locale}`, values.translations[locale].content);
    }
    if (id !== undefined) formData.set("id", String(id));

    return formData;
}

export function createAnnouncementDeleteFormData(id: number) {
    const formData = new FormData();
    formData.set("id", String(id));
    return formData;
}

// datetime-local 입력은 로컬 시간대 기준 `YYYY-MM-DDTHH:mm` 문자열을 쓴다
export function toDateTimeLocalValue(date: Date | null | undefined) {
    if (!date) return "";
    const pad = (value: number) => String(value).padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

// 제목에서 공개 주소 초안을 만든다 — 라틴 문자가 없으면 빈 문자열
export function suggestAnnouncementSlug(title: string) {
    return title
        .normalize("NFKD")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, ANNOUNCEMENT_SLUG_MAX_LENGTH)
        .replace(/-+$/g, "");
}
