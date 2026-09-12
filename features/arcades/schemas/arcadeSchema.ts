import { z } from "zod";

import {
    ARCADE_CABINET_AVAILABILITIES,
    ARCADE_CABINET_CONDITIONS,
    ARCADE_WEEKDAYS,
    fromPublicArcadeWeekly,
    normalizeArcadeBusinessHours,
    readPublicArcadeWeekly,
    type ArcadeBusinessHours,
} from "@/lib/arcadeDetails";
import {
    ARCADE_REGIONS,
    inferLegacyArcadeRegion,
    isArcadeRegion,
} from "@/lib/arcadeRegions";

export const ARCADE_NAME_MAX_LENGTH = 80;
export const ARCADE_ADDRESS_MAX_LENGTH = 160;
export const ARCADE_NOTES_MAX_LENGTH = 500;
export const ARCADE_CABINET_MAX = 20;
export const ARCADE_CABINET_LABEL_MAX_LENGTH = 40;
export const ARCADE_CABINET_NOTE_MAX_LENGTH = 200;

const timePattern = /^(?:[01]\d|2[0-3]):[0-5]\d$/;
const integerPattern = /^\d+$/;
const availabilityValues = ARCADE_CABINET_AVAILABILITIES.map(
    ({ value }) => value
) as [
    (typeof ARCADE_CABINET_AVAILABILITIES)[number]["value"],
    ...(typeof ARCADE_CABINET_AVAILABILITIES)[number]["value"][],
];
const conditionValues = ARCADE_CABINET_CONDITIONS.map(({ value }) => value) as [
    (typeof ARCADE_CABINET_CONDITIONS)[number]["value"],
    ...(typeof ARCADE_CABINET_CONDITIONS)[number]["value"][],
];

const optionalIntegerTextSchema = (
    errorLabel: string,
    minimum: number,
    maximum: number
) =>
    z
        .string()
        .trim()
        .refine(
            (value) =>
                value === "" ||
                (integerPattern.test(value) &&
                    Number(value) >= minimum &&
                    Number(value) <= maximum),
            `${errorLabel} ${minimum}~${maximum} 사이의 정수로 입력해주세요.`
        )
        .transform((value) => (value === "" ? null : Number(value)));

const dayHoursSchema = z.object({
    enabled: z.boolean(),
    open: z.string(),
    close: z.string(),
});

const businessHoursSchema = z.object({
    monday: dayHoursSchema,
    tuesday: dayHoursSchema,
    wednesday: dayHoursSchema,
    thursday: dayHoursSchema,
    friday: dayHoursSchema,
    saturday: dayHoursSchema,
    sunday: dayHoursSchema,
});

// 기체 한 줄 — 공개 기체 행과 같은 규칙: 상태(양호·보통·주의)는 가동일 때만 남기고, 보통·주의는 메모 필수
const cabinetSchema = z
    .object({
        cabinetId: z
            .string()
            .trim()
            .refine(
                (value) => value === "" || integerPattern.test(value),
                "잘못된 기체입니다."
            )
            .transform((value) => (value === "" ? null : Number(value))),
        label: z
            .string()
            .trim()
            .max(
                ARCADE_CABINET_LABEL_MAX_LENGTH,
                `기체 이름은 ${ARCADE_CABINET_LABEL_MAX_LENGTH}자 이하로 입력해주세요.`
            )
            .transform((value) => value || null),
        note: z
            .string()
            .trim()
            .max(
                ARCADE_CABINET_NOTE_MAX_LENGTH,
                `기체 메모는 ${ARCADE_CABINET_NOTE_MAX_LENGTH}자 이하로 입력해주세요.`
            )
            .transform((value) => value || null),
        availability: z.enum(availabilityValues, {
            error: "가동 여부를 선택해주세요.",
        }),
        condition: z.enum(conditionValues, {
            error: "기체 상태를 선택해주세요.",
        }),
        confirm: z.boolean(),
    })
    .superRefine((cabinet, context) => {
        if (
            cabinet.availability === "available" &&
            (cabinet.condition === "normal" ||
                cabinet.condition === "caution") &&
            !cabinet.note
        ) {
            context.addIssue({
                code: "custom",
                path: ["note"],
                message: "보통·주의 상태는 메모에 이유를 적어주세요.",
            });
        }
    })
    .transform((cabinet) => ({
        ...cabinet,
        condition:
            cabinet.availability === "available"
                ? cabinet.condition
                : ("unknown" as const),
    }));

const arcadeBaseSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, "오락실 이름을 입력해주세요.")
        .max(
            ARCADE_NAME_MAX_LENGTH,
            `오락실 이름은 ${ARCADE_NAME_MAX_LENGTH}자 이하로 입력해주세요.`
        ),
    region: z
        .string()
        .refine(isArcadeRegion, "지역을 선택해주세요.")
        .transform((value) =>
            isArcadeRegion(value) ? value : ARCADE_REGIONS[0]
        ),
    address: z
        .string()
        .trim()
        .min(1, "주소를 입력해주세요.")
        .max(
            ARCADE_ADDRESS_MAX_LENGTH,
            `주소는 ${ARCADE_ADDRESS_MAX_LENGTH}자 이하로 입력해주세요.`
        ),
    latitude: z.string().trim(),
    longitude: z.string().trim(),
    playPrice: optionalIntegerTextSchema("플레이 요금은", 1, 100000),
    coinCount: optionalIntegerTextSchema("코인 수는", 1, 100),
    businessHours: businessHoursSchema,
    hoursConfirmed: z.boolean(),
    cabinets: z
        .array(cabinetSchema, { error: "기체 정보를 확인해주세요." })
        .max(
            ARCADE_CABINET_MAX,
            `기체는 ${ARCADE_CABINET_MAX}대까지 등록할 수 있습니다.`
        ),
    notes: z
        .string()
        .trim()
        .max(
            ARCADE_NOTES_MAX_LENGTH,
            `비고는 ${ARCADE_NOTES_MAX_LENGTH}자 이하로 입력해주세요.`
        )
        .transform((value) => value || null),
    isActive: z.boolean(),
});

type ArcadeBaseInput = z.output<typeof arcadeBaseSchema>;

function validateArcadeInput(data: ArcadeBaseInput, context: z.RefinementCtx) {
    const hasLatitude = data.latitude !== "";
    const hasLongitude = data.longitude !== "";
    if (hasLatitude !== hasLongitude) {
        const message = "위도와 경도를 함께 입력해주세요.";
        context.addIssue({
            code: "custom",
            path: ["latitude"],
            message,
        });
        context.addIssue({
            code: "custom",
            path: ["longitude"],
            message,
        });
    } else if (hasLatitude && hasLongitude) {
        const latitude = Number(data.latitude);
        const longitude = Number(data.longitude);
        if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90) {
            context.addIssue({
                code: "custom",
                path: ["latitude"],
                message: "위도는 -90~90 사이의 숫자여야 합니다.",
            });
        }
        if (
            !Number.isFinite(longitude) ||
            longitude < -180 ||
            longitude > 180
        ) {
            context.addIssue({
                code: "custom",
                path: ["longitude"],
                message: "경도는 -180~180 사이의 숫자여야 합니다.",
            });
        }
    }

    if ((data.playPrice === null) !== (data.coinCount === null)) {
        const message = "플레이 요금과 코인 수를 함께 입력해주세요.";
        context.addIssue({
            code: "custom",
            path: ["playPrice"],
            message,
        });
        context.addIssue({
            code: "custom",
            path: ["coinCount"],
            message,
        });
    }

    for (const { key, label } of ARCADE_WEEKDAYS) {
        const day = data.businessHours[key];
        if (!day.enabled) continue;
        if (!timePattern.test(day.open)) {
            context.addIssue({
                code: "custom",
                path: ["businessHours", key, "open"],
                message: `${label}요일 영업 시작 시간을 확인해주세요.`,
            });
        }
        if (!timePattern.test(day.close)) {
            context.addIssue({
                code: "custom",
                path: ["businessHours", key, "close"],
                message: `${label}요일 영업 종료 시간을 확인해주세요.`,
            });
        }
    }
}

function normalizeArcadeInput(data: ArcadeBaseInput) {
    const weekly: ArcadeBusinessHours["weekly"] = {};
    for (const { key } of ARCADE_WEEKDAYS) {
        const day = data.businessHours[key];
        if (day.enabled) weekly[key] = { open: day.open, close: day.close };
    }

    const enabledDays = Object.keys(weekly).length;
    return {
        ...data,
        latitude: data.latitude === "" ? null : Number(data.latitude),
        longitude: data.longitude === "" ? null : Number(data.longitude),
        // 옛 영업시간 칸도 같은 입력으로 계속 채운다(연중무휴 = 일곱 요일 모두 영업)
        businessHours:
            enabledDays > 0
                ? {
                      weekly,
                      openEveryDay: enabledDays === ARCADE_WEEKDAYS.length,
                  }
                : null,
    };
}

export const arcadeIdSchema = z.coerce
    .number({ error: "잘못된 오락실입니다." })
    .int("잘못된 오락실입니다.")
    .positive("잘못된 오락실입니다.");

export const arcadeFormSchema = arcadeBaseSchema
    .superRefine(validateArcadeInput)
    .transform(normalizeArcadeInput);

export const arcadeUpdateSchema = arcadeBaseSchema
    .extend({ id: arcadeIdSchema })
    .superRefine((data, context) => validateArcadeInput(data, context))
    .transform(({ id, ...data }) => ({ id, ...normalizeArcadeInput(data) }));

export type ArcadeFormValues = z.input<typeof arcadeFormSchema>;
export type ArcadeValues = z.output<typeof arcadeFormSchema>;
export type ArcadeUpdateValues = z.output<typeof arcadeUpdateSchema>;

interface ArcadeFormCabinetSource {
    id: number;
    label: string | null;
    note: string | null;
    availability: string;
    condition: string;
}

interface ArcadeFormSource {
    name: string;
    region: string | null;
    address: string | null;
    latitude: number | null;
    longitude: number | null;
    playPrice: number | null;
    coinCount: number | null;
    businessHours?: unknown;
    // 공개 영업시간(ArcadePublicDetails.hours) — 있으면 옛 영업시간보다 먼저 쓴다
    hours?: unknown;
    cabinets?: ArcadeFormCabinetSource[];
    notes: string | null;
    isActive: boolean;
}

function dayDefaultValues(
    businessHours: ArcadeBusinessHours | null,
    key: (typeof ARCADE_WEEKDAYS)[number]["key"]
) {
    const schedule = businessHours?.weekly[key];
    return {
        enabled: Boolean(schedule),
        open: schedule?.open ?? "10:00",
        close: schedule?.close ?? "00:00",
    };
}

function isAvailability(
    value: string
): value is (typeof availabilityValues)[number] {
    return (availabilityValues as readonly string[]).includes(value);
}

function isCondition(value: string): value is (typeof conditionValues)[number] {
    return (conditionValues as readonly string[]).includes(value);
}

export function createArcadeFormDefaultValues(
    source?: ArcadeFormSource
): ArcadeFormValues {
    const publicWeekly = readPublicArcadeWeekly(source?.hours);
    const businessHours: ArcadeBusinessHours | null = publicWeekly
        ? { weekly: fromPublicArcadeWeekly(publicWeekly), openEveryDay: false }
        : normalizeArcadeBusinessHours(source?.businessHours);
    const hasValidCoordinates =
        source?.latitude !== null &&
        source?.latitude !== undefined &&
        Number.isFinite(source.latitude) &&
        source.latitude >= -90 &&
        source.latitude <= 90 &&
        source?.longitude !== null &&
        source?.longitude !== undefined &&
        Number.isFinite(source.longitude) &&
        source.longitude >= -180 &&
        source.longitude <= 180;

    return {
        name: source?.name ?? "",
        region: source
            ? inferLegacyArcadeRegion(source.region, source.address)
            : "",
        address: source?.address ?? "",
        latitude: hasValidCoordinates ? String(source.latitude) : "",
        longitude: hasValidCoordinates ? String(source.longitude) : "",
        playPrice: source?.playPrice?.toString() ?? "",
        coinCount: source?.coinCount?.toString() ?? "",
        businessHours: {
            monday: dayDefaultValues(businessHours, "monday"),
            tuesday: dayDefaultValues(businessHours, "tuesday"),
            wednesday: dayDefaultValues(businessHours, "wednesday"),
            thursday: dayDefaultValues(businessHours, "thursday"),
            friday: dayDefaultValues(businessHours, "friday"),
            saturday: dayDefaultValues(businessHours, "saturday"),
            sunday: dayDefaultValues(businessHours, "sunday"),
        },
        hoursConfirmed: false,
        cabinets: (source?.cabinets ?? []).map((cabinet) => ({
            cabinetId: String(cabinet.id),
            label: cabinet.label ?? "",
            note: cabinet.note ?? "",
            availability: isAvailability(cabinet.availability)
                ? cabinet.availability
                : "unknown",
            condition: isCondition(cabinet.condition)
                ? cabinet.condition
                : "unknown",
            confirm: false,
        })),
        notes: source?.notes ?? "",
        isActive: source?.isActive ?? true,
    };
}

function booleanFromFormData(value: FormDataEntryValue | null) {
    return value === "true" || value === "on";
}

function cabinetsFromFormData(value: FormDataEntryValue | null): unknown {
    if (typeof value !== "string" || value === "") return [];
    try {
        return JSON.parse(value);
    } catch {
        return null;
    }
}

export function arcadeFormInputFromFormData(formData: FormData) {
    const businessHours = Object.fromEntries(
        ARCADE_WEEKDAYS.map(({ key }) => [
            key,
            {
                enabled: booleanFromFormData(
                    formData.get(`hours_${key}_enabled`)
                ),
                open: String(formData.get(`hours_${key}_open`) ?? ""),
                close: String(formData.get(`hours_${key}_close`) ?? ""),
            },
        ])
    );

    return {
        name: String(formData.get("name") ?? ""),
        region: String(formData.get("region") ?? ""),
        address: String(formData.get("address") ?? ""),
        latitude: String(formData.get("latitude") ?? ""),
        longitude: String(formData.get("longitude") ?? ""),
        playPrice: String(formData.get("playPrice") ?? ""),
        coinCount: String(formData.get("coinCount") ?? ""),
        businessHours,
        hoursConfirmed: booleanFromFormData(formData.get("hoursConfirmed")),
        cabinets: cabinetsFromFormData(formData.get("cabinets")),
        notes: String(formData.get("notes") ?? ""),
        isActive: booleanFromFormData(formData.get("isActive")),
    };
}

export function arcadeUpdateInputFromFormData(formData: FormData) {
    return {
        ...arcadeFormInputFromFormData(formData),
        id: formData.get("id"),
    };
}

export function createArcadeFormData(values: ArcadeValues, id?: number) {
    const formData = new FormData();
    formData.set("name", values.name);
    formData.set("region", values.region);
    formData.set("address", values.address);
    formData.set("latitude", values.latitude?.toString() ?? "");
    formData.set("longitude", values.longitude?.toString() ?? "");
    formData.set("playPrice", values.playPrice?.toString() ?? "");
    formData.set("coinCount", values.coinCount?.toString() ?? "");
    for (const { key } of ARCADE_WEEKDAYS) {
        const schedule = values.businessHours?.weekly[key];
        formData.set(`hours_${key}_enabled`, String(Boolean(schedule)));
        formData.set(`hours_${key}_open`, schedule?.open ?? "");
        formData.set(`hours_${key}_close`, schedule?.close ?? "");
    }
    formData.set("hoursConfirmed", String(values.hoursConfirmed));
    formData.set(
        "cabinets",
        JSON.stringify(
            values.cabinets.map((cabinet) => ({
                cabinetId:
                    cabinet.cabinetId === null ? "" : String(cabinet.cabinetId),
                label: cabinet.label ?? "",
                note: cabinet.note ?? "",
                availability: cabinet.availability,
                condition: cabinet.condition,
                confirm: cabinet.confirm,
            }))
        )
    );
    formData.set("notes", values.notes ?? "");
    formData.set("isActive", String(values.isActive));
    if (id !== undefined) formData.set("id", String(id));

    return formData;
}
