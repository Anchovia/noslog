"use server";

import {
    clearPreferredArcade as clearPreferredArcadeService,
    setPreferredArcade as setPreferredArcadeService,
} from "@/features/arcades/server/preferred-arcade-service";
import { submitArcadeReport as submitArcadeReportService } from "@/features/arcades/server/arcade-report-service";
import { confirmCabinetRunning as confirmCabinetRunningService } from "@/features/arcades/server/cabinet-check-service";

export async function setPreferredArcade(
    arcadeId: number,
    requestedLocale = "ko"
) {
    return setPreferredArcadeService(arcadeId, requestedLocale);
}

export async function clearPreferredArcade(
    arcadeId: number,
    requestedLocale = "ko"
) {
    return clearPreferredArcadeService(arcadeId, requestedLocale);
}

export async function submitArcadeReport(formData: FormData) {
    return submitArcadeReportService(formData);
}

export async function confirmCabinetRunning(
    cabinetId: number,
    requestedLocale = "ko"
) {
    return confirmCabinetRunningService(cabinetId, requestedLocale);
}
