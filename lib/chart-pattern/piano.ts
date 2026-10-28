import {
    hexToNumber,
    PIANO_COLORS,
    PRESSED_HAND_COLORS,
} from "@/lib/chart-pattern/stageColors";

export const chartPianoColors = {
    white: hexToNumber(PIANO_COLORS.white),
    whiteAlt: hexToNumber(PIANO_COLORS.whiteAlt),
    black: hexToNumber(PIANO_COLORS.black),
    // 눌린 건반 = 공개 뷰어와 같은 손 색 섞음(2026-10-15 B5)
    pressedLeft: PRESSED_HAND_COLORS.left,
    pressedRight: PRESSED_HAND_COLORS.right,
} as const;
