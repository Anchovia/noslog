import {
    type MeterLevel,
    PATTERN_STRENGTH_AXES,
    type PatternMetrics,
    patternReference,
    patternStrength,
    type PatternStrengthAxis,
} from "@/lib/chart-pattern/patternMetrics";

/** 항목별 세기 0–1(100% = 기준 안 상위 1% 중앙값). null = 계산할 수 없음 */
export type PatternStrengths = Record<PatternStrengthAxis, number | null>;

export interface PatternTendency {
    /** 같은 난이도 공개 채보 기준 */
    difficulty: PatternStrengths;
    /** 모든 공개 채보 기준 */
    all: PatternStrengths;
    /** 변박 단계 — 기준과 상관없이 같다. null = 기록 없음 */
    meter: MeterLevel | null;
    /** 채보 정보 줄 — 변속 횟수와 노트 종류별 개수. 기준과 상관없이 같다 */
    tempoChanges: number;
    tenutoCount: number;
    glissandoCount: number;
    trillCount: number;
}

export interface PatternMetricRow extends PatternMetrics {
    chartId: number;
    difficulty: string;
}

/** 그 채보의 원점수를 같은 난이도 · 전곡 두 기준으로 바꾼다 — 원점수가 없으면(공개 채보 없음) null */
export function buildPatternTendency(
    rows: PatternMetricRow[],
    chartId: number
): PatternTendency | null {
    const row = rows.find((candidate) => candidate.chartId === chartId);
    if (!row) return null;
    const strengths = (peers: PatternMetricRow[]) =>
        Object.fromEntries(
            PATTERN_STRENGTH_AXES.map((axis) => [
                axis,
                patternStrength(
                    row[axis],
                    patternReference(peers.map((peer) => peer[axis]))
                ),
            ])
        ) as PatternStrengths;
    return {
        difficulty: strengths(
            rows.filter((peer) => peer.difficulty === row.difficulty)
        ),
        all: strengths(rows),
        meter: row.chords,
        tempoChanges: row.tempoChanges,
        tenutoCount: row.tenutoCount,
        glissandoCount: row.glissandoCount,
        trillCount: row.trillCount,
    };
}
