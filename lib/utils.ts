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
