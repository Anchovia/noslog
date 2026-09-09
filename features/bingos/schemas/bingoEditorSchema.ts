import { z } from "zod";

export const BINGO_CELL_COUNT = 25;

const bingoStatusSchema = z.enum(["draft", "published", "archived"], {
    error: "빙고 상태를 확인해주세요.",
});

const bingoMissionTypeSchema = z.enum(["record", "music", "category", "exam"], {
    error: "미션 종류를 확인해주세요.",
});

const bingoRuleTypeSchema = z.enum(
    ["manual", "score", "play_count", "rank", "full_combo"],
    { error: "판정 규칙을 확인해주세요." }
);

const bingoDifficultySchema = z.enum(["", "normal", "hard", "expert", "real"], {
    error: "난이도를 확인해주세요.",
});

export function normalizeBingoStatus(value: string) {
    const result = bingoStatusSchema.safeParse(value);
    return result.success ? result.data : "draft";
}

export function normalizeBingoMissionType(value: string) {
    const result = bingoMissionTypeSchema.safeParse(value);
    return result.success ? result.data : "record";
}

export function normalizeBingoRuleType(value: string) {
    const result = bingoRuleTypeSchema.safeParse(value);
    return result.success ? result.data : "manual";
}

export function normalizeBingoDifficulty(value: string) {
    const result = bingoDifficultySchema.safeParse(value);
    return result.success ? result.data : "";
}

function isValidDateInput(value: string) {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
    if (!match) return false;

    const year = Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[3]);
    const date = new Date(Date.UTC(year, month - 1, day));

    return (
        date.getUTCFullYear() === year &&
        date.getUTCMonth() === month - 1 &&
        date.getUTCDate() === day
    );
}

const dateInputSchema = z
    .string()
    .trim()
    .refine(
        (value) => value === "" || isValidDateInput(value),
        "날짜를 확인해주세요."
    );

function normalizedIntegerString(
    fallback: number,
    normalize: (value: number) => number
) {
    return z.string().transform((value) => {
        const parsed = Number(value);
        return normalize(
            Number.isFinite(parsed) ? Math.trunc(parsed) : fallback
        );
    });
}

const optionalTargetLevelSchema = z
    .string()
    .trim()
    .refine((value) => value === "" || /^\d+$/.test(value), {
        message: "레벨은 정수로 입력해주세요.",
    })
    .refine(
        (value) => value === "" || (Number(value) >= 1 && Number(value) <= 14),
        "레벨은 1에서 14 사이로 입력해주세요."
    )
    .transform((value) => (value === "" ? null : Number(value)));

export const bingoCellFormSchema = z.object({
    position: z.number().int().min(1).max(BINGO_CELL_COUNT),
    title: z.string().trim().min(1, "미션 내용을 입력해주세요."),
    missionType: bingoMissionTypeSchema,
    ruleType: bingoRuleTypeSchema,
    ruleConfig: z.string().trim(),
    categoryShort: z.string().trim(),
    targetDifficulty: bingoDifficultySchema,
    targetLevel: optionalTargetLevelSchema,
    musicIndex: z.string().trim(),
});

export const bingoFormSchema = z
    .object({
        title: z.string().trim().min(1, "빙고 제목을 입력해주세요."),
        description: z.string().trim(),
        coverMusicIndex: z.string().trim().min(1, "표지 악곡을 선택해주세요."),
        rewardNos: normalizedIntegerString(0, (value) => Math.max(0, value)),
        requiredLines: normalizedIntegerString(1, (value) =>
            Math.min(12, Math.max(1, value))
        ),
        status: bingoStatusSchema,
        startsAt: dateInputSchema,
        endsAt: dateInputSchema,
        cells: z.array(bingoCellFormSchema).length(BINGO_CELL_COUNT, {
            message: "미션 25칸을 모두 확인해주세요.",
        }),
    })
    .superRefine((value, context) => {
        const positions = new Set(value.cells.map((cell) => cell.position));
        for (let position = 1; position <= BINGO_CELL_COUNT; position += 1) {
            if (positions.has(position)) continue;
            context.addIssue({
                code: "custom",
                path: ["cells"],
                message: "미션 25칸의 위치를 모두 확인해주세요.",
            });
            break;
        }
    });

export const bingoIdSchema = z.coerce
    .number({ error: "잘못된 빙고입니다." })
    .int("잘못된 빙고입니다.")
    .positive("잘못된 빙고입니다.");

export const bingoSaveSchema = bingoFormSchema.and(
    z.object({ id: bingoIdSchema.optional() })
);

export const bingoDeleteSchema = z.object({ id: bingoIdSchema });

export type BingoCellFormValues = z.input<typeof bingoCellFormSchema>;
export type BingoCellValues = z.output<typeof bingoCellFormSchema>;
export type BingoFormValues = z.input<typeof bingoFormSchema>;
export type BingoValues = z.output<typeof bingoFormSchema>;
export type BingoSaveValues = z.output<typeof bingoSaveSchema>;

export type BingoCellFieldName = Extract<keyof BingoCellFormValues, string>;
export type BingoFormFieldName =
    | Extract<keyof BingoFormValues, string>
    | `cells.${number}.${BingoCellFieldName}`;

export function bingoSaveInputFromFormData(formData: FormData) {
    return {
        id: formData.get("id") || undefined,
        title: String(formData.get("title") ?? ""),
        description: String(formData.get("description") ?? ""),
        coverMusicIndex: String(formData.get("coverMusicIndex") ?? ""),
        rewardNos: String(formData.get("rewardNos") ?? ""),
        requiredLines: String(formData.get("requiredLines") ?? ""),
        status: String(formData.get("status") ?? ""),
        startsAt: String(formData.get("startsAt") ?? ""),
        endsAt: String(formData.get("endsAt") ?? ""),
        cells: Array.from({ length: BINGO_CELL_COUNT }, (_, offset) => {
            const position = offset + 1;
            const prefix = `cell-${position}`;

            return {
                position,
                title: String(formData.get(`${prefix}-title`) ?? ""),
                missionType: String(
                    formData.get(`${prefix}-missionType`) ?? ""
                ),
                ruleType: String(formData.get(`${prefix}-ruleType`) ?? ""),
                ruleConfig: String(formData.get(`${prefix}-ruleConfig`) ?? ""),
                categoryShort: String(
                    formData.get(`${prefix}-categoryShort`) ?? ""
                ),
                targetDifficulty: String(
                    formData.get(`${prefix}-targetDifficulty`) ?? ""
                ),
                targetLevel: String(
                    formData.get(`${prefix}-targetLevel`) ?? ""
                ),
                musicIndex: String(formData.get(`${prefix}-musicIndex`) ?? ""),
            };
        }),
    };
}

export function bingoDeleteInputFromFormData(formData: FormData) {
    return { id: formData.get("id") };
}

export function createBingoFormData(values: BingoValues, id?: number) {
    const formData = new FormData();
    if (id !== undefined) formData.set("id", String(id));
    formData.set("title", values.title);
    formData.set("description", values.description);
    formData.set("coverMusicIndex", values.coverMusicIndex);
    formData.set("rewardNos", String(values.rewardNos));
    formData.set("requiredLines", String(values.requiredLines));
    formData.set("status", values.status);
    formData.set("startsAt", values.startsAt);
    formData.set("endsAt", values.endsAt);

    for (const cell of values.cells) {
        const prefix = `cell-${cell.position}`;
        formData.set(`${prefix}-title`, cell.title);
        formData.set(`${prefix}-missionType`, cell.missionType);
        formData.set(`${prefix}-ruleType`, cell.ruleType);
        formData.set(`${prefix}-ruleConfig`, cell.ruleConfig);
        formData.set(`${prefix}-categoryShort`, cell.categoryShort);
        formData.set(`${prefix}-targetDifficulty`, cell.targetDifficulty);
        formData.set(
            `${prefix}-targetLevel`,
            cell.targetLevel === null ? "" : String(cell.targetLevel)
        );
        formData.set(`${prefix}-musicIndex`, cell.musicIndex);
    }

    return formData;
}

export function createBingoDeleteFormData(id: number) {
    const formData = new FormData();
    formData.set("id", String(id));
    return formData;
}
