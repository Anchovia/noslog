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

const discordNameSchema = z
    .string()
    .trim()
    .max(32, "Discord 닉네임은 32자 이하로 입력해주세요.");

const discordUsernameSchema = z
    .string()
    .trim()
    .transform((value) => value.replace(/^@+/, ""))
    .refine(
        (value) => value === "" || /^[a-zA-Z0-9._]+$/.test(value),
        "Discord 태그는 영문, 숫자, 마침표, 밑줄만 사용할 수 있습니다."
    )
    .refine(
        (value) => value.length <= 32,
        "Discord 태그는 32자 이하로 입력해주세요."
    );

export const settingSchema = z.object({
    avatar: z.union([z.url("올바른 이미지 주소가 아닙니다."), z.literal("")]),
    username: usernameSchema,
    country: countrySchema,
    discordName: discordNameSchema,
    discordUsername: discordUsernameSchema,
    preferredArcadeId: z.union([
        z.literal(""),
        z.string().regex(/^\d+$/, "오락실을 다시 선택해주세요."),
    ]),
    hideNostalgiaName: z.boolean(),
    hideDiscordName: z.boolean(),
    hidePlayCount: z.boolean(),
});

export const onboardingSchema = z.object({
    username: usernameSchema,
    country: countrySchema,
});

export type SettingType = z.infer<typeof settingSchema>;
