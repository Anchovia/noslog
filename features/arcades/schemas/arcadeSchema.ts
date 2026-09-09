import { z } from "zod";

import {
    ARCADE_MACHINE_STATUSES,
    ARCADE_WEEKDAYS,
    isArcadeMachineStatus,
    normalizeArcadeBusinessHours,
    type ArcadeBusinessHours,
} from "@/lib/arcadeDetails";
import {
    ARCADE_REGIONS,
    inferLegacyArcadeRegion,
    isArcadeRegion,
} from "@/lib/arcadeRegions";

export const ARCADE_NAME_MAX_LENGTH = 80;
export const ARCADE_ADDRESS_MAX_LENGTH = 160;
export const ARCADE_STATUS_NOTE_MAX_LENGTH = 200;
export const ARCADE_NOTES_MAX_LENGTH = 500;

const timePattern = /^(?:[01]\d|2[0-3]):[0-5]\d$/;
const integerPattern = /^\d+$/;
const machineStatusValues = ARCADE_MACHINE_STATUSES.map(
    ({ value }) => value
) as [
    (typeof ARCADE_MACHINE_STATUSES)[number]["value"],
    ...(typeof ARCADE_MACHINE_STATUSES)[number]["value"][],
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
    openEveryDay: z.boolean(),
});

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
    machineCount: optionalIntegerTextSchema("기체 수는", 1, 20),
    playPrice: optionalIntegerTextSchema("플레이 요금은", 1, 100000),
    coinCount: optionalIntegerTextSchema("코인 수는", 1, 100),
    businessHours: businessHoursSchema,
    machineStatus: z.enum(machineStatusValues, {
        error: "기체 상태를 선택해주세요.",
    }),
    statusNote: z
        .string()
        .trim()
        .max(
            ARCADE_STATUS_NOTE_MAX_LENGTH,
            `상태 사유는 ${ARCADE_STATUS_NOTE_MAX_LENGTH}자 이하로 입력해주세요.`
        )
        .transform((value) => value || null),
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

    let enabledDayCount = 0;
    for (const { key, label } of ARCADE_WEEKDAYS) {
        const day = data.businessHours[key];
        if (!day.enabled) continue;
        enabledDayCount += 1;
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

    if (
        data.businessHours.openEveryDay &&
        enabledDayCount !== ARCADE_WEEKDAYS.length
    ) {
        context.addIssue({
            code: "custom",
            path: ["businessHours", "openEveryDay"],
            message: "연중무휴는 모든 요일의 영업시간을 입력해주세요.",
        });
    }
}

function normalizeArcadeInput(data: ArcadeBaseInput) {
    const weekly: ArcadeBusinessHours["weekly"] = {};
    for (const { key } of ARCADE_WEEKDAYS) {
        const day = data.businessHours[key];
        if (day.enabled) weekly[key] = { open: day.open, close: day.close };
    }

    const hasBusinessHours = Object.keys(weekly).length > 0;
    return {
        ...data,
        latitude: data.latitude === "" ? null : Number(data.latitude),
        longitude: data.longitude === "" ? null : Number(data.longitude),
        businessHours: hasBusinessHours
            ? {
                  weekly,
                  openEveryDay: data.businessHours.openEveryDay,
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

interface ArcadeFormSource {
    name: string;
    region: string | null;
    address: string | null;
    latitude: number | null;
    longitude: number | null;
    machineCount: number | null;
    playPrice: number | null;
    coinCount: number | null;
    businessHours?: unknown;
    machineStatus: string;
    statusNote: string | null;
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

export function createArcadeFormDefaultValues(
    source?: ArcadeFormSource
): ArcadeFormValues {
    const businessHours = normalizeArcadeBusinessHours(source?.businessHours);
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
        machineCount: source?.machineCount?.toString() ?? "",
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
            openEveryDay: businessHours?.openEveryDay ?? false,
        },
        machineStatus:
            source && isArcadeMachineStatus(source.machineStatus)
                ? source.machineStatus
                : "unknown",
        statusNote: source?.statusNote ?? "",
        notes: source?.notes ?? "",
        isActive: source?.isActive ?? true,
    };
}

function booleanFromFormData(value: FormDataEntryValue | null) {
    return value === "true" || value === "on";
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
        machineCount: String(formData.get("machineCount") ?? ""),
        playPrice: String(formData.get("playPrice") ?? ""),
        coinCount: String(formData.get("coinCount") ?? ""),
        businessHours: {
            ...businessHours,
            openEveryDay: booleanFromFormData(formData.get("openEveryDay")),
        },
        machineStatus: String(formData.get("machineStatus") ?? "unknown"),
        statusNote: String(formData.get("statusNote") ?? ""),
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
    formData.set("machineCount", values.machineCount?.toString() ?? "");
    formData.set("playPrice", values.playPrice?.toString() ?? "");
    formData.set("coinCount", values.coinCount?.toString() ?? "");
    for (const { key } of ARCADE_WEEKDAYS) {
        const schedule = values.businessHours?.weekly[key];
        formData.set(`hours_${key}_enabled`, String(Boolean(schedule)));
        formData.set(`hours_${key}_open`, schedule?.open ?? "");
        formData.set(`hours_${key}_close`, schedule?.close ?? "");
    }
    formData.set(
        "openEveryDay",
        String(values.businessHours?.openEveryDay ?? false)
    );
    formData.set("machineStatus", values.machineStatus);
    formData.set("statusNote", values.statusNote ?? "");
    formData.set("notes", values.notes ?? "");
    formData.set("isActive", String(values.isActive));
    if (id !== undefined) formData.set("id", String(id));

    return formData;
}
