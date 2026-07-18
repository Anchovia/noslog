interface ScoreRecord {
    score: number;
}

// 시간순 기록에서 이전 최고점을 넘어선 베스트 갱신만 남김
export function selectScoreImprovements<T extends ScoreRecord>(records: T[]) {
    let bestScore = 0;

    return records.filter((record) => {
        if (record.score <= bestScore) return false;

        bestScore = record.score;
        return true;
    });
}

// ISO와 기존 플레이 날짜 문자열을 화면용 날짜로 통일함
export function formatScoreRecordDate(value: string) {
    return value
        .split("T")[0]
        .split(" ")[0]
        .replaceAll("-", ".")
        .replaceAll("/", ".");
}
