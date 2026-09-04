"use server";

import { setPreferredArcade as setPreferredArcadeService } from "@/features/arcades/server/preferredArcadeService";

export type { PreferredArcadeActionResult } from "@/features/arcades/server/preferredArcadeService";

export async function setPreferredArcade(
    arcadeId: number,
    requestedLocale = "ko"
) {
    return setPreferredArcadeService(arcadeId, requestedLocale);
}
