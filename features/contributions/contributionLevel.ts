/**
 * 기여 등급(2026-09-23 N1) — 반영 · 처리된 기여의 점수 합으로 Lv.1–6. 권한은 열지 않는 보상 라벨.
 * 점수: 곡 정보 반영 · 오락실 제보 처리 · 기체 확인(하루) 각 1점. 숫자는 운영하며 바꿀 수 있다.
 */
export const CONTRIBUTION_LEVEL_THRESHOLDS = [
    1, 10, 30, 100, 300, 1000,
] as const;

/** 이름 옆(랭킹 · 의견)에는 이 등급부터 — 막 시작한 사람까지 붙이면 소음(Google 지역 가이드 레벨 4 방식) */
export const CONTRIBUTION_NAME_MIN_LEVEL = 3;

export const CONTRIBUTION_KINDS = [
    "chart_field",
    "arcade_report",
    "cabinet_check",
] as const;
export type ContributionKind = (typeof CONTRIBUTION_KINDS)[number];

/** 한 사람의 기여 점수 합과 종류별 반영 수 */
export type ContributionTotals = Record<ContributionKind, number> & {
    points: number;
};

export interface ContributionLevel {
    /** 0 = 아직 기여 없음 */
    level: number;
    points: number;
    /** 다음 등급 기준 점수 — 마지막 등급이면 null */
    next: number | null;
    /** 지금 등급 시작 점수 — 진행 막대의 왼쪽 끝 */
    floor: number;
}

export function contributionLevel(points: number): ContributionLevel {
    const safe = Math.max(0, Math.floor(points));
    let level = 0;
    for (const threshold of CONTRIBUTION_LEVEL_THRESHOLDS) {
        if (safe >= threshold) level += 1;
    }
    return {
        level,
        points: safe,
        next: CONTRIBUTION_LEVEL_THRESHOLDS[level] ?? null,
        floor: level ? CONTRIBUTION_LEVEL_THRESHOLDS[level - 1] : 0,
    };
}

/** 진행 막대 0–1 — 지금 등급 시작에서 다음 등급까지 */
export function contributionProgress(value: ContributionLevel) {
    if (value.next === null) return 1;
    return Math.min(
        1,
        Math.max(0, (value.points - value.floor) / (value.next - value.floor))
    );
}

/** 이름 옆 라벨 — 운영자는 역할, 그 밖에는 기준 등급 이상일 때만 */
export type NameLabel =
    { kind: "operator" } | { kind: "level"; level: number; points: number };

export function nameLabelFor(
    role: string | null | undefined,
    points: number,
    minLevel = CONTRIBUTION_NAME_MIN_LEVEL
): NameLabel | null {
    if (role === "admin") return { kind: "operator" };
    const value = contributionLevel(points);
    return value.level >= minLevel
        ? { kind: "level", level: value.level, points: value.points }
        : null;
}

/** 기체 확인 적립 키 — 서울 날짜 하루 1점 */
export function seoulDateKey(date: Date) {
    return new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Seoul",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).format(date);
}
