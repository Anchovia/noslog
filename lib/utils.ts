import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Tailwind className을 조건부로 합치고 충돌을 정리함
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// 숫자를 3자리마다 콤마를 찍어주는 함수
export function formatToComma(number: number | null): string {
    if (number) {
        return number.toLocaleString("ko-KR");
    } else {
        return "0";
    }
}

export function normalizeStoredGrade(
    grade: number | null | undefined
): number | null {
    return grade == null ? null : Math.round(grade / 100);
}

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
