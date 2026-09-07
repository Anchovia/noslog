export function preferenceDiameter(count: number | null) {
    if (count === null || count < 3) return 6;
    // The Figma 12-user specimen fixes the national reference area at 28px.
    return Math.max(20, Math.min(38, Math.sqrt((count * 28 ** 2) / 12)));
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
