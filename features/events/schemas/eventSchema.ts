import { z } from "zod";

import type { createTranslator } from "@/lib/i18n/messages";

// 유저 이벤트 글 규칙 (2026-09-18). 서버 · 브라우저 어디서나 쓰는 순수 모듈
export const EVENT_TITLE_MAX_LENGTH = 80;
export const EVENT_CONTENT_MAX_LENGTH = 5000;
export const EVENT_REVIEW_NOTE_MAX_LENGTH = 500;
export const EVENT_STATUSES = [
    "DRAFT",
    "PENDING",
    "CHANGES_REQUESTED",
    "PUBLISHED",
    "REJECTED",
] as const;
export type EventStatus = (typeof EVENT_STATUSES)[number];
export const EVENT_PHASES = ["live", "upcoming", "ended"] as const;
export type EventPhase = (typeof EVENT_PHASES)[number];
export const EVENT_REVIEW_DECISIONS = [
    "approve",
    "requestChanges",
    "reject",
] as const;
export type EventReviewDecision = (typeof EVENT_REVIEW_DECISIONS)[number];

type Translate = ReturnType<typeof createTranslator>;

// 기간은 한국 날짜(YYYY-MM-DD). 시작 = 그날 0시(KST), 끝 = 끝 날 다음 날 0시(KST, 미포함)
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const DAY_MS = 24 * 60 * 60 * 1000;
export function eventDateStart(value: string) {
    return new Date(`${value}T00:00:00+09:00`);
}
export function eventDateEnd(value: string) {
    return new Date(eventDateStart(value).getTime() + DAY_MS);
}
export function eventDateInput(date: Date, exclusiveEnd = false) {
    const shifted = new Date(
        date.getTime() + 9 * 60 * 60 * 1000 - (exclusiveEnd ? DAY_MS : 0)
    );
    return shifted.toISOString().slice(0, 10);
}
export function eventPhase(
    startsAt: Date,
    endsAt: Date,
    now: Date
): EventPhase {
    if (now < startsAt) return "upcoming";
    if (now >= endsAt) return "ended";
    return "live";
}

function validDate(value: string) {
    return DATE.test(value) && !Number.isNaN(eventDateStart(value).getTime());
}

export function createEventFormSchema(t: Translate) {
    return z
        .object({
            title: z
                .string()
                .trim()
                .min(1, t("events.form.titleRequired"))
                .max(
                    EVENT_TITLE_MAX_LENGTH,
                    t("events.form.titleTooLong", {
                        max: EVENT_TITLE_MAX_LENGTH,
                    })
                ),
            content: z
                .string()
                .transform((value) => value.replace(/\r\n?/g, "\n"))
                .pipe(
                    z
                        .string()
                        .trim()
                        .min(1, t("events.form.contentRequired"))
                        .max(
                            EVENT_CONTENT_MAX_LENGTH,
                            t("events.form.contentTooLong", {
                                max: EVENT_CONTENT_MAX_LENGTH.toLocaleString(),
                            })
                        )
                ),
            startDate: z
                .string()
                .refine(validDate, t("events.form.dateRequired")),
            endDate: z
                .string()
                .refine(validDate, t("events.form.dateRequired")),
            bannerUrl: z.string().trim(),
        })
        .superRefine((value, ctx) => {
            if (
                validDate(value.startDate) &&
                validDate(value.endDate) &&
                value.endDate < value.startDate
            ) {
                ctx.addIssue({
                    code: "custom",
                    path: ["endDate"],
                    message: t("events.form.endBeforeStart"),
                });
            }
        });
}
export type EventFormValues = z.input<ReturnType<typeof createEventFormSchema>>;

export function eventFormData(
    values: EventFormValues,
    options: { id?: number; submit: boolean; locale: string }
) {
    const formData = new FormData();
    if (options.id !== undefined) formData.set("id", String(options.id));
    formData.set("submit", options.submit ? "true" : "false");
    formData.set("locale", options.locale);
    formData.set("title", values.title);
    formData.set("content", values.content);
    formData.set("startDate", values.startDate);
    formData.set("endDate", values.endDate);
    formData.set("bannerUrl", values.bannerUrl);
    return formData;
}
export function eventInputFromFormData(formData: FormData) {
    const read = (key: string) => String(formData.get(key) ?? "");
    return {
        title: read("title"),
        content: read("content"),
        startDate: read("startDate"),
        endDate: read("endDate"),
        bannerUrl: read("bannerUrl"),
    };
}

export const eventReviewSchema = z
    .object({
        id: z.coerce.number().int().positive(),
        decision: z.enum(EVENT_REVIEW_DECISIONS, {
            error: "검토 결과를 골라 주세요.",
        }),
        note: z
            .string()
            .trim()
            .max(
                EVENT_REVIEW_NOTE_MAX_LENGTH,
                `사유는 ${EVENT_REVIEW_NOTE_MAX_LENGTH}자 이하로 써 주세요.`
            ),
    })
    .superRefine((value, ctx) => {
        // 수정 요청 · 반려는 사유가 필수 — 작성자 편집 화면 맨 위에 그대로 보인다
        if (value.decision !== "approve" && !value.note) {
            ctx.addIssue({
                code: "custom",
                path: ["note"],
                message: "사유를 써 주세요. 작성자에게 그대로 보입니다.",
            });
        }
    });

// 작성자가 고칠 수 있는 상태 — 반려된 글은 다시 요청할 수 없다(2026-09-18 결정 1)
export function canAuthorEdit(status: EventStatus) {
    return status !== "REJECTED";
}

export interface EventWorkingCopy {
    title: string;
    content: string;
    startsAt: Date;
    endsAt: Date;
    bannerUrl: string | null;
}

// 검토 결과가 바꾸는 칸 — 승인 = 작성 중인 판을 공개판으로 복사, 수정 요청 = 공개판 유지,
// 반려 = 글 전체를 내린다(공개판도 지움)
export function reviewUpdate(
    decision: EventReviewDecision,
    working: EventWorkingCopy,
    note: string,
    reviewerId: number,
    now: Date,
    publishedAt: Date | null
) {
    const reviewed = { reviewerId, reviewedAt: now };
    if (decision === "approve")
        return {
            ...reviewed,
            status: "PUBLISHED" as const,
            reviewNote: null,
            publishedTitle: working.title,
            publishedContent: working.content,
            publishedStartsAt: working.startsAt,
            publishedEndsAt: working.endsAt,
            publishedBannerUrl: working.bannerUrl,
            publishedAt: publishedAt ?? now,
        };
    if (decision === "requestChanges")
        return {
            ...reviewed,
            status: "CHANGES_REQUESTED" as const,
            reviewNote: note,
        };
    return {
        ...reviewed,
        status: "REJECTED" as const,
        reviewNote: note,
        publishedTitle: null,
        publishedContent: null,
        publishedStartsAt: null,
        publishedEndsAt: null,
        publishedBannerUrl: null,
        publishedAt: null,
    };
}

export interface PublishedEventRecord {
    id: number;
    status: EventStatus;
    publishedTitle: string | null;
    publishedContent: string | null;
    publishedStartsAt: Date | null;
    publishedEndsAt: Date | null;
    publishedBannerUrl: string | null;
    publishedAt: Date | null;
}

// 공개판이 있는 글만 공개 화면에 — 작성 중인 판의 상태(검토 대기 · 수정 요청)와 관계없이
export function publicEvent(record: PublishedEventRecord, now: Date) {
    if (
        record.status === "REJECTED" ||
        !record.publishedAt ||
        record.publishedTitle === null ||
        record.publishedContent === null ||
        !record.publishedStartsAt ||
        !record.publishedEndsAt
    )
        return null;
    return {
        id: record.id,
        title: record.publishedTitle,
        content: record.publishedContent,
        startsAt: record.publishedStartsAt.toISOString(),
        endsAt: record.publishedEndsAt.toISOString(),
        bannerUrl: record.publishedBannerUrl,
        publishedAt: record.publishedAt.toISOString(),
        phase: eventPhase(
            record.publishedStartsAt,
            record.publishedEndsAt,
            now
        ),
    };
}
export type PublicEvent = NonNullable<ReturnType<typeof publicEvent>>;

// 탭별 정렬 — 진행 중 = 끝나는 순, 예정 = 시작하는 순, 종료 = 최근에 끝난 순
export function groupPublicEvents(events: PublicEvent[]) {
    const by = (phase: EventPhase) => events.filter((e) => e.phase === phase);
    return {
        live: by("live").sort((a, b) => a.endsAt.localeCompare(b.endsAt)),
        upcoming: by("upcoming").sort((a, b) =>
            a.startsAt.localeCompare(b.startsAt)
        ),
        ended: by("ended").sort((a, b) => b.endsAt.localeCompare(a.endsAt)),
    };
}

export function eventPhaseFromQuery(value: string | undefined) {
    if (value === undefined) return "live" as const;
    return EVENT_PHASES.find((phase) => phase === value);
}
