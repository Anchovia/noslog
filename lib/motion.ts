// 움직임 토큰을 JS 에서 읽는다 — CSS 로 옮길 수 없는 움직임(SVG 선 모양이 바뀜)도 값은 tokens.css 한 곳에서(2026-09-19).
// 동작 줄이기면 토큰이 0ms 라 곧바로 끝난다.

/** CSS 시간 값(「300ms」 · 「0.3s」)을 ms 로. 읽지 못하면 0 */
export function parseDuration(value: string) {
    const text = value.trim();
    const number = Number.parseFloat(text);
    if (!Number.isFinite(number)) return 0;
    return text.endsWith("ms")
        ? number
        : text.endsWith("s")
          ? number * 1000
          : 0;
}

/** 「cubic-bezier(x1, y1, x2, y2)」 을 진행률(0–1) → 움직임 비율 함수로. 읽지 못하면 그대로(linear) */
export function cubicBezier(value: string): (progress: number) => number {
    const match = value.match(/cubic-bezier\(([^)]+)\)/);
    const numbers = match?.[1].split(",").map((part) => Number(part.trim()));
    if (!numbers || numbers.length !== 4 || numbers.some(Number.isNaN))
        return (progress) => progress;
    const [x1, y1, x2, y2] = numbers;
    const curve = (a: number, b: number, t: number) =>
        3 * a * t * (1 - t) ** 2 + 3 * b * t ** 2 * (1 - t) + t ** 3;
    return (progress) => {
        if (progress <= 0) return 0;
        if (progress >= 1) return 1;
        // x(t) = progress 인 t 를 이분법으로 찾는다
        let low = 0;
        let high = 1;
        for (let step = 0; step < 24; step++) {
            const middle = (low + high) / 2;
            if (curve(x1, x2, middle) < progress) low = middle;
            else high = middle;
        }
        return curve(y1, y2, (low + high) / 2);
    };
}

/** 요소에서 시간 · 곡선 토큰을 읽는다 */
export function readMotion(
    element: Element,
    durationToken: string,
    easeToken: string
) {
    const style = getComputedStyle(element);
    return {
        duration: parseDuration(style.getPropertyValue(durationToken)),
        ease: cubicBezier(style.getPropertyValue(easeToken)),
    };
}
