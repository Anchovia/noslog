// 크기 토큰을 JS 에서 읽는다 — JS 계산에 토큰 값을 숫자로 다시 쓰지 않는다(2026-10-15, 가이드 1절).
// 토큰은 `.noslog-ui` 에 있으니 그 안의 요소에서 읽는다. 읽지 못하면 0

/** 요소에서 길이 토큰(「16px」)을 px 숫자로 읽는다 */
export function readTokenPixels(element: Element, token: string) {
    return (
        Number.parseFloat(getComputedStyle(element).getPropertyValue(token)) ||
        0
    );
}
