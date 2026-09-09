import type { BingoFormValues } from "@/features/bingos/schemas/bingoEditorSchema";

export type BingoEditorData = BingoFormValues & { id?: number };

export interface BingoMusicOption {
    index: string;
    title: string;
}
