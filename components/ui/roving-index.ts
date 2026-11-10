export function rovingIndex(
    key: string,
    direction: number,
    current: number,
    count: number
): number | null {
    if (!direction && key !== "Home" && key !== "End") return null;
    return key === "Home"
        ? 0
        : key === "End"
          ? count - 1
          : (current + direction + count) % count;
}
