export function normalizeStoredGrade(
    grade: number | null | undefined
): number | null {
    return grade == null ? null : Math.round(grade / 100);
}
