import { z } from "zod";

import { SUPPORTED_LOCALES } from "@/lib/i18n/routing";

// The action accepts only a locale, never a caller-supplied user ID or token version.
export const syncTokenRequestSchema = z.object({
    locale: z.enum(SUPPORTED_LOCALES).catch("ko"),
});
