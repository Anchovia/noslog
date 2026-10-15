"use server";

import { regenerateSyncToken as regenerateSyncTokenService } from "@/features/profile/server/sync-token-service";
import type { Locale } from "@/lib/i18n/routing";

export async function regenerateSyncToken(requestedLocale?: Locale) {
    return regenerateSyncTokenService(requestedLocale);
}
