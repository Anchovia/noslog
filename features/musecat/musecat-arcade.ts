import type { PublicArcade } from "@/features/arcades/schemas/public-arcade-schema";

/**
 * NosLog 가 그리는 뮤즈캣 오락실(뮤즈캣 연동 A, 2026-10-20 「안 1」 — 뮤즈캣 구역 · 순서 + NosLog 부품).
 * `arcade` 는 지도 · 사진 · 길찾기 · 영업시간 부품이 그대로 쓰는 NosLog 모양이고, 나머지는 뮤즈캣에만 있는 구역이다.
 * 실제 뮤즈캣 응답 · mock 은 모두 이 모양으로 바꿔서 화면에 넘긴다(받는 쪽 번역 층).
 */
export type MusecatDisruption = "unplayable" | "major" | "bearable" | "minor";

export const MUSECAT_DISRUPTIONS: readonly MusecatDisruption[] = [
    "unplayable",
    "major",
    "bearable",
    "minor",
];

export interface MusecatFlag {
    id: string;
    /** 로그아웃 · 연결 안 함이면 뮤즈캣이 내용을 비워 준다 */
    disruption: MusecatDisruption | null;
    message: string | null;
    photoCount: number;
    author: string | null;
    createdAt: string;
    mine: boolean;
    canWithdraw: boolean;
    resolution: {
        fixedVoters: number;
        wrongVoters: number;
        resolveAt: string | null;
        myVote: "fixed" | "wrong" | null;
    } | null;
}

export interface MusecatPrice {
    label: string | null;
    amount: number | null;
    currency: string;
    text: string;
}

export interface MusecatGame {
    id: string;
    title: string;
    nostalgia: boolean;
    quantity: number;
    location: string | null;
    prices: MusecatPrice[];
    flags: MusecatFlag[];
    /** 버전 업데이트 캠페인 대상이면 그 캠페인 */
    campaign: { id: string; targetVersion: string } | null;
    /** 뮤즈캣 편집 충돌 방지용(PUT arcade/game base_state_id) */
    stateId: string | null;
}

export type MusecatFacilityState = "yes" | "no" | "unknown";

export interface MusecatFacility {
    key: string;
    state: MusecatFacilityState;
    note: string | null;
}

export interface MusecatNotice {
    id: string;
    kind: "notice" | "closure" | "issue" | "event";
    body: string;
    author: string | null;
    createdAt: string;
    until: string | null;
    link: string | null;
}

export interface MusecatSocial {
    type: string;
    name: string;
    link: string | null;
}

export interface MusecatArcade {
    musecatId: string;
    arcade: PublicArcade;
    closed: boolean;
    updatedAt: string | null;
    direction: string | null;
    subwayLines: string[];
    nicknames: string[];
    notices: MusecatNotice[];
    memo: string | null;
    games: MusecatGame[];
    social: MusecatSocial[];
    facilities: { interior: MusecatFacility[]; equipment: MusecatFacility[] };
    photoCredits: { author: string; takenAt: string | null }[];
    /** 「뮤즈캣에서 보기」 · 기여 · 역사 · 패스포트 */
    musecatUrl: string;
}

/** 뮤즈캣 영업시간(요일별 HHMM · 499 휴무 · null 모름) → NosLog 분 단위(월요일 0). 자정 넘김은 close 가 1440 을 넘는다 */
export function fromMusecatHours(
    hour: Partial<
        Record<
            | "Monday"
            | "Tuesday"
            | "Wednesday"
            | "Thursday"
            | "Friday"
            | "Saturday"
            | "Sunday",
            number | { start: number; end: number } | null
        >
    > | null
): PublicArcade["hours"] {
    if (!hour) return null;
    const days = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
    ] as const;
    const toMinutes = (hhmm: number) =>
        Math.floor(hhmm / 100) * 60 + (hhmm % 100);
    const weekly: NonNullable<PublicArcade["hours"]>["weekly"] = {};
    days.forEach((day, index) => {
        const value = hour[day];
        const key = String(index) as keyof typeof weekly;
        if (value === undefined || value === null) return;
        if (typeof value === "number") {
            if (value === 499) weekly[key] = null;
            return;
        }
        const open = toMinutes(value.start);
        let close = toMinutes(value.end);
        if (close <= open) close += 1440;
        weekly[key] = { open, close };
    });
    if (Object.keys(weekly).length === 0) return null;
    return { weekly, exceptions: {} };
}
