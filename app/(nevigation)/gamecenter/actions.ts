"use server";

import { setPreferredArcade as setPreferredArcadeService } from "@/features/arcades/server/preferredArcadeService";
import { submitArcadeReport as submitArcadeReportService } from "@/features/arcades/server/arcadeReportService";

export type { PreferredArcadeActionResult } from "@/features/arcades/server/preferredArcadeService";

export async function setPreferredArcade(
    arcadeId: number,
    requestedLocale = "ko"
) {
    return setPreferredArcadeService(arcadeId, requestedLocale);
}

export async function submitArcadeReport(formData: FormData) {
    return submitArcadeReportService(formData);
}
