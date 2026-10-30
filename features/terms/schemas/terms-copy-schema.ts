import { z } from "zod";

import { policyBlockSchema } from "@/features/privacy/schemas/privacy-copy-schema";

export const termsCopySchema = z.object({
    title: z.string(),
    dates: z.string(),
    contents: z.string(),
    historyLink: z.string(),
    privacyLink: z.string(),
    sections: z
        .array(
            z.object({
                id: z.string(),
                title: z.string(),
                blocks: z.array(policyBlockSchema),
            })
        )
        .min(1),
});
export type TermsCopy = z.infer<typeof termsCopySchema>;
