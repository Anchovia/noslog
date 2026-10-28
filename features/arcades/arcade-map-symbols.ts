/**
 * 지역 버블의 보이는 지름 — 범위 안 오락실 수로 정한다(코로나 맵의 시도별 원 언어).
 * 2곳 = 가장 작은 지름, 많을수록 커지되 가장 큰 지름에서 멈춘다(2026-10-21 전면 대조 ③ — 32 에서 48 까지).
 * 값은 부르는 쪽이 토큰(--nl-spacing-32 · --nl-spacing-48)에서 읽어 넘긴다. 누르는 자리 44 는 버튼이 따로 지킨다
 */
export function clusterDiameter(
    count: number,
    smallest: number,
    largest: number
) {
    if (count < 3) return smallest;
    const step = (largest - smallest) / 3;
    return Math.round(
        Math.min(largest, smallest + Math.log2(count - 1) * step)
    );
}

export function groupMapPoints<T extends { x: number; y: number }>(
    points: T[],
    distance = 44
) {
    const groups: { x: number; y: number; points: T[] }[] = [];
    for (const point of points) {
        const group = groups.find(
            (item) => Math.hypot(item.x - point.x, item.y - point.y) < distance
        );
        if (!group) groups.push({ x: point.x, y: point.y, points: [point] });
        else {
            group.points.push(point);
            group.x =
                group.points.reduce((sum, item) => sum + item.x, 0) /
                group.points.length;
            group.y =
                group.points.reduce((sum, item) => sum + item.y, 0) /
                group.points.length;
        }
    }
    return groups;
}
