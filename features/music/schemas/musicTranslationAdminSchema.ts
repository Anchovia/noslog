import { z } from "zod";

export const MUSIC_TRANSLATION_LOCALES = ["ko", "en"] as const;
export const MUSIC_TRANSLATION_STATUSES = ["draft", "approved"] as const;
export const MUSIC_TRANSLATION_TITLE_MAX_LENGTH = 300;

export const musicTranslationLocaleSchema = z.enum(MUSIC_TRANSLATION_LOCALES, {
    error: "번역 언어를 확인해주세요.",
});
export const musicTranslationStatusSchema = z.enum(MUSIC_TRANSLATION_STATUSES, {
    error: "검수 상태를 확인해주세요.",
});

const musicIndexSchema = z.string().trim().min(1, "잘못된 악곡입니다.");

export const musicTranslationFormSchema = z.object({
    musicIndex: musicIndexSchema,
    locale: musicTranslationLocaleSchema,
    title: z
        .string()
        .trim()
        .max(
            MUSIC_TRANSLATION_TITLE_MAX_LENGTH,
            "번역 제목은 " +
                MUSIC_TRANSLATION_TITLE_MAX_LENGTH +
                "자 이하로 입력해주세요."
        ),
    status: musicTranslationStatusSchema,
});

export const musicTranslationApproveSchema = z.object({
    musicIndex: musicIndexSchema,
    locale: musicTranslationLocaleSchema,
});

export const musicTranslationCsvTextSchema = z.object({
    csv: z
        .string()
        .refine((value) => value.trim().length > 0, "CSV 내용을 입력해주세요."),
});

export type MusicTranslationLocale = z.infer<
    typeof musicTranslationLocaleSchema
>;
export type MusicTranslationStatus = z.infer<
    typeof musicTranslationStatusSchema
>;
export type MusicTranslationFormValues = z.input<
    typeof musicTranslationFormSchema
>;
export type MusicTranslationValues = z.output<
    typeof musicTranslationFormSchema
>;
export type MusicTranslationFieldName = Extract<
    keyof MusicTranslationFormValues,
    string
>;
export type MusicTranslationCsvFormValues = z.input<
    typeof musicTranslationCsvTextSchema
>;

export function normalizeMusicTranslationLocale(
    value: string | null | undefined
) {
    const result = musicTranslationLocaleSchema.safeParse(value);
    return result.success ? result.data : undefined;
}

export function normalizeMusicTranslationStatus(
    value: string | null | undefined
) {
    const result = musicTranslationStatusSchema.safeParse(value);
    return result.success ? result.data : undefined;
}

export function musicTranslationInputFromFormData(formData: FormData) {
    return {
        musicIndex: String(formData.get("musicIndex") ?? ""),
        locale: String(formData.get("locale") ?? ""),
        title: String(formData.get("title") ?? ""),
        status: String(formData.get("status") ?? ""),
    };
}

export function musicTranslationApproveInputFromFormData(formData: FormData) {
    return {
        musicIndex: String(formData.get("musicIndex") ?? ""),
        locale: String(formData.get("locale") ?? ""),
    };
}

export function createMusicTranslationFormData(values: MusicTranslationValues) {
    const formData = new FormData();
    formData.set("musicIndex", values.musicIndex);
    formData.set("locale", values.locale);
    formData.set("title", values.title);
    formData.set("status", values.status);
    return formData;
}

export function createMusicTranslationApproveFormData(
    musicIndex: string,
    locale: MusicTranslationLocale
) {
    const formData = new FormData();
    formData.set("musicIndex", musicIndex);
    formData.set("locale", locale);
    return formData;
}
