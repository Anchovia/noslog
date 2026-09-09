import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/db", async () => {
    const url = process.env.COMMUNITY_TEST_DATABASE_URL;
    if (!url) return { default: {} };
    if (!["localhost", "127.0.0.1"].includes(new URL(url).hostname))
        throw new Error(
            "Community integration tests require a local database."
        );
    const { PrismaClient } = await import("@prisma/client");
    return { default: new PrismaClient({ datasourceUrl: url }) };
});

import db from "@/lib/db";
import { mutateChartCommunity } from "@/features/music/server/communityMutation";
import {
    getCommunityData,
    getCommunityOpinions,
    getCommunityPattern,
} from "@/features/music/server/communityData";
import { EMPTY_PATTERN_RATINGS } from "@/features/music/schemas/communitySchema";

describe.skipIf(!process.env.COMMUNITY_TEST_DATABASE_URL)(
    "community persistence in an isolated local database",
    () => {
        const index = `e2e-community-${Date.now()}`;
        let chartId: number;
        let listId: number;
        const userIds: number[] = [];
        beforeAll(async () => {
            const music = await db.music.create({
                data: {
                    index,
                    title: "Community integration fixture",
                    title_kana: "コミュニティ",
                    category: "Original",
                    category_short: "Org",
                    charts: { create: { difficulty: "Expert", level: 12 } },
                },
                include: { charts: true },
            });
            chartId = music.charts[0].id;
            for (let number = 0; number < 6; number++) {
                const user = await db.user.create({
                    data: { username: `${index}-${number}` },
                });
                userIds.push(user.id);
                await db.playData.create({
                    data: {
                        user_id: user.id,
                        music_idx: index,
                        chart_id: chartId,
                        difficulty: "Expert",
                        level: 12,
                        score: number === 5 ? 0 : 980_000,
                        rank: "S",
                        fc_type: 2,
                        play_count: 1,
                        fullcombo_count: 1,
                        pianistic_count: 0,
                        max_combo: 1000,
                        grade_basic: 1000,
                        grade_recital: 0,
                        besttime: "2026-09-06",
                    },
                });
            }
            const list = await db.tierList.findUniqueOrThrow({
                where: { slug: "basic-s" },
                include: { bands: { where: { value: 10.2 } } },
            });
            listId = list.id;
            const position = await db.tierEntry.aggregate({
                where: { tierBandId: list.bands[0].id },
                _max: { position: true },
            });
            await db.tierEntry.create({
                data: {
                    chartId,
                    tierListId: listId,
                    tierBandId: list.bands[0].id,
                    position: (position._max.position ?? 0) + 1,
                },
            });
        });
        afterAll(async () => {
            if (chartId) await db.tierEntry.deleteMany({ where: { chartId } });
            await db.user.deleteMany({ where: { id: { in: userIds } } });
            await db.music.deleteMany({ where: { index } });
            await db.$disconnect();
        });

        it("checks eligibility on save and keeps the six scopes independent", async () => {
            const input = { chartId, mode: "basic", goal: "s", value: 13.1 };
            await expect(
                mutateChartCommunity({ action: "save-vote", input }, userIds[5])
            ).rejects.toMatchObject({ code: "ineligible" });
            await expect(
                mutateChartCommunity(
                    {
                        action: "save-vote",
                        input: { ...input, mode: "recital" },
                    },
                    userIds[0]
                )
            ).rejects.toMatchObject({ code: "ineligible" });
            await mutateChartCommunity(
                { action: "save-vote", input },
                userIds[0]
            );
            await mutateChartCommunity(
                {
                    action: "save-vote",
                    input: { ...input, goal: "fc", value: 13.4 },
                },
                userIds[0]
            );
            await mutateChartCommunity(
                { action: "save-vote", input: { ...input, value: 13.2 } },
                userIds[0]
            );
            const votes = await db.chartGoalVote.findMany({
                where: { chartId, userId: userIds[0] },
                orderBy: { goal: "asc" },
            });
            expect(votes.map(({ goal, value }) => ({ goal, value }))).toEqual([
                { goal: "fc", value: 13.4 },
                { goal: "s", value: 13.2 },
            ]);
            expect(
                await db.chartGoalVoteAudit.count({
                    where: { chartId, userId: userIds[0] },
                })
            ).toBe(3);
        });

        it("keeps optional axis zero, writes independent opinions, and does not repurpose legacy axes", async () => {
            await db.chartEvaluation.create({
                data: {
                    chart_id: chartId,
                    user_id: userIds[0],
                    perceived_constant: 12.5,
                    stairs: 4,
                    chord: 3,
                    trill: 2,
                    glissando: 1,
                    repetition: 0,
                    comment: "Legacy opinion",
                },
            });
            await mutateChartCommunity(
                {
                    action: "save-evaluation",
                    input: {
                        ...EMPTY_PATTERN_RATINGS,
                        chartId,
                        stairs: 0,
                        opinion: "",
                    },
                },
                userIds[0]
            );
            await mutateChartCommunity(
                {
                    action: "save-evaluation",
                    input: {
                        ...EMPTY_PATTERN_RATINGS,
                        chartId,
                        stairs: 0,
                        opinion: "Helpful chart advice",
                    },
                },
                userIds[1]
            );
            await mutateChartCommunity(
                {
                    action: "save-evaluation",
                    input: {
                        ...EMPTY_PATTERN_RATINGS,
                        chartId,
                        stairs: 3,
                        opinion: "",
                    },
                },
                userIds[2]
            );
            const data = await getCommunityPattern(chartId);
            expect(data.stairs).toEqual({ count: 3, average: 1 });
            expect(data.polyrhythm).toEqual({ count: 0, average: null });
            expect(
                await db.chartEvaluation.findUnique({
                    where: {
                        chart_id_user_id: {
                            chart_id: chartId,
                            user_id: userIds[0],
                        },
                    },
                })
            ).toMatchObject({
                stairs: 4,
                chord: 3,
                trill: 2,
                glissando: 1,
                perceived_constant: 12.5,
                comment: "Legacy opinion",
            });
        });

        it("enforces positive-only, idempotent Helpful and deduplicates private reports", async () => {
            const evaluation =
                await db.communityChartEvaluation.findUniqueOrThrow({
                    where: { chartId_userId: { chartId, userId: userIds[1] } },
                });
            const action = {
                action: "helpful",
                evaluationId: evaluation.id,
                selected: true,
            };
            await expect(
                mutateChartCommunity(action, userIds[1])
            ).rejects.toMatchObject({ code: "unavailable" });
            await expect(
                mutateChartCommunity(action, userIds[5])
            ).rejects.toMatchObject({ code: "ineligible" });
            await mutateChartCommunity(action, userIds[0]);
            await mutateChartCommunity(action, userIds[0]);
            expect(
                await db.communityOpinionHelpful.count({
                    where: { evaluationId: evaluation.id },
                })
            ).toBe(1);
            await mutateChartCommunity(
                { ...action, selected: false },
                userIds[0]
            );
            expect(
                await db.communityOpinionHelpful.count({
                    where: { evaluationId: evaluation.id },
                })
            ).toBe(0);
            const report = {
                action: "report",
                input: { evaluationId: evaluation.id, reason: "spam" },
            };
            await mutateChartCommunity(report, userIds[0]);
            await mutateChartCommunity(report, userIds[0]);
            expect(
                await db.communityOpinionReport.count({
                    where: { evaluationId: evaluation.id },
                })
            ).toBe(1);
            const opinions = await getCommunityOpinions(
                { chartId, offset: 0, sort: "helpful" },
                userIds[0]
            );
            expect(opinions.items).toHaveLength(1);
            expect(opinions.items[0]).not.toHaveProperty("reports");
        });

        it("creates one review candidate at five votes without changing the official tier", async () => {
            for (const userId of userIds.slice(1, 5))
                await mutateChartCommunity(
                    {
                        action: "save-vote",
                        input: {
                            chartId,
                            mode: "basic",
                            goal: "s",
                            value: 13.1,
                        },
                    },
                    userId
                );
            const summary = await getCommunityData(chartId, userIds[0]);
            expect(summary.scopes).toHaveLength(6);
            expect(summary.scopes[0]).toMatchObject({
                placement: "published",
                officialValue: 10.2,
                count: 5,
            });
            expect(summary.scopes[0].average).toBeCloseTo(13.12);
            expect(
                await db.chartGoalVoteReview.count({ where: { chartId } })
            ).toBe(1);
            await mutateChartCommunity(
                {
                    action: "save-vote",
                    input: { chartId, mode: "basic", goal: "s", value: 13.3 },
                },
                userIds[0]
            );
            expect(
                await db.chartGoalVoteReview.count({ where: { chartId } })
            ).toBe(1);
            const entry = await db.tierEntry.findUniqueOrThrow({
                where: { tierListId_chartId: { tierListId: listId, chartId } },
                include: { tierBand: true },
            });
            expect(entry.tierBand.value).toBe(10.2);
        });

        it("deletes only the named contribution scope", async () => {
            await mutateChartCommunity(
                { action: "delete-opinion", chartId },
                userIds[1]
            );
            expect(
                await db.communityChartEvaluation.findUnique({
                    where: { chartId_userId: { chartId, userId: userIds[1] } },
                })
            ).toMatchObject({ stairs: 0, opinion: null });
            await mutateChartCommunity(
                { action: "delete-evaluation", chartId },
                userIds[1]
            );
            expect(
                await db.chartGoalVote.count({
                    where: { chartId, userId: userIds[1] },
                })
            ).toBe(1);
            await mutateChartCommunity(
                {
                    action: "delete-vote",
                    input: { chartId, mode: "basic", goal: "fc" },
                },
                userIds[0]
            );
            expect(
                await db.chartGoalVote.count({
                    where: { chartId, userId: userIds[0] },
                })
            ).toBe(1);
            expect(
                await db.communityChartEvaluation.count({
                    where: { chartId, userId: userIds[0] },
                })
            ).toBe(1);
        });

        it("tracks opinion recency independently of pattern edits and retains private report evidence through deletion", async () => {
            const userId = userIds[3];
            const input = {
                ...EMPTY_PATTERN_RATINGS,
                chartId,
                stairs: 2,
                opinion: "",
            };
            await mutateChartCommunity(
                { action: "save-evaluation", input },
                userId
            );
            await db.communityChartEvaluation.update({
                where: { chartId_userId: { chartId, userId } },
                data: { createdAt: new Date("2025-01-01") },
            });
            await mutateChartCommunity(
                {
                    action: "save-evaluation",
                    input: { ...input, opinion: "First opinion" },
                },
                userId
            );
            let published = (
                await getCommunityOpinions(
                    { chartId, offset: 0, sort: "newest" },
                    userIds[0]
                )
            ).items[0];
            expect(published).toMatchObject({
                opinion: "First opinion",
                edited: false,
            });
            expect(published.createdAt).toBe(published.updatedAt);
            const createdAt = published.createdAt;
            await mutateChartCommunity(
                {
                    action: "save-evaluation",
                    input: { ...input, opinion: "Revised opinion" },
                },
                userId
            );
            published = (
                await getCommunityOpinions(
                    { chartId, offset: 0, sort: "newest" },
                    userIds[0]
                )
            ).items[0];
            expect(published).toMatchObject({
                opinion: "Revised opinion",
                edited: true,
                createdAt,
            });
            const updatedAt = published.updatedAt;
            await mutateChartCommunity(
                {
                    action: "save-evaluation",
                    input: { ...input, stairs: 4, opinion: "Revised opinion" },
                },
                userId
            );
            expect(
                (
                    await getCommunityOpinions({
                        chartId,
                        offset: 0,
                        sort: "newest",
                    })
                ).items[0].updatedAt
            ).toBe(updatedAt);
            await mutateChartCommunity(
                {
                    action: "helpful",
                    evaluationId: published.id,
                    selected: true,
                },
                userIds[0]
            );
            await mutateChartCommunity(
                {
                    action: "report",
                    input: { evaluationId: published.id, reason: "spam" },
                },
                userIds[0]
            );
            await mutateChartCommunity(
                { action: "delete-opinion", chartId },
                userId
            );
            expect(
                await db.communityOpinionHelpful.count({
                    where: { evaluationId: published.id },
                })
            ).toBe(0);
            expect(
                await db.communityOpinionReport.findFirst({
                    where: { authorId: userId },
                })
            ).toMatchObject({
                evaluationId: null,
                opinionSnapshot: "Revised opinion",
            });
            await mutateChartCommunity(
                {
                    action: "save-evaluation",
                    input: { ...input, opinion: "New opinion after deletion" },
                },
                userId
            );
            const replacement = (
                await getCommunityOpinions({
                    chartId,
                    offset: 0,
                    sort: "newest",
                })
            ).items[0];
            expect(replacement).toMatchObject({
                helpfulCount: 0,
                edited: false,
            });
            await mutateChartCommunity(
                {
                    action: "report",
                    input: { evaluationId: replacement.id, reason: "other" },
                },
                userIds[0]
            );
            await mutateChartCommunity(
                { action: "delete-evaluation", chartId },
                userId
            );
            expect(
                await db.communityOpinionReport.count({
                    where: { authorId: userId, evaluationId: null },
                })
            ).toBe(2);
            await db.user.delete({ where: { id: userId } });
            expect(
                await db.communityOpinionReport.count({
                    where: { authorId: userId },
                })
            ).toBe(0);
        });

        it("updates an existing advisory review to an empty distribution after every vote is removed", async () => {
            for (const userId of userIds.filter((id) => id !== userIds[3])) {
                await mutateChartCommunity(
                    {
                        action: "delete-vote",
                        input: { chartId, mode: "basic", goal: "s" },
                    },
                    userId
                );
            }
            expect(
                await db.chartGoalVoteReview.findUnique({
                    where: {
                        chartId_mode_goal: {
                            chartId,
                            mode: "basic",
                            goal: "s",
                        },
                    },
                })
            ).toMatchObject({
                count: 0,
                mean: null,
                median: null,
                distribution: [],
            });
        });
    }
);
