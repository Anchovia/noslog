/**
 * 곡별 변박 기록 — 키는 악곡 index. 단계는 ノスしるべ · BEMANI wiki · 나무위키 공략 글에서 박자표 변화를 말한 문장으로 정했다:
 * 한 구간만(一部 · 一瞬 · 〜地帯) 적음, 여러 번 · 홀수 박자 구간 · 用語集 変拍子 収録曲 보통, 곡 내내 자주 많음.
 * 그 문서들에 변박 언급이 없는 곡은 없음(0)이고, 어느 문서도 읽지 않은 곡은 기록에 없다.
 * sources 는 단계를 정한 글(없음이면 읽은 곡 문서)이다.
 */
import record from "./meterRecord.json";
import type { MeterLevel } from "./patternMetrics";

const levels: Record<string, { level: number }> = record;

export function songMeterLevel(musicIndex: string): MeterLevel | null {
    return (levels[musicIndex]?.level as MeterLevel | undefined) ?? null;
}
