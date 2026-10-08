"use server";

import { setBingoCellCompletion as setBingoCellCompletionService } from "@/features/bingos/server/bingo-progress-service";
import { resetBingoProgress as resetBingoProgressService } from "@/features/bingos/server/bingo-progress-service";

export async function resetBingoProgress(
    bingoId: number,
    requestedLocale = "ko"
) {
    return resetBingoProgressService(bingoId, requestedLocale);
}

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
