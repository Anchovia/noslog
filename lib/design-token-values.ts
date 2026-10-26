/**
 * CSS 변수를 읽지 못하는 그림(공유 카드 이미지 · 캔버스)이 쓰는 토큰 값 — `app/styles/tokens.css` 의 값을 옮긴 것.
 * 토큰을 바꾸면 여기도 같이 바꾼다. DOM 이 있는 곳은 `readTokenPixels` 로 토큰을 직접 읽는다.
 */
export const TOKEN_VALUES = {
    spacing: {
        0: 0,
        2: 2,
        4: 4,
        8: 8,
        12: 12,
        16: 16,
        24: 24,
        32: 32,
        48: 48,
        64: 64,
    },
    typeSize: {
        12: 12,
        14: 14,
        16: 16,
        20: 20,
        24: 24,
        28: 28,
        32: 32,
        40: 40,
    },
    weight: {
        regular: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
    },
    radius: {
        small: 4,
        control: 6,
        overlay: 12,
        full: 9999,
    },
    stroke: {
        default: 1,
        strong: 2,
    },
} as const;
