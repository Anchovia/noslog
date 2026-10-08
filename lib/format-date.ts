// 날짜 전용 필드를 한국 날짜 기준의 input 값으로 변환함
export function formatDateInput(date: Date | null | undefined): string {
    if (!date) return "";

    const parts = new Intl.DateTimeFormat("en-US", {
        timeZone: "Asia/Seoul",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).formatToParts(date);
    const values = Object.fromEntries(
        parts.map((part) => [part.type, part.value])
    );

    return `${values.year}-${values.month}-${values.day}`;
}
