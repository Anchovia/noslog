import { existsSync } from "fs";
import path from "path";

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

// public 폴더에 이미지가 존재하는지 확인하는 함수
export function getPublic(idx: string) {
    // 이미지 path 생성
    const imagePath = path.join(process.cwd(), "public", "bg", `${idx}.png`);
    // existsSync로 이미지 존재 여부 확인
    if (existsSync(imagePath)) {
        return `url(/bg/${idx}.png)`;
    } else {
        return `url(https://p.eagate.573.jp/game/nostalgia/op3/img/jacket.html?c=${idx})`;
    }
}
