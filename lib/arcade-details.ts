export const ARCADE_WEEKDAYS = [
    { key: "monday", label: "월" },
    { key: "tuesday", label: "화" },
    { key: "wednesday", label: "수" },
    { key: "thursday", label: "목" },
    { key: "friday", label: "금" },
    { key: "saturday", label: "토" },
    { key: "sunday", label: "일" },
] as const;

type ArcadeWeekday = (typeof ARCADE_WEEKDAYS)[number]["key"];

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

/**
 * 기체 태그 · 오락실 시설 · 기체 특징(2026-09-22 사용자 결정 T2 · B2 · V2).
 * 있다 / 없다로 말하는 것 = 태그 · 시설(아이콘 + 글자), 정도로 말하는 것 = 특징(정해진 보기 3단계).
 * 값(value)은 DB 에 저장되는 키 — 화면 글자는 번역(arcades.cabinetTag.* · arcades.facility.* · arcades.feature.*), label 은 관리자 화면용
 */
export const ARCADE_CABINET_TAGS = [
    { value: "broadcast", label: "방송기체" },
    { value: "headphone", label: "헤드폰 단자" },
    { value: "seat", label: "의자 있음" },
    { value: "card_payment", label: "카드 결제" },
] as const;

export const ARCADE_FACILITIES = [
    { value: "parking", label: "주차" },
    { value: "smoking", label: "흡연실" },
    { value: "wifi", label: "와이파이" },
    { value: "restroom", label: "화장실" },
    { value: "card_sales", label: "카드 판매" },
    { value: "locker", label: "보관함" },
] as const;

export const ARCADE_CABINET_FEATURES = [
    {
        key: "keyWeight",
        label: "건반 무게",
        options: [
            { value: "light", label: "가벼움" },
            { value: "normal", label: "보통" },
            { value: "heavy", label: "무거움" },
        ],
    },
    {
        key: "screenLag",
        label: "화면 지연",
        options: [
            { value: "low", label: "적음" },
            { value: "normal", label: "보통" },
            { value: "high", label: "큼" },
        ],
    },
    {
        key: "soundVolume",
        label: "소리 크기",
        options: [
            { value: "low", label: "작음" },
            { value: "normal", label: "보통" },
            { value: "high", label: "큼" },
        ],
    },
] as const;

export type ArcadeCabinetTag = (typeof ARCADE_CABINET_TAGS)[number]["value"];
export type ArcadeFacility = (typeof ARCADE_FACILITIES)[number]["value"];
export type ArcadeCabinetFeatureKey =
    (typeof ARCADE_CABINET_FEATURES)[number]["key"];

export const ARCADE_CABINET_FEATURE_NOTE_MAX_LENGTH = 100;

/** 저장된 목록에서 아는 값만, 정해진 순서로(모르는 옛 값 · 중복은 버림) */
export function knownArcadeValues<T extends string>(
    options: readonly { value: T }[],
    values: readonly string[] | null | undefined
): T[] {
    const set = new Set(values ?? []);
    return options
        .map((option) => option.value)
        .filter((value) => set.has(value));
}

/** 특징 한 칸 — 그 항목의 보기에 없는 값(옛 값 · 빈 값)은 null */
export function knownFeatureValue(
    key: ArcadeCabinetFeatureKey,
    value: string | null | undefined
): string | null {
    const feature = ARCADE_CABINET_FEATURES.find((item) => item.key === key);
    return feature?.options.some((option) => option.value === value)
        ? (value as string)
        : null;
}

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

// 관리자 시각 입력(HH:MM) → 공개 영업시간 한 칸(분). 종료가 시작보다 이르거나 같으면 다음 날로 넘긴다
export function toPublicArcadeInterval(
    open: string,
    close: string
): PublicHoursInterval {
    const start = minutesFromTime(open);
    const end = minutesFromTime(close);
    return { open: start, close: end <= start ? end + MINUTES_PER_DAY : end };
}

// 관리자 요일 입력 → 공개 영업시간. 체크하지 않은 요일은 휴무로 적는다. 체크한 요일이 하나도 없으면 미확인(null)
export function toPublicArcadeWeekly(
    weekly: ArcadeBusinessHours["weekly"]
): Record<string, PublicHoursInterval | null> | null {
    if (Object.keys(weekly).length === 0) return null;
    return Object.fromEntries(
        ARCADE_WEEKDAYS.map(({ key }, index) => {
            const day = weekly[key];
            return [
                String(index),
                day ? toPublicArcadeInterval(day.open, day.close) : null,
            ];
        })
    );
}

// 옛 영업시간(요일 이름 · HH:MM) → 공개 영업시간. 적힌 요일만 옮기고 없는 요일은 미확인으로 둔다.
// 옮길 요일이 하나도 없으면 null
export function legacyToPublicArcadeHours(value: unknown) {
    const legacy = normalizeArcadeBusinessHours(value);
    if (!legacy) return null;
    const weekly: Record<string, PublicHoursInterval> = {};
    ARCADE_WEEKDAYS.forEach(({ key }, index) => {
        const day = legacy.weekly[key];
        if (day)
            weekly[String(index)] = toPublicArcadeInterval(day.open, day.close);
    });
    return Object.keys(weekly).length > 0 ? { weekly, exceptions: {} } : null;
}

// 날짜별 예외 한 줄 — 관리자 입력 형식. closed 면 그날 휴무, 아니면 open–close 영업
export interface ArcadeHoursExceptionInput {
    date: string;
    closed: boolean;
    open: string;
    close: string;
}

// DB 에 저장된 공개 영업시간 JSON 의 날짜별 예외 → 관리자 입력 줄(날짜순)
export function readPublicArcadeExceptions(
    value: unknown
): ArcadeHoursExceptionInput[] {
    if (!value || typeof value !== "object" || Array.isArray(value)) return [];
    const exceptions = (value as { exceptions?: unknown }).exceptions;
    if (
        !exceptions ||
        typeof exceptions !== "object" ||
        Array.isArray(exceptions)
    )
        return [];
    const rows: ArcadeHoursExceptionInput[] = [];
    for (const [date, day] of Object.entries(exceptions)) {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) continue;
        if (day === null) {
            rows.push({ date, closed: true, open: "10:00", close: "00:00" });
            continue;
        }
        const interval = day as Partial<PublicHoursInterval> | undefined;
        if (
            typeof interval?.open === "number" &&
            typeof interval.close === "number"
        )
            rows.push({
                date,
                closed: false,
                open: timeFromMinutes(interval.open),
                close: timeFromMinutes(interval.close),
            });
    }
    return rows.sort((a, b) => a.date.localeCompare(b.date));
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
