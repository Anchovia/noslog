"use server";

import { setBingoCellCompletion as setBingoCellCompletionService } from "@/features/bingos/server/bingoProgressService";
import { resetBingoProgress as resetBingoProgressService } from "@/features/bingos/server/bingoProgressService";

export async function resetBingoProgress(
    bingoId: number,
    requestedLocale = "ko"
) {
    return resetBingoProgressService(bingoId, requestedLocale);
}

export type { ToggleBingoCellResult } from "@/features/bingos/server/bingoProgressService";

export async function setBingoCellCompletion(
    bingoCellId: number,
    isCompleted: boolean,
    requestedLocale = "ko"
) {
    return setBingoCellCompletionService(
        bingoCellId,
        isCompleted,
        requestedLocale
    );
}
