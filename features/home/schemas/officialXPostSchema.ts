import { z } from "zod";
import type { OfficialXPostContent } from "@/features/home/officialXPostContent";

const httpsUrl = z.url().refine((value) => value.startsWith("https://"));
export const officialXPostSchema = z.object({
    id: z.string().regex(/^\d+$/),
    url: httpsUrl,
    text: z.string(),
    createdAt: z.iso.datetime({ offset: true }),
    author: z.object({
        name: z.string(),
        username: z.string(),
        avatarUrl: httpsUrl.nullable(),
    }),
    image: z
        .object({
            url: httpsUrl,
            width: z.number().positive(),
            height: z.number().positive(),
            alt: z.string().nullable(),
        })
        .nullable(),
    links: z.array(
        z.object({
            url: httpsUrl,
            expandedUrl: httpsUrl,
            displayUrl: z.string(),
            isMedia: z.boolean(),
        })
    ),
    translations: z
        .object({ ko: z.string().trim().min(1), en: z.string().trim().min(1) })
        .nullable(),
}) satisfies z.ZodType<OfficialXPostContent>;
