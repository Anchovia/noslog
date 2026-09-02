import { z } from "zod";

export const ANNOUNCEMENT_TITLE_MAX_LENGTH = 80;
export const ANNOUNCEMENT_CONTENT_MAX_LENGTH = 2000;

export const announcementFormSchema = z.object({
    title: z
        .string()
        .trim()
        .min(1, "공지 제목을 입력해주세요.")
        .max(
            ANNOUNCEMENT_TITLE_MAX_LENGTH,
            `공지 제목은 ${ANNOUNCEMENT_TITLE_MAX_LENGTH}자 이하로 입력해주세요.`
        ),
    content: z
        .string()
        .trim()
        .min(1, "공지 내용을 입력해주세요.")
        .max(
            ANNOUNCEMENT_CONTENT_MAX_LENGTH,
            `공지 내용은 ${ANNOUNCEMENT_CONTENT_MAX_LENGTH}자 이하로 입력해주세요.`
        ),
    isPublished: z.boolean(),
});

export const announcementIdSchema = z.coerce
    .number({ error: "잘못된 공지사항입니다." })
    .int("잘못된 공지사항입니다.")
    .positive("잘못된 공지사항입니다.");

export const announcementUpdateSchema = announcementFormSchema.extend({
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

export function announcementFormInputFromFormData(formData: FormData) {
    const isPublished = formData.get("isPublished");

    return {
        title: String(formData.get("title") ?? ""),
        content: String(formData.get("content") ?? ""),
        isPublished: isPublished === "true" || isPublished === "on",
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

export function createAnnouncementFormData(
    values: AnnouncementValues,
    id?: number
) {
    const formData = new FormData();
    formData.set("title", values.title);
    formData.set("content", values.content);
    formData.set("isPublished", String(values.isPublished));
    if (id !== undefined) formData.set("id", String(id));

    return formData;
}

export function createAnnouncementDeleteFormData(id: number) {
    const formData = new FormData();
    formData.set("id", String(id));
    return formData;
}
