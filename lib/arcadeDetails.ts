export const ARCADE_MACHINE_STATUSES = [
    { value: "unknown", label: "미확인" },
    { value: "good", label: "양호" },
    { value: "normal", label: "보통" },
    { value: "caution", label: "주의" },
    { value: "unavailable", label: "이용 불가" },
] as const;

export const ARCADE_WEEKDAYS = [
    { key: "monday", label: "월" },
    { key: "tuesday", label: "화" },
    { key: "wednesday", label: "수" },
    { key: "thursday", label: "목" },
    { key: "friday", label: "금" },
    { key: "saturday", label: "토" },
    { key: "sunday", label: "일" },
] as const;

export type ArcadeWeekday = (typeof ARCADE_WEEKDAYS)[number]["key"];

export interface ArcadeBusinessHours {
    weekly: Partial<Record<ArcadeWeekday, { open: string; close: string }>>;
    openEveryDay: boolean;
    legacyNote?: string;
}

const timePattern = /^(?:[01]\d|2[0-3]):[0-5]\d$/;

export function normalizeArcadeBusinessHours(
    value: unknown
): ArcadeBusinessHours | null {
    if (!value || typeof value !== "object" || Array.isArray(value)) {
        return null;
    }

    const source = value as Record<string, unknown>;
    const weeklySource =
        source.weekly &&
        typeof source.weekly === "object" &&
        !Array.isArray(source.weekly)
            ? (source.weekly as Record<string, unknown>)
            : {};
    const weekly: ArcadeBusinessHours["weekly"] = {};

    ARCADE_WEEKDAYS.forEach(({ key }) => {
        const schedule = weeklySource[key];
        if (
            !schedule ||
            typeof schedule !== "object" ||
            Array.isArray(schedule)
        ) {
            return;
        }
        const { open, close } = schedule as Record<string, unknown>;
        if (
            typeof open === "string" &&
            typeof close === "string" &&
            timePattern.test(open) &&
            timePattern.test(close)
        ) {
            weekly[key] = { open, close };
        }
    });

    const legacyNote =
        typeof source.legacyNote === "string" ? source.legacyNote : undefined;
    if (
        Object.keys(weekly).length === 0 &&
        !legacyNote &&
        source.openEveryDay !== true
    ) {
        return null;
    }

    return {
        weekly,
        openEveryDay: source.openEveryDay === true,
        ...(legacyNote ? { legacyNote } : {}),
    };
}

// 기체 한 대의 가동·상태 — 공개 기체 행(ArcadeCabinet)과 같은 값
export const ARCADE_CABINET_AVAILABILITIES = [
    { value: "unknown", label: "미확인" },
    { value: "available", label: "가동" },
    { value: "unavailable", label: "이용 불가" },
] as const;

export const ARCADE_CABINET_CONDITIONS = [
    { value: "unknown", label: "미확인" },
    { value: "good", label: "양호" },
    { value: "normal", label: "보통" },
    { value: "caution", label: "주의" },
] as const;

const MINUTES_PER_DAY = 24 * 60;

interface PublicHoursInterval {
    open: number;
    close: number;
}

// 공개 영업시간의 요일 칸 — 월요일 "0" · 분 단위. null 은 휴무, 키가 없으면 미확인
export type PublicArcadeWeekly = Partial<
    Record<string, PublicHoursInterval | null>
>;

function minutesFromTime(time: string) {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
}

function timeFromMinutes(value: number) {
    const minutes = value % MINUTES_PER_DAY;
    return `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
}

// 관리자 요일 입력 → 공개 영업시간. 종료가 시작보다 이르거나 같으면 다음 날로 넘기고,
// 체크하지 않은 요일은 휴무로 적는다. 체크한 요일이 하나도 없으면 미확인(null)
export function toPublicArcadeWeekly(
    weekly: ArcadeBusinessHours["weekly"]
): Record<string, PublicHoursInterval | null> | null {
    if (Object.keys(weekly).length === 0) return null;
    return Object.fromEntries(
        ARCADE_WEEKDAYS.map(({ key }, index) => {
            const day = weekly[key];
            if (!day) return [String(index), null];
            const open = minutesFromTime(day.open);
            const close = minutesFromTime(day.close);
            return [
                String(index),
                {
                    open,
                    close: close <= open ? close + MINUTES_PER_DAY : close,
                },
            ];
        })
    );
}

// 공개 영업시간 → 관리자 요일 입력. 휴무·미확인 요일은 체크 해제로 돌아온다
export function fromPublicArcadeWeekly(
    weekly: PublicArcadeWeekly
): ArcadeBusinessHours["weekly"] {
    const result: ArcadeBusinessHours["weekly"] = {};
    ARCADE_WEEKDAYS.forEach(({ key }, index) => {
        const day = weekly[String(index)];
        if (day)
            result[key] = {
                open: timeFromMinutes(day.open),
                close: timeFromMinutes(day.close),
            };
    });
    return result;
}

// DB 에 저장된 공개 영업시간 JSON 에서 요일 칸만 읽는다. 읽을 칸이 없으면 null
export function readPublicArcadeWeekly(
    value: unknown
): PublicArcadeWeekly | null {
    if (!value || typeof value !== "object" || Array.isArray(value))
        return null;
    const weekly = (value as { weekly?: unknown }).weekly;
    if (!weekly || typeof weekly !== "object" || Array.isArray(weekly))
        return null;
    const result: PublicArcadeWeekly = {};
    for (const [key, day] of Object.entries(weekly)) {
        if (!/^[0-6]$/.test(key)) continue;
        if (day === null) {
            result[key] = null;
            continue;
        }
        const interval = day as Partial<PublicHoursInterval> | undefined;
        if (
            typeof interval?.open === "number" &&
            typeof interval.close === "number"
        )
            result[key] = { open: interval.open, close: interval.close };
    }
    return Object.keys(result).length > 0 ? result : null;
}

export type ArcadeMachineStatus =
    (typeof ARCADE_MACHINE_STATUSES)[number]["value"];

export function isArcadeMachineStatus(
    value: string
): value is ArcadeMachineStatus {
    return ARCADE_MACHINE_STATUSES.some((status) => status.value === value);
}

export const ARCADE_MACHINE_STATUS_META: Record<
    ArcadeMachineStatus,
    { label: string; className: string }
> = {
    unknown: {
        label: "미확인",
        className: "bg-divider text-text-secondary",
    },
    good: { label: "양호", className: "bg-success/15 text-success" },
    normal: { label: "보통", className: "bg-chart/15 text-chart" },
    caution: { label: "주의", className: "bg-score/15 text-score" },
    unavailable: {
        label: "이용 불가",
        className: "bg-danger/15 text-danger",
    },
};
