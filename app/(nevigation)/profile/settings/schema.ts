import z from "zod";

export const settingSchema = z.object({
    avatar: z.union([z.url("올바른 이미지 주소가 아닙니다."), z.literal("")]),
    username: z
        .string()
        .trim()
        .min(2, "닉네임은 2자 이상 입력해주세요.")
        .max(20, "닉네임은 20자 이하로 입력해주세요.")
        .transform((value) => value.toUpperCase()),
    discord_name: z
        .string()
        .trim()
        .max(32, "Discord 이름은 32자 이하로 입력해주세요."),
    discord_tag: z
        .string()
        .trim()
        .max(32, "Discord 태그는 32자 이하로 입력해주세요."),
});

export type SettingType = z.infer<typeof settingSchema>;
