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

export function formatToGrade(grade: number | null): string {
    if (grade) {
        return (grade / 100).toFixed(0);
    } else {
        return "0";
    }
}

export default function formatToTimeAgo(date: string): string {
    const dayInMs = 1000 * 60 * 60 * 24;
    const time = new Date(date).getTime();
    const now = new Date().getTime();
    const diff = Math.round((time - now) / dayInMs);

    const formatter = new Intl.RelativeTimeFormat("ko-KR");

    return formatter.format(diff, "day");
}
