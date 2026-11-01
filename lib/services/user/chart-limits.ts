import db from "@/lib/db";
import { getMaxBasicGrade } from "@/lib/music/max-grade";

type Difficulty = Parameters<typeof getMaxBasicGrade>[2];

type ChartLimit = { noteCount: number | null; levelConstant: number | null };

/** 「곡 index:난이도」 → 노트 수 · 상수. 모르는 값은 null 이고 그 검사는 건너뛴다 */
export type ChartLimitMap = Map<string, ChartLimit>;

export type SyncedChartValues = {
    difficulty: Difficulty;
    judge: [number, number, number, number, number];
    maxCombo: number;
    gradeBasic: number;
    // 최근 플레이에는 없고 전체 기록에만 있다
    gradeRecital?: number;
};

// Recital 최대 Grd 식은 확인되지 않았다. 운영 기록 11,751건에서 Basic 최대의 1.181배까지 나와 여유를 두고 잡는다
const RECITAL_GRADE_LIMIT_RATIO = 1.25;

export async function loadChartLimits(): Promise<ChartLimitMap> {
    const charts = await db.musicChart.findMany({
        select: {
            musicIdx: true,
            difficulty: true,
            noteCount: true,
            levelConstant: true,
        },
    });
    return new Map(
        charts.map((chart) => [
            `${chart.musicIdx}:${chart.difficulty}`,
            {
                noteCount: chart.noteCount ?? null,
                levelConstant: chart.levelConstant ?? null,
            },
        ])
    );
}

// 북마클릿이 보내는 값은 사용자가 꾸밀 수 있다. 그 채보로 낼 수 없는 값이면 그 줄을 저장하지 않는다.
// 판정이 모두 0 인 줄은 플레이하지 않은 채보라 판정 합은 보지 않는다
export function isWithinChartLimits(
    limit: ChartLimit | undefined,
    values: SyncedChartValues
) {
    if (!limit) return true;
    const { noteCount, levelConstant } = limit;
    if (noteCount != null) {
        const judged = values.judge.reduce((sum, count) => sum + count, 0);
        if (judged !== 0 && judged !== noteCount) return false;
        if (values.maxCombo > noteCount) return false;
    }
    const maxGrade = getMaxBasicGrade(
        levelConstant,
        noteCount,
        values.difficulty
    );
    if (maxGrade == null) return true;
    return (
        values.gradeBasic <= maxGrade &&
        (values.gradeRecital ?? 0) <= maxGrade * RECITAL_GRADE_LIMIT_RATIO
    );
}
