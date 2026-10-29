import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("@/lib/admin", () => ({ requireAdmin: vi.fn() }));
vi.mock("@/lib/db", async () => {
    const value = process.env.TEST_DATABASE_URL;
    if (!value) return { default: {} };
    const url = new URL(value);
    if (!["localhost", "127.0.0.1"].includes(url.hostname))
        throw new Error("Poll vote tests require a local database.");
    const { PrismaClient } = await import("@prisma/client");
    const { PrismaPg } = await import("@prisma/adapter-pg");
    const { PRISMA_PG_SESSION_OPTIONS } = await import("@/lib/prisma-pg");
    return {
        default: new PrismaClient({
            adapter: new PrismaPg({
                connectionString: value,
                options: PRISMA_PG_SESSION_OPTIONS,
            }),
        }),
    };
});

import { castVote } from "@/features/polls/server/poll-service";
import db from "@/lib/db";

// 표는 공개 화면에 보이는 투표에만, 한 사람의 동시 요청은 한 번씩 차례로 — 실제 Postgres 로 본다
describe.skipIf(!process.env.TEST_DATABASE_URL)(
    "poll votes on isolated PostgreSQL",
    () => {
        const stamp = Date.now();
        let userId = 0;
        let announcementId = 0;
        let pollId = 0;
        let optionIds: number[] = [];

        beforeAll(async () => {
            const user = await db.user.create({
                data: { username: `poll-test-${stamp}` },
                select: { id: true },
            });
            userId = user.id;
            const announcement = await db.announcement.create({
                data: {
                    isPublished: false,
                    publicSlug: `poll-test-${stamp}`,
                    poll: {
                        create: {
                            options: {
                                create: [{ position: 1 }, { position: 2 }],
                            },
                        },
                    },
                },
                select: {
                    id: true,
                    poll: {
                        select: {
                            id: true,
                            options: {
                                select: { id: true },
                                orderBy: { position: "asc" },
                            },
                        },
                    },
                },
            });
            announcementId = announcement.id;
            pollId = announcement.poll!.id;
            optionIds = announcement.poll!.options.map((option) => option.id);
        });

        afterAll(async () => {
            await db.announcement.deleteMany({ where: { id: announcementId } });
            await db.user.deleteMany({ where: { id: userId } });
        });

        it("does not take votes on an unpublished announcement", async () => {
            expect(await castVote(pollId, userId, [optionIds[0]])).toBe(
                "unknown-option"
            );
            expect(await db.pollVote.count({ where: { pollId } })).toBe(0);
        });

        it("does not take votes before a scheduled announcement opens", async () => {
            await db.announcement.update({
                where: { id: announcementId },
                data: {
                    isPublished: true,
                    publishedAt: new Date(Date.now() + 86_400_000),
                },
            });
            expect(await castVote(pollId, userId, [optionIds[0]])).toBe(
                "unknown-option"
            );
        });

        it("keeps one vote when the same person votes twice at once", async () => {
            await db.announcement.update({
                where: { id: announcementId },
                data: { isPublished: true, publishedAt: new Date() },
            });
            const results = await Promise.all(
                Array.from({ length: 6 }, (_, index) =>
                    castVote(pollId, userId, [optionIds[index % 2]])
                )
            );
            expect(results).toEqual(Array(6).fill(null));
            expect(await db.pollVote.count({ where: { pollId, userId } })).toBe(
                1
            );
        });
    }
);
