import { z } from "zod";

const paragraph = z.object({ kind: z.literal("paragraph"), text: z.string() });
const item = z.object({
    kind: z.literal("item"),
    title: z.string(),
    text: z.string(),
});
const warning = z.object({
    kind: z.literal("warning"),
    title: z.string(),
    text: z.string(),
});
const list = z.object({
    kind: z.literal("list"),
    items: z.array(z.string()).min(1),
});
// 위탁 · 국외 이전처럼 법이 칸을 정한 내용 — 칸 수는 머리와 같다
const table = z
    .object({
        kind: z.literal("table"),
        head: z.array(z.string()).min(2),
        rows: z.array(z.array(z.string())).min(1),
    })
    .refine((value) =>
        value.rows.every((row) => row.length === value.head.length)
    );
const contact = z.object({
    kind: z.literal("contact"),
    operatorLabel: z.string(),
    operator: z.string(),
    emailLabel: z.string(),
    email: z.email(),
});
export const privacyCopySchema = z.object({
    title: z.string(),
    dates: z.string(),
    contents: z.string(),
    detailLabel: z.string(),
    settingsLogin: z.string(),
    historyLink: z.string(),
    summary: z
        .array(
            z.object({
                title: z.string(),
                text: z.string(),
                target: z.string(),
            })
        )
        .min(1),
    sections: z
        .array(
            z.object({
                id: z.string(),
                title: z.string(),
                blocks: z.array(
                    z.discriminatedUnion("kind", [
                        paragraph,
                        item,
                        warning,
                        list,
                        contact,
                        table,
                    ])
                ),
            })
        )
        .min(1),
});
export type PrivacyCopy = z.infer<typeof privacyCopySchema>;
