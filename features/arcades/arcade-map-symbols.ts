/**
 * 지역 버블 지름 — 범위 안 오락실 수로 결정한다(코로나 맵의 시도별 원 언어).
 * 1곳은 버블이 아니라 핀이므로 2곳부터 시작하고, 상한은 터치 타겟 두 배(88).
 */
export function clusterDiameter(count: number) {
    if (count < 2) return 44;
    return Math.round(Math.max(44, Math.min(88, 32 + Math.sqrt(count) * 12)));
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
