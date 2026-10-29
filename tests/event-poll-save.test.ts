import { beforeEach, describe, expect, it, vi } from "vitest";

import { createTranslator, getMessages } from "@/lib/i18n/messages";

// 이벤트 글 저장 — 공개판이 있는 글의 투표는 마감 날짜만 받는다
const tx = vi.hoisted(() => ({
    communityEvent: { update: vi.fn(), create: vi.fn() },
    poll: {
        findFirst: vi.fn(),
        update: vi.fn(),
        create: vi.fn(),
        delete: vi.fn(),
    },
    pollTranslation: { deleteMany: vi.fn(), createMany: vi.fn() },
    pollOption: { deleteMany: vi.fn(), update: vi.fn(), create: vi.fn() },
    pollOptionTranslation: { deleteMany: vi.fn(), createMany: vi.fn() },
}));
const mocks = vi.hoisted(() => ({
    synced: vi.fn(),
    ownEvent: vi.fn(),
}));

vi.mock("@/lib/session", () => ({ default: async () => ({ id: 4 }) }));
vi.mock("@/lib/admin", () => ({ requireAdmin: vi.fn() }));
vi.mock("@/lib/db", () => ({
    default: {
        dataSync: { findFirst: mocks.synced },
        communityEvent: { findFirst: mocks.ownEvent, count: vi.fn() },
        $transaction: (run: (client: typeof tx) => unknown) => run(tx),
    },
}));
vi.mock("next/cache", () => ({
    revalidatePath: vi.fn(),
    updateTag: vi.fn(),
    unstable_cache: (run: unknown) => run,
}));
vi.mock("@/lib/blob", () => ({
    createImageUploadToken: vi.fn(),
    deleteBlobIfOwned: vi.fn(),
    isImageContentType: vi.fn(),
    isValidImageBlob: vi.fn(),
}));
vi.mock("@/lib/upload-rate-limit", () => ({
    claimUploadTokenQuota: vi.fn(),
    getUploadLimitMessage: vi.fn(),
    releaseUploadTokenQuota: vi.fn(),
}));
vi.mock("@/lib/observability/server", () => ({ logServerError: vi.fn() }));

import { saveEvent } from "@/features/events/server/event-service";

const t = createTranslator(getMessages("ko"));
const question = "가장 어려운 패턴 경향은?";
const storedPoll = {
    id: 7,
    closesAt: null,
    multiple: false,
    maxChoices: null,
    results: "ALWAYS",
    showVoters: false,
    allowAddOptions: false,
    translations: [{ locale: "ko", question }],
    options: [10, 11].map((id, position) => ({
        id,
        position,
        translations: [{ locale: "ko", text: `선택지 ${position + 1}` }],
    })),
    _count: { votes: 0 },
};
const pollValue = (overrides: Record<string, unknown> = {}) =>
    JSON.stringify({
        question: { ko: question },
        options: [
            { id: 10, text: { ko: "선택지 1" } },
            { id: 11, text: { ko: "선택지 2" } },
        ],
        multiple: false,
        maxChoices: null,
        closesAt: null,
        results: "ALWAYS",
        showVoters: false,
        allowAddOptions: false,
        ...overrides,
    });

function eventForm(poll: string) {
    const data = new FormData();
    for (const [key, value] of Object.entries({
        id: "1",
        title: "가을 스코어 어택",
        content: "Real 한정",
        startDate: "2099-09-20",
        endDate: "2099-10-03",
        bannerUrl: "",
        locale: "ko",
        poll,
    }))
        data.set(key, value);
    return data;
}

describe("이벤트 글 저장 — 공개판이 있는 글의 투표", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mocks.synced.mockResolvedValue({ id: 1 });
        mocks.ownEvent.mockResolvedValue({
            id: 1,
            status: "approved",
            bannerUrl: null,
            publishedAt: new Date("2026-09-18T00:00:00Z"),
        });
        tx.communityEvent.update.mockResolvedValue({
            id: 1,
            publishedAt: new Date("2026-09-18T00:00:00Z"),
        });
        tx.poll.findFirst.mockResolvedValue(storedPoll);
        tx.poll.update.mockResolvedValue({ id: 7 });
        tx.pollOption.update.mockImplementation(({ where }) =>
            Promise.resolve({ id: where.id })
        );
    });

    it("refuses a changed question with poll.error.published and writes no poll rows", async () => {
        await expect(
            saveEvent(eventForm(pollValue({ question: { ko: "다른 질문" } })))
        ).resolves.toEqual({
            success: false,
            message: t("poll.error.published"),
        });
        expect(tx.poll.update).not.toHaveBeenCalled();
        expect(tx.pollTranslation.deleteMany).not.toHaveBeenCalled();
        expect(tx.pollOption.deleteMany).not.toHaveBeenCalled();
    });

    it("refuses removing the poll and adding a new one", async () => {
        await expect(saveEvent(eventForm("null"))).resolves.toMatchObject({
            success: false,
            message: t("poll.error.published"),
        });
        expect(tx.poll.delete).not.toHaveBeenCalled();

        tx.poll.findFirst.mockResolvedValue(null);
        await expect(
            saveEvent(
                eventForm(
                    pollValue({
                        options: [
                            { text: { ko: "선택지 1" } },
                            { text: { ko: "선택지 2" } },
                        ],
                    })
                )
            )
        ).resolves.toMatchObject({
            success: false,
            message: t("poll.error.published"),
        });
        expect(tx.poll.create).not.toHaveBeenCalled();
    });

    it("saves the post and only the new deadline", async () => {
        await expect(
            saveEvent(eventForm(pollValue({ closesAt: "2099-01-01" })))
        ).resolves.toMatchObject({ success: true, id: 1 });
        expect(tx.poll.update).toHaveBeenCalledWith({
            where: { id: 7 },
            data: { closesAt: new Date("2099-01-01") },
        });
        expect(tx.pollTranslation.deleteMany).not.toHaveBeenCalled();
    });

    it("judges by the row updated in the same transaction, not the earlier read", async () => {
        mocks.ownEvent.mockResolvedValue({
            id: 1,
            status: "pending",
            bannerUrl: null,
            publishedAt: null,
        });
        await expect(
            saveEvent(eventForm(pollValue({ question: { ko: "다른 질문" } })))
        ).resolves.toMatchObject({
            success: false,
            message: t("poll.error.published"),
        });
    });

    it("keeps the usual rules for a post that was never published", async () => {
        tx.communityEvent.update.mockResolvedValue({
            id: 1,
            publishedAt: null,
        });
        await expect(
            saveEvent(eventForm(pollValue({ question: { ko: "다른 질문" } })))
        ).resolves.toMatchObject({ success: true, id: 1 });
        expect(tx.pollTranslation.createMany).toHaveBeenCalledWith({
            data: [{ pollId: 7, locale: "ko", question: "다른 질문" }],
        });
    });
});
