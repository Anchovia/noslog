import z from "zod";

export const settingSchema = z.object({
    avatar: z.string({
        message: "사진은 필수입니다.",
    }),
    username: z
        .string({
            message: "닉네임은 필수입니다.",
        })
        .toUpperCase(),
    discord_name: z.string({
        message: "디스코드 이름은 필수입니다.",
    }),
    discord_tag: z.string({
        message: "디스코드 태그는 필수입니다.",
    }),
});

export type SettingType = z.infer<typeof settingSchema>;
