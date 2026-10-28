import { PATTERN_AXES } from "@/features/music/schemas/community-schema";
import {
    type PatternMetrics,
    patternReference,
    patternStrength,
} from "@/lib/chart-pattern/patternMetrics";

export type PatternAxis = (typeof PATTERN_AXES)[number];
/** 항목별 세기 0–1(100% = 기준 안 상위 1% 중앙값). null = 계산할 수 없음 */
export type PatternStrengths = Record<PatternAxis, number | null>;

export interface PatternTendency {
    /** 같은 난이도 공개 채보 기준 */
    difficulty: PatternStrengths;
    /** 모든 공개 채보 기준 */
    all: PatternStrengths;
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
            PATTERN_AXES.map((axis) => [
                axis,
                patternStrength(
                    row[axis],
                    patternReference(
                        peers
                            .map((peer) => peer[axis])
                            .filter((value) => value !== null)
                    )
                ),
            ])
        ) as PatternStrengths;
    return {
        difficulty: strengths(
            rows.filter((peer) => peer.difficulty === row.difficulty)
        ),
        all: strengths(rows),
    };
}
