import z from "zod";

export const settingSchema = z.object({
    avatar: z.string({
        required_error: "사진은 필수입니다.",
    }),
    username: z
        .string({
            required_error: "닉네임은 필수입니다.",
        })
        .toUpperCase(),
    discord_name: z.string({
        required_error: "디스코드 이름은 필수입니다.",
    }),
    discord_tag: z.string({
        required_error: "디스코드 태그는 필수입니다.",
    }),
});

export type SettingType = z.infer<typeof settingSchema>;
