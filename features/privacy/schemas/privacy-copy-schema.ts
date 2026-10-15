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
        .length(4),
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
                    ])
                ),
            })
        )
        .length(12),
});
export type PrivacyCopy = z.infer<typeof privacyCopySchema>;
