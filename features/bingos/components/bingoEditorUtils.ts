export const BINGO_EDITOR_INPUT_CLASS =
    "border-border bg-bg text-input h-11 w-full rounded-md border px-3 outline-none focus:border-focus";

export function getBingoEditorCellLabel(position: number) {
    const row = String.fromCharCode(65 + Math.floor((position - 1) / 5));
    const column = ((position - 1) % 5) + 1;

    return `${row}${column}`;
}

export function getBingoEditorCellPrefix(position: number) {
    return `cell-${position}`;
}
