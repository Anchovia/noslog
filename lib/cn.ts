import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// tailwind-theme.css 의 선 두께 별칭은 tailwind-merge 기본 설정이 색으로 읽어 색 class 와 함께 쓰면 지운다
const strokeWidths = ["nl-stroke", "nl-stroke-strong"];

const twMerge = extendTailwindMerge({
    extend: {
        classGroups: {
            "border-w": [{ border: strokeWidths }],
            "border-w-x": [{ "border-x": strokeWidths }],
            "border-w-y": [{ "border-y": strokeWidths }],
            "border-w-s": [{ "border-s": strokeWidths }],
            "border-w-e": [{ "border-e": strokeWidths }],
            "border-w-bs": [{ "border-bs": strokeWidths }],
            "border-w-be": [{ "border-be": strokeWidths }],
            "border-w-t": [{ "border-t": strokeWidths }],
            "border-w-r": [{ "border-r": strokeWidths }],
            "border-w-b": [{ "border-b": strokeWidths }],
            "border-w-l": [{ "border-l": strokeWidths }],
            "ring-w": [{ ring: strokeWidths }],
            "outline-w": [{ outline: strokeWidths }],
        },
    },
});

// Tailwind className을 조건부로 합치고 충돌을 정리함
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}
