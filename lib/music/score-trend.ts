interface ScoreRecord {
    score: number;
}

interface JudgementRecord {
    judge_sjust: number | null;
    judge_just: number | null;
    judge_good: number | null;
    judge_miss: number | null;
    judge_near: number | null;
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

export function formatTrendTooltipDate(value: string) {
    const normalized = value.replace("T", " ");
    const [date, time] = normalized.split(" ");
    const formattedDate = formatScoreRecordDate(date);

    return time ? `${formattedDate} ${time.slice(0, 5)}` : formattedDate;
}

// 최근 판정 추이 MISS — NEAR 는 거의 켜지 않는 옵션이라 뺀다(2026-09-18)
export function getMissCount(record: Pick<JudgementRecord, "judge_miss">) {
    return record.judge_miss;
}

export function getSJustRate(record: JudgementRecord) {
    const judgements = [
        record.judge_sjust,
        record.judge_just,
        record.judge_good,
        record.judge_miss,
        record.judge_near,
    ];

    if (judgements.some((value) => value === null)) {
        return null;
    }

    const total = judgements.reduce<number>(
        (sum, value) => sum + (value ?? 0),
        0
    );
    if (total === 0) return null;

    return Number((((record.judge_sjust ?? 0) / total) * 100).toFixed(1));
}

/**
 * 플레이 시각(「YYYY-MM-DD…」, 기기 현지 날짜 기준)을 「오늘 · 어제 · N일 전」으로.
 * 그래프 툴팁 아래 줄 — osu! 처럼 날짜 대신 경과 일수만 (2026-09-17)
 */
export function formatDaysAgo(
    playTime: string,
    locale: string,
    now = new Date()
) {
    const [year, month, day] = playTime.slice(0, 10).split(/[-/.]/).map(Number);
    const days = Math.round(
        (Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) -
            Date.UTC(year, month - 1, day)) /
            86_400_000
    );
    return new Intl.RelativeTimeFormat(locale, { numeric: "auto" }).format(
        -Math.max(0, days),
        "day"
    );
}
