import z from "zod";

export const settingSchema = z.object({
    avatar: z.string(),
    username: z
        .string({
            message: "닉네임은 필수입니다.",
        })
        .toUpperCase(),
    discord_name: z.string().nullable(),
    discord_tag: z.string().nullable(),
});

export type SettingType = z.infer<typeof settingSchema>;
