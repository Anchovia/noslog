/**
 * 곡별 변박 기록 — 키는 악곡 index. 단계는 ノスしるべ · BEMANI wiki · 나무위키 공략 글에서 박자표 변화를 말한 문장으로 정했다:
 * 한 구간만(一部 · 一瞬 · 〜地帯) 적음, 여러 번 · 홀수 박자 구간 · 用語集 変拍子 収録曲 보통, 곡 내내 자주 많음.
 * 언급이 없다고 변박이 없는 것은 아니라(海神) 박자를 확인한 곡만 적고, 나머지는 기록에 없다.
 * sources 는 단계를 정한 글이나 확인한 사람이다.
 */
import record from "./meterRecord.json";
import type { MeterLevel } from "./patternMetrics";

const levels: Record<string, { level: number }> = record;

export function songMeterLevel(musicIndex: string): MeterLevel | null {
    return (levels[musicIndex]?.level as MeterLevel | undefined) ?? null;
}
