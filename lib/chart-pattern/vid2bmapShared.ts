export const FIRST_NOTE_EARLY_BEATS = 0.1;

export function median(values: number[]) {
    const sorted = [...values].sort((a, b) => a - b);
    return sorted[Math.floor(sorted.length / 2)];
}

export function mean(values: number[]): number {
    return values.reduce((sum, value) => sum + value, 0) / values.length;
}
