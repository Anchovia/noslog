import { z } from "zod";

const positiveIdSchema = z.coerce
    .number({ error: "잘못된 채보입니다." })
    .int("잘못된 채보입니다.")
    .positive("잘못된 채보입니다.");

const musicIndexSchema = z.string().trim().min(1, "잘못된 악곡입니다.");

function optionalRoundedNumberSchema(label: string, minimum: number) {
    return z
        .string()
        .trim()
        .refine((value) => value === "" || Number.isFinite(Number(value)), {
            message: `${label} 숫자로 입력해주세요.`,
        })
        .refine(
            (value) =>
                value === "" ||
                !Number.isFinite(Number(value)) ||
                Number(value) >= minimum,
            `${label} ${minimum} 이상으로 입력해주세요.`
        )
        .transform((value) =>
            value === "" ? null : Math.max(minimum, Math.round(Number(value)))
        );
}

const optionalLevelConstantSchema = z
    .string()
    .trim()
    .refine((value) => value === "" || Number.isFinite(Number(value)), {
        message: "공식 레벨 상수를 숫자로 입력해주세요.",
    })
    .refine(
        (value) =>
            value === "" ||
            !Number.isFinite(Number(value)) ||
            (Number(value) >= 1 && Number(value) <= 14),
        "공식 레벨 상수는 1~14 사이로 입력해주세요."
    )
    .refine(
        (value) =>
            value === "" ||
            !Number.isFinite(Number(value)) ||
            Math.abs(Number(value) * 100 - Math.round(Number(value) * 100)) <
                1e-8,
        "공식 레벨 상수는 소수점 둘째 자리까지 입력해주세요."
    )
    .transform((value) => (value === "" ? null : Number(value)));

const optionalDateSchema = z
    .string()
    .trim()
    .refine((value) => {
        if (value === "") return true;
        if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;

        const date = new Date(`${value}T00:00:00.000Z`);
        return (
            !Number.isNaN(date.getTime()) &&
            date.toISOString().slice(0, 10) === value
        );
    }, "수록일을 확인해주세요.")
    .transform((value) =>
        value === "" ? null : new Date(`${value}T00:00:00.000Z`)
    );

function isOptionalUrl(value: string) {
    if (value === "") return true;

    try {
        new URL(value);
        return true;
    } catch {
        return false;
    }
}

const optionalUrlSchema = (label: string) =>
    z
        .string()
        .trim()
        .refine(isOptionalUrl, `${label} 올바른 URL로 입력해주세요.`)
        .transform((value) => value || null);

const optionalTextSchema = z
    .string()
    .trim()
    .transform((value) => value || null);

export const musicMetadataSchema = z.object({
    musicIndex: musicIndexSchema,
    description: optionalTextSchema,
    bpmMin: optionalRoundedNumberSchema("최소 BPM을", 1),
    bpmMax: optionalRoundedNumberSchema("최대 BPM을", 1),
    durationSeconds: optionalRoundedNumberSchema("길이는", 0),
});

export const chartMetadataSchema = z.object({
    chartId: positiveIdSchema,
    musicIndex: musicIndexSchema,
    levelConstant: optionalLevelConstantSchema,
    noteCount: optionalRoundedNumberSchema("노트 수는", 0),
    releasedAt: optionalDateSchema,
    unlockCondition: optionalTextSchema,
    playVideoUrl: optionalUrlSchema("플레이 영상 URL을"),
    chartPreviewUrl: optionalUrlSchema("채보 미리보기 URL을"),
});

export type MusicMetadataFormValues = z.input<typeof musicMetadataSchema>;
export type MusicMetadataValues = z.output<typeof musicMetadataSchema>;
export type MusicMetadataFieldName = Extract<
    keyof MusicMetadataFormValues,
    string
>;
export type ChartMetadataFormValues = z.input<typeof chartMetadataSchema>;
export type ChartMetadataValues = z.output<typeof chartMetadataSchema>;
export type ChartMetadataFieldName = Extract<
    keyof ChartMetadataFormValues,
    string
>;

export function musicMetadataInputFromFormData(formData: FormData) {
    return {
        musicIndex: String(formData.get("musicIndex") ?? ""),
        description: String(formData.get("description") ?? ""),
        bpmMin: String(formData.get("bpmMin") ?? ""),
        bpmMax: String(formData.get("bpmMax") ?? ""),
        durationSeconds: String(formData.get("durationSeconds") ?? ""),
    };
}

export function chartMetadataInputFromFormData(formData: FormData) {
    return {
        chartId: formData.get("chartId"),
        musicIndex: String(formData.get("musicIndex") ?? ""),
        levelConstant: String(formData.get("levelConstant") ?? ""),
        noteCount: String(formData.get("noteCount") ?? ""),
        releasedAt: String(formData.get("releasedAt") ?? ""),
        unlockCondition: String(formData.get("unlockCondition") ?? ""),
        playVideoUrl: String(formData.get("playVideoUrl") ?? ""),
        chartPreviewUrl: String(formData.get("chartPreviewUrl") ?? ""),
    };
}

export function createMusicMetadataFormData(values: MusicMetadataValues) {
    const formData = new FormData();
    formData.set("musicIndex", values.musicIndex);
    formData.set("description", values.description ?? "");
    formData.set("bpmMin", values.bpmMin?.toString() ?? "");
    formData.set("bpmMax", values.bpmMax?.toString() ?? "");
    formData.set("durationSeconds", values.durationSeconds?.toString() ?? "");
    return formData;
}

export function createChartMetadataFormData(values: ChartMetadataValues) {
    const formData = new FormData();
    formData.set("chartId", String(values.chartId));
    formData.set("musicIndex", values.musicIndex);
    formData.set("levelConstant", values.levelConstant?.toString() ?? "");
    formData.set("noteCount", values.noteCount?.toString() ?? "");
    formData.set(
        "releasedAt",
        values.releasedAt?.toISOString().slice(0, 10) ?? ""
    );
    formData.set("unlockCondition", values.unlockCondition ?? "");
    formData.set("playVideoUrl", values.playVideoUrl ?? "");
    formData.set("chartPreviewUrl", values.chartPreviewUrl ?? "");
    return formData;
}
