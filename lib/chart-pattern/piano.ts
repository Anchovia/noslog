import { PRESSED_HAND_COLORS } from "@/lib/chart-pattern/stageColors";

export const chartPianoColors = {
    white: 0xe7e6e1,
    whiteAlt: 0xd2d4d4,
    black: 0x161820,
    // 눌린 건반 = 공개 뷰어와 같은 손 색 섞음(2026-10-15 B5)
    pressedLeft: PRESSED_HAND_COLORS.left,
    pressedRight: PRESSED_HAND_COLORS.right,
} as const;
