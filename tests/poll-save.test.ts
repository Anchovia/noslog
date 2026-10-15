import { beforeEach, describe, expect, it, vi } from "vitest";

import type { PollInput } from "@/features/polls/schemas/poll-schema";

vi.mock("@/lib/db", () => ({ default: {} }));

import { savePollWithPost } from "@/features/polls/server/poll-service";

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
