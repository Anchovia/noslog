import { describe, expect, it } from "vitest";

import {
    createEventFormSchema,
    eventDateEnd,
    eventDateInput,
    eventDateStart,
    eventPhase,
    eventPhaseFromQuery,
    eventReviewSchema,
    groupPublicEvents,
    publicEvent,
    reviewUpdate,
} from "@/features/events/schemas/eventSchema";
import { createTranslator, getMessages } from "@/lib/i18n/messages";

const t = createTranslator(getMessages("ko"));
const working = {
    title: "가을 스코어 어택",
    content: "Real 한정",
    startsAt: eventDateStart("2026-09-20"),
    endsAt: eventDateEnd("2026-10-03"),
    bannerUrl: null,
};
const published = (overrides = {}) => ({
    id: 1,
    status: "PUBLISHED" as const,
    publishedTitle: "공개 제목",
    publishedContent: "공개 본문",
    publishedStartsAt: eventDateStart("2026-09-20"),
    publishedEndsAt: eventDateEnd("2026-10-03"),
    publishedBannerUrl: null,
    publishedAt: new Date("2026-09-18T00:00:00Z"),
    ...overrides,
});

describe("이벤트 기간 (한국 날짜)", () => {
    it("starts at KST midnight and ends after the whole last day", () => {
        expect(eventDateStart("2026-09-20").toISOString()).toBe(
            "2026-09-19T15:00:00.000Z"
        );
        expect(eventDateEnd("2026-10-03").toISOString()).toBe(
            "2026-10-03T15:00:00.000Z"
        );
        expect(eventDateInput(eventDateEnd("2026-10-03"), true)).toBe(
            "2026-10-03"
        );
        expect(eventDateInput(eventDateStart("2026-09-20"))).toBe("2026-09-20");
    });
    it("is live on the last day and ended the day after", () => {
        const start = eventDateStart("2026-09-20");
        const end = eventDateEnd("2026-10-03");
        expect(eventPhase(start, end, new Date("2026-09-19T14:59:59Z"))).toBe(
            "upcoming"
        );
        expect(eventPhase(start, end, new Date("2026-10-03T14:59:59Z"))).toBe(
            "live"
        );
        expect(eventPhase(start, end, new Date("2026-10-03T15:00:00Z"))).toBe(
            "ended"
        );
    });
});

describe("이벤트 글 입력", () => {
    it("rejects an end date before the start date and blank text", () => {
        const result = createEventFormSchema(t).safeParse({
            title: " ",
            content: "",
            startDate: "2026-09-20",
            endDate: "2026-09-19",
            bannerUrl: "",
        });
        expect(result.success).toBe(false);
        const errors = result.error!.flatten().fieldErrors;
        expect(errors.title).toBeDefined();
        expect(errors.content).toBeDefined();
        expect(errors.endDate).toEqual([t("events.form.endBeforeStart")]);
    });
    it("allows a one-day event", () => {
        expect(
            createEventFormSchema(t).safeParse({
                title: "하루",
                content: "본문",
                startDate: "2026-09-20",
                endDate: "2026-09-20",
                bannerUrl: "",
            }).success
        ).toBe(true);
    });
});

describe("이벤트 검토", () => {
    it("requires a reason for changes and rejection only", () => {
        expect(
            eventReviewSchema.safeParse({
                id: 1,
                decision: "approve",
                note: "",
            }).success
        ).toBe(true);
        for (const decision of ["requestChanges", "reject"])
            expect(
                eventReviewSchema.safeParse({ id: 1, decision, note: " " })
                    .success
            ).toBe(false);
    });
    it("approval copies the working copy and keeps the first publication date", () => {
        const first = new Date("2026-09-01T00:00:00Z");
        const now = new Date("2026-09-18T00:00:00Z");
        expect(
            reviewUpdate("approve", working, "", 9, now, first)
        ).toMatchObject({
            status: "PUBLISHED",
            publishedTitle: working.title,
            publishedAt: first,
            reviewNote: null,
            reviewerId: 9,
        });
        expect(
            reviewUpdate("approve", working, "", 9, now, null)
        ).toMatchObject({ publishedAt: now });
    });
    it("a change request keeps the public version; a rejection takes the post down", () => {
        const now = new Date();
        const changes = reviewUpdate(
            "requestChanges",
            working,
            "기간 확인",
            9,
            now,
            now
        );
        expect(changes).not.toHaveProperty("publishedTitle");
        expect(changes.status).toBe("CHANGES_REQUESTED");
        const rejected = reviewUpdate("reject", working, "광고", 9, now, now);
        expect(rejected).toMatchObject({
            status: "REJECTED",
            publishedTitle: null,
            publishedAt: null,
        });
    });
});

describe("공개 이벤트", () => {
    const now = new Date("2026-09-25T00:00:00Z");
    it("shows the approved version while a newer edit is under review", () => {
        const event = publicEvent(published({ status: "PENDING" }), now);
        expect(event).toMatchObject({ title: "공개 제목", phase: "live" });
    });
    it("hides drafts, rejected posts and posts never approved", () => {
        expect(publicEvent(published({ status: "REJECTED" }), now)).toBeNull();
        expect(
            publicEvent(
                published({ publishedAt: null, publishedTitle: null }),
                now
            )
        ).toBeNull();
    });
    it("orders live by end, upcoming by start and ended by most recent", () => {
        const make = (id: number, start: string, end: string) =>
            publicEvent(
                published({
                    id,
                    publishedStartsAt: eventDateStart(start),
                    publishedEndsAt: eventDateEnd(end),
                }),
                now
            )!;
        const board = groupPublicEvents([
            make(1, "2026-09-20", "2026-10-05"),
            make(2, "2026-09-21", "2026-09-30"),
            make(3, "2026-10-10", "2026-10-12"),
            make(4, "2026-10-01", "2026-10-02"),
            make(5, "2026-08-01", "2026-08-31"),
            make(6, "2026-09-01", "2026-09-10"),
        ]);
        expect(board.live.map((e) => e.id)).toEqual([2, 1]);
        expect(board.upcoming.map((e) => e.id)).toEqual([4, 3]);
        expect(board.ended.map((e) => e.id)).toEqual([6, 5]);
    });
    it("reads the tab from the address", () => {
        expect(eventPhaseFromQuery(undefined)).toBe("live");
        expect(eventPhaseFromQuery("ended")).toBe("ended");
        expect(eventPhaseFromQuery("done")).toBeUndefined();
    });
});
