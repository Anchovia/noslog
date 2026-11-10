/** 가로 위치 비율(0 = 왼쪽 · 1 = 오른쪽). coordinate 가 있으면 그 간격대로, 없으면 고르게 놓는다 */
export function pointFraction(
    points: readonly { coordinate?: number }[],
    index: number
) {
    const firstCoordinate = points[0]?.coordinate;
    const coordinateRange =
        (points.at(-1)?.coordinate ?? 0) - (firstCoordinate ?? 0);
    // 점이 하나면 가운데 — AtCoder · Codeforces 처럼 틀 · 축 · 표는 그대로 두고 점만 찍는다 (2026-09-16)
    return points.length === 1
        ? 0.5
        : firstCoordinate !== undefined && coordinateRange > 0
          ? ((points[index].coordinate ?? firstCoordinate) - firstCoordinate) /
            coordinateRange
          : index / Math.max(1, points.length - 1);
}

/** 값의 높이 비율(0 = 바닥 · 1 = 위) */
export function valueHeights(
    points: readonly { value: number; secondaryValue?: number }[],
    domain: readonly [number, number],
    secondary: boolean
) {
    const range = domain[1] - domain[0] || 1;
    return points.map(
        (point) =>
            ((secondary ? (point.secondaryValue ?? 0) : point.value) -
                domain[0]) /
            range
    );
}

/** 값 축 눈금 — 위(최댓값)에서 아래(최솟값)로 같은 간격 */
export function valueTicks(domain: readonly [number, number], count: number) {
    const range = domain[1] - domain[0] || 1;
    return Array.from(
        { length: count },
        (_, index) => domain[1] - (index / Math.max(1, count - 1)) * range
    );
}

/** 가로축에 적을 라벨의 점 번호. 후보를 주면 다음 라벨과 겹치는 것을 빼고, 안 주면 처음 · 가운데 · 끝 */
export function dimensionLabelIndices(
    points: readonly { shortDimension: string }[],
    candidates: readonly number[] | undefined,
    xOf: (index: number) => number
) {
    return candidates
        ? candidates.filter((index, order) => {
              if (order === 0 || order === candidates.length - 1) return true;
              const next = candidates[order + 1];
              const labelWidth = points[index].shortDimension.length * 8;
              const nextWidth = points[next].shortDimension.length * 8;
              return xOf(next) - xOf(index) >= (labelWidth + nextWidth) / 2 + 8;
          })
        : points.length < 3
          ? points.map((_, index) => index)
          : [0, Math.floor((points.length - 1) / 2), points.length - 1];
}

/** 포인터 x 에 가장 가까운 점 번호. 점 간격이 고르지 않으면(byCoordinate) 하나씩 견주고, 고르면 비율로 구한다 */
export function nearestPointIndex(
    count: number,
    x: number,
    width: number,
    byCoordinate: boolean,
    xOf: (index: number) => number
) {
    if (byCoordinate) {
        let closest = 0;
        for (let index = 1; index < count; index++) {
            if (Math.abs(xOf(index) - x) < Math.abs(xOf(closest) - x))
                closest = index;
        }
        return closest;
    }
    return Math.max(
        0,
        Math.min(
            count - 1,
            Math.round(((x - 4) / Math.max(1, width - 8)) * (count - 1))
        )
    );
}
