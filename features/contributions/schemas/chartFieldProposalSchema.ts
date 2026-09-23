import { z } from "zod";

import type { MessageKey } from "@/lib/i18n/messageTypes";

type Translate = (key: MessageKey) => string;

/** 유저가 제안할 수 있는 채보 정보 칸(2026-09-23 1단계) — 레벨 상수는 운영자만 고친다 */
export const CHART_FIELD_PROPOSAL_FIELDS = [
    "bpm",
    "note_count",
    "duration",
    "released_at",
] as const;
export type ChartFieldProposalField =
    (typeof CHART_FIELD_PROPOSAL_FIELDS)[number];

export const PROPOSAL_EVIDENCE_KINDS = ["video", "official", "direct"] as const;
export type ProposalEvidenceKind = (typeof PROPOSAL_EVIDENCE_KINDS)[number];

export const CHART_FIELD_PROPOSAL_STATUSES = [
    "pending",
    "applied",
    "rejected",
] as const;
export type ChartFieldProposalStatus =
    (typeof CHART_FIELD_PROPOSAL_STATUSES)[number];

/** 한 사람이 하루(24시간)에 낼 수 있는 제안 수 — 장난 방지 */
export const CHART_FIELD_PROPOSAL_DAILY_LIMIT = 30;
export const PROPOSAL_EVIDENCE_URL_MAX = 500;
export const PROPOSAL_EVIDENCE_NOTE_MAX = 200;
export const PROPOSAL_REJECT_REASON_MAX = 200;

const BPM_MAX = 999;
const NOTE_COUNT_MAX = 9999;
const DURATION_MAX_SECONDS = 30 * 60;
const FIRST_RELEASE = "2017-01-01";

export function isChartFieldProposalField(
    value: unknown
): value is ChartFieldProposalField {
    return CHART_FIELD_PROPOSAL_FIELDS.includes(
        value as ChartFieldProposalField
    );
}

function todayIso() {
    return new Date().toISOString().slice(0, 10);
}

/**
 * 입력 글자를 칸마다 저장 형식으로 — 알아들을 수 없으면 null.
 * BPM 「60」 · 「60-120」(같으면 하나), 노트 수 정수, 길이 「2:04」 또는 초 → 초, 수록일 YYYY-MM-DD
 */
export function normalizeProposalValue(
    field: ChartFieldProposalField,
    raw: string
): string | null {
    const text = raw.trim().replaceAll(",", "");
    if (field === "bpm") {
        const match = /^(\d{1,3})(?:\s*[-–~]\s*(\d{1,3}))?$/.exec(text);
        if (!match) return null;
        const min = Number(match[1]);
        const max = match[2] === undefined ? min : Number(match[2]);
        if (min < 1 || max > BPM_MAX || max < min) return null;
        return min === max ? String(min) : `${min}-${max}`;
    }
    if (field === "note_count") {
        if (!/^\d{1,4}$/.test(text)) return null;
        const count = Number(text);
        return count >= 1 && count <= NOTE_COUNT_MAX ? String(count) : null;
    }
    if (field === "duration") {
        const clock = /^(\d{1,2}):([0-5]\d)$/.exec(text);
        const seconds = clock
            ? Number(clock[1]) * 60 + Number(clock[2])
            : /^\d{1,4}$/.test(text)
              ? Number(text)
              : NaN;
        return seconds >= 1 && seconds <= DURATION_MAX_SECONDS
            ? String(seconds)
            : null;
    }
    const date = /^(\d{4})-(\d{2})-(\d{2})$/.exec(text);
    if (!date) return null;
    const parsed = new Date(`${text}T00:00:00Z`);
    if (
        Number.isNaN(parsed.getTime()) ||
        parsed.toISOString().slice(0, 10) !== text ||
        text < FIRST_RELEASE ||
        text > todayIso()
    ) {
        return null;
    }
    return text;
}

export interface ChartFieldValues {
    bpm_min: number | null;
    bpm_max: number | null;
    note_count: number | null;
    duration_seconds: number | null;
    released_at: Date | string | null;
}

/** 지금 채보의 값을 제안과 같은 저장 형식으로 — 비어 있으면 null */
export function chartFieldValue(
    chart: ChartFieldValues,
    field: ChartFieldProposalField
): string | null {
    if (field === "bpm") {
        if (chart.bpm_min === null) return null;
        return chart.bpm_max !== null && chart.bpm_max !== chart.bpm_min
            ? `${chart.bpm_min}-${chart.bpm_max}`
            : String(chart.bpm_min);
    }
    if (field === "note_count") {
        return chart.note_count === null ? null : String(chart.note_count);
    }
    if (field === "duration") {
        return chart.duration_seconds === null
            ? null
            : String(chart.duration_seconds);
    }
    if (chart.released_at === null) return null;
    const date =
        typeof chart.released_at === "string"
            ? chart.released_at
            : chart.released_at.toISOString();
    return date.slice(0, 10);
}

/** 저장 형식을 화면 표기로 — 길이는 m:ss, BPM 범위는 en dash */
export function formatProposalValue(
    field: ChartFieldProposalField,
    value: string,
    locale = "ko-KR"
): string {
    if (field === "bpm") return value.replace("-", "–");
    if (field === "note_count") return Number(value).toLocaleString(locale);
    if (field === "duration") {
        const seconds = Number(value);
        return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
    }
    return value;
}

/** 저장 형식을 채보 칸 값으로 — 반영할 때 쓴다 */
export function chartFieldUpdate(
    field: ChartFieldProposalField,
    value: string
): {
    bpm_min?: number;
    bpm_max?: number;
    note_count?: number;
    duration_seconds?: number;
    released_at?: Date;
} {
    if (field === "bpm") {
        const [min, max = min] = value.split("-").map(Number);
        return { bpm_min: min, bpm_max: max };
    }
    if (field === "note_count") return { note_count: Number(value) };
    if (field === "duration") return { duration_seconds: Number(value) };
    return { released_at: new Date(`${value}T00:00:00Z`) };
}

function isHttpUrl(value: string) {
    try {
        const url = new URL(value);
        return url.protocol === "https:" || url.protocol === "http:";
    } catch {
        return false;
    }
}

export function createChartFieldProposalSchema(t: Translate) {
    return z
        .object({
            chartId: z.coerce.number().int().positive(),
            field: z.enum(CHART_FIELD_PROPOSAL_FIELDS),
            value: z.string().trim().max(20),
            evidenceKind: z.enum(PROPOSAL_EVIDENCE_KINDS),
            evidenceUrl: z
                .string()
                .trim()
                .max(PROPOSAL_EVIDENCE_URL_MAX, {
                    error: t("contribution.proposal.urlInvalid"),
                })
                .default(""),
            evidenceNote: z
                .string()
                .trim()
                .max(PROPOSAL_EVIDENCE_NOTE_MAX, {
                    error: t("contribution.proposal.noteTooLong"),
                })
                .default(""),
        })
        .superRefine((data, ctx) => {
            if (normalizeProposalValue(data.field, data.value) === null) {
                ctx.addIssue({
                    code: "custom",
                    path: ["value"],
                    message: t(`contribution.proposal.invalid.${data.field}`),
                });
            }
            if (data.evidenceKind === "direct") {
                if (!data.evidenceNote) {
                    ctx.addIssue({
                        code: "custom",
                        path: ["evidenceNote"],
                        message: t("contribution.proposal.noteRequired"),
                    });
                }
                if (data.evidenceUrl && !isHttpUrl(data.evidenceUrl)) {
                    ctx.addIssue({
                        code: "custom",
                        path: ["evidenceUrl"],
                        message: t("contribution.proposal.urlInvalid"),
                    });
                }
            } else if (!isHttpUrl(data.evidenceUrl)) {
                ctx.addIssue({
                    code: "custom",
                    path: ["evidenceUrl"],
                    message: t("contribution.proposal.urlRequired"),
                });
            }
        })
        .transform((data) => ({
            ...data,
            value: normalizeProposalValue(data.field, data.value) as string,
            evidenceUrl: data.evidenceUrl || null,
            evidenceNote: data.evidenceNote || null,
        }));
}

export type ChartFieldProposalFormValues = z.input<
    ReturnType<typeof createChartFieldProposalSchema>
>;
export type ChartFieldProposalInput = z.output<
    ReturnType<typeof createChartFieldProposalSchema>
>;

export const chartFieldProposalReviewSchema = z.discriminatedUnion("decision", [
    z.object({
        decision: z.literal("apply"),
        ids: z.array(z.coerce.number().int().positive()).min(1).max(100),
    }),
    z.object({
        decision: z.literal("reject"),
        ids: z.array(z.coerce.number().int().positive()).min(1).max(100),
        reason: z.string().trim().min(1).max(PROPOSAL_REJECT_REASON_MAX),
    }),
]);
export type ChartFieldProposalReview = z.infer<
    typeof chartFieldProposalReviewSchema
>;
