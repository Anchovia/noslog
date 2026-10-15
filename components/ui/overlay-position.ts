// 떠 있는 창(Radix 팝오버 · 셀렉트 · 메뉴 · 도움말)의 자리 — 트리거와 사이 8 · 화면 끝과 16(--nl-spacing-8 · -16).
// Radix 는 숫자 prop 만 받아서 부품마다 숫자를 다시 쓰지 않게 이 한 곳에 둔다(2026-10-15).
export const overlayPosition = {
    sideOffset: 8,
    collisionPadding: 16,
} as const;
