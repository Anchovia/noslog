import type { BingoFormValues } from "@/features/bingos/schemas/bingo-editor-schema";

export type BingoEditorData = BingoFormValues & { id?: number };

export interface BingoMusicOption {
    index: string;
    title: string;
}
