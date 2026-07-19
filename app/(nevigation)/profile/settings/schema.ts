import z from "zod";

export const PROFILE_COUNTRIES = [
    { value: "ko-KR", label: "대한민국", code: "KR" },
    { value: "ja-JP", label: "일본", code: "JP" },
    { value: "global", label: "기타", code: "GLO" },
] as const;

export const countrySchema = z.enum(["ko-KR", "ja-JP", "global"], {
    error: "국가를 선택해주세요.",
});

export const usernameSchema = z
    .string()
    .trim()
    .min(1, "닉네임을 입력해주세요.")
    .max(20, "닉네임은 20자 이하로 입력해주세요.")
    .transform((value) => value.toUpperCase());

export const settingSchema = z.object({
    avatar: z.union([z.url("올바른 이미지 주소가 아닙니다."), z.literal("")]),
    username: usernameSchema,
    country: countrySchema,
});

export const onboardingSchema = z.object({
    username: usernameSchema,
    country: countrySchema,
});

export type SettingType = z.infer<typeof settingSchema>;
