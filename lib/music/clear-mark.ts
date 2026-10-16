// 클리어 마크 판정 한 곳(2026-10-16 D8 · N5) — 화면 · 서버 · 내보내기 이미지가 같은 식을 쓴다.
// fc_type 은 공식 램프(2026-10-16 K1): 0 없음 · 1 NEAR 섞인 풀콤보(노란 F, FC 로 세지 않음) · 2 풀콤보 · 3 Perfect.
// SQL 로 세는 곳(업적 집계 · 탐색 필터)은 같은 식을 SQL 로 쓴다.

/** Pianist — Perfect 램프이거나 100만 점 */
export function isPianist(fcType: number, score: number) {
    return fcType === 3 || score >= 1_000_000;
}

/** 풀콤보 램프(무지개 F 이상). NEAR 섞인 풀콤보(1)는 세지 않는다 */
export function hasFullComboLamp(fcType: number) {
    return fcType >= 2;
}
