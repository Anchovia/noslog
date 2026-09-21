"use server";

import {
    clearPreferredArcade as clearPreferredArcadeService,
    setPreferredArcade as setPreferredArcadeService,
} from "@/features/arcades/server/preferredArcadeService";
import { submitArcadeReport as submitArcadeReportService } from "@/features/arcades/server/arcadeReportService";
import { confirmCabinetRunning as confirmCabinetRunningService } from "@/features/arcades/server/cabinetCheckService";

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
