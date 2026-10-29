import { beforeEach, describe, expect, it, vi } from "vitest";

import type { PollInput } from "@/features/polls/schemas/poll-schema";

vi.mock("@/lib/db", () => ({ default: {} }));

import {
    savePollWithPost,
    savePublishedPoll,
} from "@/features/polls/server/poll-service";

const now = new Date("2026-10-16T00:00:00.000Z");

const input = (optionIds: (number | undefined)[]): PollInput => ({
    question: { ko: "가장 어려운 패턴 경향은?" },
    options: optionIds.map((id, index) => ({
        ...(id === undefined ? {} : { id }),
        text: { ko: `선택지 ${index + 1}` },
    })),
    multiple: false,
    maxChoices: null,
    closesAt: null,
    results: "ALWAYS",
    showVoters: false,
    allowAddOptions: false,
});

function fakeTx(current: { id: number; optionIds: number[] } | null) {
    const tx = {
        poll: {
            findFirst: vi.fn().mockResolvedValue(
                current && {
                    id: current.id,
                    closesAt: null,
                    multiple: false,
                    allowAddOptions: false,
                    translations: [],
                    options: current.optionIds.map((id, position) => ({
                        id,
                        position,
                        translations: [],
                    })),
                    _count: { votes: 0 },
                }
            ),
            update: vi.fn().mockResolvedValue({ id: current?.id ?? 0 }),
            create: vi.fn().mockResolvedValue({ id: 99 }),
            delete: vi.fn(),
        },
        pollTranslation: { deleteMany: vi.fn(), createMany: vi.fn() },
        pollOption: {
            deleteMany: vi.fn(),
            update: vi.fn(({ where }) => Promise.resolve({ id: where.id })),
            create: vi.fn().mockResolvedValue({ id: 500 }),
        },
        pollOptionTranslation: { deleteMany: vi.fn(), createMany: vi.fn() },
    };
    return tx;
}

describe("투표 저장 — 선택지 소속", () => {
    let tx: ReturnType<typeof fakeTx>;

    beforeEach(() => {
        tx = fakeTx({ id: 1, optionIds: [10, 11] });
    });

    it("keeps editing this poll's own options", async () => {
        const result = await savePollWithPost(
            tx as never,
            { eventId: 1 },
            input([10, 11]),
            now
        );

        expect(result).toBeNull();
        expect(tx.pollOption.update).toHaveBeenCalledTimes(2);
    });

    it("refuses an option id from another poll and writes nothing", async () => {
        const result = await savePollWithPost(
            tx as never,
            { eventId: 1 },
            input([10, 77]),
            now
        );

        expect(result).toBe("invalid");
        expect(tx.poll.update).not.toHaveBeenCalled();
        expect(tx.pollOption.update).not.toHaveBeenCalled();
        expect(tx.pollOptionTranslation.deleteMany).not.toHaveBeenCalled();
    });

    it("refuses any option id when the post has no poll yet", async () => {
        const empty = fakeTx(null);
        const result = await savePollWithPost(
            empty as never,
            { eventId: 2 },
            input([10, undefined]),
            now
        );

        expect(result).toBe("invalid");
        expect(empty.poll.create).not.toHaveBeenCalled();
        expect(empty.pollOption.update).not.toHaveBeenCalled();
    });
});

describe("공개판이 있는 이벤트 글의 투표 — 마감 날짜만 받는다", () => {
    const stored = (closesAt: Date | null = null) => ({
        id: 1,
        closesAt,
        multiple: false,
        maxChoices: null,
        results: "ALWAYS",
        showVoters: false,
        allowAddOptions: false,
        translations: [{ locale: "ko", question: "가장 어려운 패턴 경향은?" }],
        options: [10, 11].map((id, position) => ({
            id,
            position,
            translations: [{ locale: "ko", text: `선택지 ${position + 1}` }],
        })),
        _count: { votes: 0 },
    });
    function publishedTx(current: ReturnType<typeof stored> | null) {
        const tx = fakeTx(null);
        tx.poll.findFirst.mockResolvedValue(current);
        tx.poll.update.mockResolvedValue({ id: current?.id ?? 0 });
        return tx;
    }
    const expectNothingWritten = (tx: ReturnType<typeof fakeTx>) => {
        expect(tx.poll.create).not.toHaveBeenCalled();
        expect(tx.poll.update).not.toHaveBeenCalled();
        expect(tx.poll.delete).not.toHaveBeenCalled();
        expect(tx.pollTranslation.deleteMany).not.toHaveBeenCalled();
        expect(tx.pollOption.deleteMany).not.toHaveBeenCalled();
        expect(tx.pollOption.create).not.toHaveBeenCalled();
    };

    it("refuses a changed question or option list before any vote", async () => {
        for (const poll of [
            { ...input([10, 11]), question: { ko: "다른 질문" } },
            input([10, 11, undefined]),
            input([10, undefined]),
        ]) {
            const tx = publishedTx(stored());
            await expect(
                savePublishedPoll(tx as never, { eventId: 1 }, poll, now)
            ).resolves.toBe("published");
            expectNothingWritten(tx);
        }
    });

    it("refuses adding or removing the poll", async () => {
        const empty = publishedTx(null);
        await expect(
            savePublishedPoll(
                empty as never,
                { eventId: 1 },
                input([undefined, undefined]),
                now
            )
        ).resolves.toBe("published");
        expectNothingWritten(empty);

        const tx = publishedTx(stored());
        await expect(
            savePublishedPoll(tx as never, { eventId: 1 }, null, now)
        ).resolves.toBe("published");
        expectNothingWritten(tx);

        await expect(
            savePublishedPoll(publishedTx(null) as never, { eventId: 1 }, null)
        ).resolves.toBeNull();
    });

    it("saves only the new deadline", async () => {
        const tx = publishedTx(stored());
        await expect(
            savePublishedPoll(
                tx as never,
                { eventId: 1 },
                { ...input([10, 11]), closesAt: "2026-10-20" },
                now
            )
        ).resolves.toBeNull();
        expect(tx.poll.update).toHaveBeenCalledTimes(1);
        expect(tx.poll.update).toHaveBeenCalledWith({
            where: { id: 1 },
            data: { closesAt: new Date("2026-10-20") },
        });
        expect(tx.pollTranslation.deleteMany).not.toHaveBeenCalled();
        expect(tx.pollOption.update).not.toHaveBeenCalled();
    });

    it("writes nothing when the poll is unchanged", async () => {
        const tx = publishedTx(stored(new Date("2026-10-20")));
        await expect(
            savePublishedPoll(
                tx as never,
                { eventId: 1 },
                { ...input([10, 11]), closesAt: "2026-10-20" },
                now
            )
        ).resolves.toBeNull();
        expectNothingWritten(tx);
    });

    it("keeps the closed and past-deadline rules", async () => {
        const closed = publishedTx(stored(new Date("2026-10-10")));
        await expect(
            savePublishedPoll(
                closed as never,
                { eventId: 1 },
                { ...input([10, 11]), closesAt: "2026-10-30" },
                now
            )
        ).resolves.toBe("closed");
        const past = publishedTx(stored());
        await expect(
            savePublishedPoll(
                past as never,
                { eventId: 1 },
                { ...input([10, 11]), closesAt: "2026-10-01" },
                now
            )
        ).resolves.toBe("closesAt");
        expect(closed.poll.update).not.toHaveBeenCalled();
        expect(past.poll.update).not.toHaveBeenCalled();
    });

    it("leaves unpublished posts on the usual rules (question can change before votes)", async () => {
        const tx = publishedTx(stored());
        await expect(
            savePollWithPost(
                tx as never,
                { eventId: 1 },
                { ...input([10, 11]), question: { ko: "다른 질문" } },
                now
            )
        ).resolves.toBeNull();
        expect(tx.pollTranslation.createMany).toHaveBeenCalledWith({
            data: [{ pollId: 1, locale: "ko", question: "다른 질문" }],
        });
    });
});
