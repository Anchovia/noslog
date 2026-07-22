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
